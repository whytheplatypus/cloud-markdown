
var applyTheme = function(){
	console.log("test");
	$("#preview .preview_content ul, #preview .preview_content ol").prev("p, h1, h2, h3, h4, h5, h6, h7, h8").addClass("list_head");
	$("#preview .preview_content ul, #preview .preview_content ol").parent("li").addClass("list_head");
	$(".list_head").click(function(event){
		$(this).next("ul, ol").toggleClass("closed_list");
		console.log(this.tagName);
		if(this.tagName == "LI"){
			$(this).children("ul, ol").first().toggleClass("closed_list");
		}
		$(this).toggleClass("closed_list_head");
	});
}