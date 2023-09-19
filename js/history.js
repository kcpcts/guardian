const getTodayDate=()=>{
    let date=new Date(),
        day =date.getDate(),
        month=date.getMonth()+1,
        year = date.getFullYear();
    if(day<10){
        day='0'+day;
    }
    if(month<10) {
        month='0'+month;
    }
    return day + '-' + month + '-' + year;
}
const displayHistory=(data,min,max)=>{
	$("#history").html("");
	let totalm=0;totalp=0,totals=0;
	for(const key in data){
		if(data.hasOwnProperty(key)){
            totalm+=data[key].minutes;
            totalp+=data[key].peroid;
            totals+=1;
            $("#history").append(`
            	<tr>
                 <td>${key}</td>
                 <td>${(data[key].minutes).toFixed(1)} Minutes</td>
                 <td>${data[key].peroid}</td>
                </tr>
            `)
        }
    }
    $("#total-minutes").text(totalm.toFixed(1));
    $("#total-period").text(totalp)
    $("#total-site").text(totals);
    if(totalm>min){
        if(totalm<max){
            $("#total-minutes").css({"color":"#f5c102"});
        }else{
            $("#total-minutes").css({"color":"#ff4747"});
        }
    }else{
        $("#total-minutes").css({"color":"#90e30e"});
    }
    $(".min").text(min);
    $(".max").text(max);
}
const init=()=>{
	let currentDate=getTodayDate();
	chrome.storage.local.get("setting",(info)=>{
        if(info && info.setting){
            let min=info.setting.min,
                max=info.setting.max;
            chrome.storage.local.get(currentDate,(info)=>{
            	if(info && info[currentDate]){
                   let data=info[currentDate];
                   displayHistory(data,min,max);
                }else{
                	displayHistory({},min,max);
                }
            })
        }else{
        	displayHistory({},min,max);
        }
    })
    chrome.runtime.sendMessage({msg:"re-assign"})
}
init();