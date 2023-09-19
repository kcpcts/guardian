const assignInfo=()=>{
	$(".min").text($("#min").val());
	$(".max").text($("#max").val());
}
const init=()=>{
	chrome.storage.local.get("setting",(info)=>{
		if(info && info.setting){
			$("#min").val(info.setting.min)
			$("#max").val(info.setting.max)
			assignInfo();
		}
	})
}
$(document).on("click","#save",function(){
	let min=$("#min").val(),
	    max=$("#max").val();
	if(min && max){
		min=parseInt(min);
		max=parseInt(max);
		if(min>0 && max>min){
			chrome.storage.local.set({setting:{min,max}})
		    $(this).text("Saved!");
		}else{
			$("#min").focus();
		}
		chrome.runtime.sendMessage({msg:"re-assign"})
	}else{
		$("#min").focus();
	}
})
$(document).on("input","input",assignInfo);
init();
$(document).on("click",".bt",function(){
	let url=$(this).attr("link");
	chrome.tabs.create({url})
})