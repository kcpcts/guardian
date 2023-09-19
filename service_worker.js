chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason=="install"){
        chrome.storage.local.set({setting:{min:45,max:75}})
    }
});
chrome.runtime.onMessage.addListener(function(req,res,reply){
    if(req.msg=="new-scroll-session"){
        addNewSession(req.site,req.totalTime)
    }else
    if(req.msg=="re-assign"){
        reAssign();
    }
    return true;
})
const addNewSession=(site,minutes)=>{
    let currentDate=getTodayDate(),newData={};
    chrome.storage.local.get(currentDate,(info)=>{
        let data={},obj={minutes:0,peroid:0};
        if(info && info[currentDate]){
            data=info[currentDate];
        }
        if(data[site]){
            obj=data[site];
        }
        let mint=parseFloat(obj.minutes)+minutes;
        if(mint<=0) mint=0;
        obj.minutes=mint;
        obj.peroid=parseFloat(obj.peroid)+1;
        data[site]=obj;
        newData[currentDate]=data;
        chrome.storage.local.set(newData);
        displayBadges(data)
    })
}
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
const changeBadge=(color,text,title)=>{
    chrome.action.setBadgeBackgroundColor({color});
    chrome.action.setBadgeText({text});
    chrome.action.setTitle({title});
}
const displayBadges=(data)=>{
    chrome.storage.local.get("setting",(info)=>{
        if(info && info.setting){
            let min=info.setting.min,
                max=info.setting.max;
                total=0;
            for(const key in data){
                if(data.hasOwnProperty(key)){
                    total+=data[key].minutes;
                }
            }
            total=Math.floor(total);
            if(total>min){
                if(total<max){
                    changeBadge("#f5c102",`${total} Min`,"Balanced Screen Alert: You have exceeded "+min+" min of Daily scrolling time! Consider a walk outside!");
                }else{
                    changeBadge("#ff4747",`${total} Min`,"Balanced Screen Nutrition Warning: You have exceeded "+max+" min of scrolling time for today");
                }
            }else{
                changeBadge("#90e30e",`${total} Min`,"Balanced Screen Note:Well Done! You are under "+min+" min of Daily scrolling time!");
            }
        }
    })
}

let cd=getTodayDate();
chrome.storage.local.get(cd,(info)=>{
    if(!info || !info[cd]){
        data=info[cd];
        chrome.action.setTitle({title:"Balanced Screen Nutrition: Track your daily scrolling for a healthier wellbeing!"});
    }
});
const reAssign=()=>{
    let currentDate=getTodayDate();
    chrome.storage.local.get(currentDate,(info)=>{
        if(info && info[currentDate]){
            let data=info[currentDate];
                displayBadges(data)
            }
    })
}