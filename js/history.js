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

    let totalMinutesElement = document.getElementById('total-minutes');
    let greenBox = document.getElementById('green-box');
    let yellowBox = document.getElementById('yellow-box');
    let redBox = document.getElementById('red-box');


    // Clear previous gradient class
    totalMinutesElement.className = '';

    if (totalm > 0 && totalm < min) {
        totalMinutesElement.classList.add('low-gradient');
        greenBox.style.boxShadow = "0 0 1px 6px rgba(255, 255, 255, 0.8)";
        selectCard('green-box');
        yellowBox.style.background = "#735e12";
        yellowBox.style.color = "#121212";
        redBox.style.color = "#121212";
        redBox.style.background = "#501f1f";
        

    }
    if (totalm > min && totalm < max) {
        if (max-totalm < totalm-min) {
            totalMinutesElement.classList.add('mid-high-gradient');
            selectCard('yellow-box');
            yellowBox.style.boxShadow = "0 0 1px 6px rgba(255, 255, 255, 0.8)";
            
            redBox.style.color = "#121212";
            redBox.style.background = "#501f1f";
            greenBox.style.color = "#121212";
            greenBox.style.background = "#395708";
        }
        else {
            totalMinutesElement.classList.add('low-mid-gradient');
            selectCard('yellow-box');
            yellowBox.style.boxShadow = "0 0 1px 6px rgba(255, 255, 255, 0.8)";
            
            redBox.style.color = "#121212";
            redBox.style.background = "#501f1f";
            greenBox.style.color = "#121212";
            greenBox.style.background = "#395708";
        }
    }
    if (totalm > max) {
        totalMinutesElement.classList.add('high-gradient');
        redBox.style.boxShadow = "0 0 1px 6px rgba(255, 255, 255, 0.8)";
        selectCard('red-box');
        greenBox.style.color = "#121212";
        greenBox.style.background = "#395708";
        yellowBox.style.background = "#735e12";
        yellowBox.style.color = "#121212";
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

// Add this to your existing JavaScript file or in a <script> tag
function selectCard(cardId) {
    // Remove 'selected' class from all cards
    document.querySelectorAll('#green-box, #yellow-box, #red-box').forEach(card => {
      card.classList.remove('selected');
    });
  
    // Add 'selected' class to the clicked card
    document.getElementById(cardId).classList.add('selected');
  }
  
  
  // Add click event listeners to the cards
  


init();