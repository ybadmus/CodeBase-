
var MakeServiceCall = (url, model) => {
    return $.post(url, JSON.stringify(model))
        .then(data => {
            return data;
        }).fail(fail => {
            console.log({ fail });
        });
}