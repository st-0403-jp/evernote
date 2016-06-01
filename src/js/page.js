console.log(1);
var source = $('#blog-temp').innerHTML;
var template = Handlebars.compile(source);
var html = template();
$('article').innerHTML = html;
