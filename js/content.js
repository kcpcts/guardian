let timer    =null;
    startTime=null,
    totalTime=0;
const calculate=()=>{
  if(startTime){
    let stopTime=Date.now(),
        milliseconds = stopTime - startTime - 5000,
        minutes = milliseconds / (1000 * 60);
    totalTime+=minutes;
    startTime = null;
  }
}
const scrollSession=()=>{
  if(timer!=null){
    clearTimeout(timer)
  }
  if(startTime === null) {
    startTime = Date.now();
  }
  timer=setTimeout(()=>{
    calculate();
  }, 40000);
}
window.addEventListener('scroll',scrollSession);
setTimeout(()=>{
  $(document).on("scroll",'div',function(){
    console.log("scrolling")
    scrollSession();
  })
},5000);
window.addEventListener('beforeunload',()=>{
  calculate();
  if(totalTime) chrome.runtime.sendMessage({msg:"new-scroll-session",totalTime,site:getWebsiteName()})
});
$(document).on("scroll","div",scrollSession);
const getWebsiteName=()=>{
  let url=window.location.href;
  if(url.indexOf("://")>-1){
    hostname=url.split('/')[2];
  }else{
    hostname=url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  if(hostname.indexOf("www.")==0){
    hostname = hostname.slice(4);
  }
  return hostname;
}
setInterval(()=>{
  if(!startTime && totalTime){
    chrome.runtime.sendMessage({msg:"new-scroll-session",totalTime,site:getWebsiteName()});
    startTime=null;
    totalTime=0;
  }
},2*60*1000)