using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace ITAPS_HOST.IServices
{
    public class ValidateInputFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {

            foreach (ControllerParameterDescriptor param in context.ActionDescriptor.Parameters)
            {
                if (param.ParameterInfo.CustomAttributes.Any(attr => attr.AttributeType == typeof(FromBodyAttribute)))
                {

                    var entity = context.ActionArguments[param.Name];
                    var objectType = ObjectPropertyInformation(entity);
                    if(!ValidateAntiXSS(objectType))
                    {
                        var responseObj = new
                        {
                            successful = false,
                            error = "The input is not valid",
                        };

                        // setting the result shortcuts the pipeline, so the action is never executed
                        context.Result = new JsonResult(responseObj)
                        {
                            StatusCode = 400
                        };
                    }


                }
            }

        }

        public override void OnActionExecuted(ActionExecutedContext context)
        { }

        public bool ValidateAntiXSS (IList objectType)
        {
            foreach(PropertyInformation item in objectType)
            {
                if(item.Type.ToLower() == "string")
                {
                    
                    if (item.Value == null || string.IsNullOrEmpty(item.Value.ToString()))
                        continue;

                    var pattren = new StringBuilder();

                    //Checks any js events i.e. onKeyUp(), onBlur(), alerts and custom js functions etc.             
                    pattren.Append(@"((alert|on\w+|function\s+\w+)\s*\(\s*(['+\d\w](,?\s*['+\d\w]*)*)*\s*\))");

                    //Checks any html tags i.e. <script, <embed, <object etc.
                    pattren.Append(@"|(<(script|iframe|embed|frame|frameset|object|img|applet|body|html|style|layer|link|ilayer|meta|bgsound))");

                    if (Regex.IsMatch(System.Web.HttpUtility.UrlDecode(item.Value.ToString()), pattren.ToString(), RegexOptions.IgnoreCase | RegexOptions.Compiled))
                        return false;

                }
            }

            return true;
        }

        public static List<PropertyInformation> ObjectPropertyInformation(object entity)
        {
            var propertyInformation = new List<PropertyInformation>();

            foreach (var property in entity.GetType().GetProperties())
            {
                if (property.PropertyType.IsPrimitive || property.PropertyType.IsValueType || property.PropertyType == typeof(string))
                {
                    propertyInformation.Add(new PropertyInformation { Name = property.Name, Value = property.GetValue(entity), Type = property.PropertyType.Name });
                }
                else if (property.PropertyType.IsClass && !typeof(IEnumerable).IsAssignableFrom(property.PropertyType))
                {
                    propertyInformation.AddRange(ObjectPropertyInformation(property.GetValue(entity)));
                }
                else
                {
                    var enumerablePropObj1 = property.GetValue(entity) as IEnumerable;

                    if (enumerablePropObj1 == null) continue;

                    var objList = enumerablePropObj1.GetEnumerator();

                    while (objList.MoveNext())
                    {
                        objList.MoveNext();
                        ObjectPropertyInformation(objList.Current);
                    }
                }
            }

            return propertyInformation;
        }

    }

    public class PropertyInformation
    {
        public string Name { get; set; }
        public object Value { get; set; }
        public string Type { get; set; }
    }

}
