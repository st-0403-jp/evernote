var detailArticle = $('.detail-article');
var detailImg = $('.detail-article img');
var detailele = detailArticle.children;

console.log(detailImg.length);

if (detailImg.length) {
    Array.prototype.forEach.call(detailImg, function (img) {
        console.log(1);
        img.parentNode.classList.add('img');
    });
} else {
    detailImg.parentNode.classList.add('img');    
}