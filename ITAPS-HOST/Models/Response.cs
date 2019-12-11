using System.Collections.Generic;

namespace ITAPS_HOST.Models
{
    public class ResponseItem<TModel>
    {
        public string Status { get; set; }
        public string Caption { get; set; }
        public IEnumerable<TModel> Body { get; set; }
    }
    public class ResponseItemForCreationDto<TModel>
    {
        public string Status { get; set; }
        public string Caption { get; set; }
        public TModel Body { get; set; }
    }
    public class ResponseItemForSingleObject<TModel>
    {
        public string Status { get; set; }
        public string Caption { get; set; }
        public TModel Body { get; set; }
    }

}
