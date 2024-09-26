


const assignInfo=()=>{
	$(".min").text(rangeInput[0].value);  
    $(".max").text(rangeInput[1].value); 
}
const init=()=>{
	chrome.storage.local.get("setting",(info)=>{
		if(info && info.setting){
			$("#min").val(info.setting.min)
			$("#max").val(info.setting.max)
			

			rangeInput[0].value = info.setting.min;
      rangeInput[1].value = info.setting.max;
      setMinValueOutput();
      setMaxValueOutput();
      minRangeFill();
      maxRangeFill();
      MinVlaueBubbleStyle();
      MaxVlaueBubbleStyle();
			assignInfo();
		}
	})
	
}






const saveSettings = () => {
    let min = parseInt(rangeInput[0].value);
    let max = parseInt(rangeInput[1].value);
    if (min && max) {
        min = parseInt(min);
        max = parseInt(max);
        if (min > 0 && max > min) {
            chrome.storage.local.set({ setting: { min, max } })
            chrome.runtime.sendMessage({ msg: "re-assign" })
        }
    }
}

$(document).on("input", "input", function() {
    assignInfo();
    saveSettings();
});





init();
$(document).on("click",".bt",function(){
	let url=$(this).attr("link");
	chrome.tabs.create({url})
})


let minRangeValueGap = 5;
const range = document.getElementById("range_track");
const minval = document.querySelector(".minvalue");
const maxval = document.querySelector(".maxvalue");
const rangeInput = document.querySelectorAll("input");

let minRange, maxRange, minPercentage, maxPercentage;

const minRangeFill = () => {
  range.style.left = (rangeInput[0].value / rangeInput[0].max) * 100 + "%";
};
const maxRangeFill = () => {
  range.style.right =
    100 - (rangeInput[1].value / rangeInput[1].max) * 100 + "%";
};
const MinVlaueBubbleStyle = () => {
  minPercentage = (minRange / rangeInput[0].max) * 100;
  minval.style.left = minPercentage + "%";
  minval.style.transform = `translate(-${minPercentage / 2}%, -100%)`;
};
const MaxVlaueBubbleStyle = () => {
  maxPercentage = 100 - (maxRange / rangeInput[1].max) * 100;
  maxval.style.right = maxPercentage + "%";
  maxval.style.transform = `translate(${maxPercentage / 2}%, 100%)`;
};

const setMinValueOutput = () => {
  minRange = parseInt(rangeInput[0].value);
  minval.innerHTML = rangeInput[0].value;
};
const setMaxValueOutput = () => {
  maxRange = parseInt(rangeInput[1].value);
  maxval.innerHTML = rangeInput[1].value;
};

setMinValueOutput();
setMaxValueOutput();
minRangeFill();
maxRangeFill();
MinVlaueBubbleStyle();
MaxVlaueBubbleStyle();

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    updateFX();
    setMinValueOutput();
    setMaxValueOutput();

    minRangeFill();
    maxRangeFill();

    MinVlaueBubbleStyle();
    MaxVlaueBubbleStyle();

    if (maxRange - minRange < minRangeValueGap) {
      if (e.target.className === "min") {
        rangeInput[0].value = maxRange - minRangeValueGap;
        setMinValueOutput();
        minRangeFill();
        MinVlaueBubbleStyle();
        e.target.style.zIndex = "2";
      } else {
        rangeInput[1].value = minRange + minRangeValueGap;
        e.target.style.zIndex = "2";
        setMaxValueOutput();
        maxRangeFill();
        MaxVlaueBubbleStyle();
      }
    }
  });
});


function selectCard(cardId) {
  // Remove 'selected' class from all cards
  document.querySelectorAll('#green-box, #yellow-box, #red-box').forEach(card => {
    card.classList.remove('selected');
  });

  // Add 'selected' class to the clicked card
  document.getElementById(cardId).classList.add('selected');
}

function resetCardStyles() {
  // Reset box shadows
  greenBox.style.boxShadow = "";
  yellowBox.style.boxShadow = "";
  redBox.style.boxShadow = "";

  // Reset background and text colors
  greenBox.style.background = "";
  greenBox.style.color = "";
  yellowBox.style.background = "";
  yellowBox.style.color = "";
  redBox.style.background = "";
  redBox.style.color = "";

  // Optionally reset the gradient classes
  totalMinutesElement.classList.remove('low-gradient', 'mid-high-gradient', 'low-mid-gradient', 'high-gradient');
}

const updateFX=()=>{
  
    chrome.storage.local.get('totalMinutes', (data) => {
      if (data.totalMinutes !== undefined) {
          let totalm = data.totalMinutes;
          
          let truncatedMinutes = Math.floor(totalm); // Truncate the decimal
          document.getElementById('total-minutes').textContent = `~${truncatedMinutes}`; // Add ~ to the beginning
          let totalMinutesElement = document.getElementById('total-minutes');
          let greenBox = document.getElementById('green-box');
          let yellowBox = document.getElementById('yellow-box');
          let redBox = document.getElementById('red-box');
          totalMinutesElement.className = '';
          let min = rangeInput[0].value;
          let max = rangeInput[1].value;
          



        if (totalm > 0 && totalm < min) {
            totalMinutesElement.classList.add('low-gradient');
            greenBox.style.opacity = "1";
            greenBox.style.boxShadow = "0 0 1px 2px rgba(255, 255, 255, 0.8)";
            greenBox.style.color = "white";
            greenBox.style.background = "#5d9209";

            selectCard('green-box');
            yellowBox.style.background = "#735e12";
            yellowBox.style.color = "#121212";
            redBox.style.color = "#121212";
            redBox.style.background = "#501f1f";
            yellowBox.style.boxShadow = "none";
            redBox.style.boxShadow = "none";
            

            

        }
        if (totalm > min && totalm < max) {
            
            if (max-totalm < totalm-min) {
                totalMinutesElement.classList.add('mid-high-gradient');
                selectCard('yellow-box');
                yellowBox.style.boxShadow = "0 0 1px 2px rgba(255, 255, 255, 0.8)";
                yellowBox.style.color = "white";
                yellowBox.style.background = "#c39a02";
                
                redBox.style.boxShadow = "none";
                greenBox.style.boxShadow = "none";
                redBox.style.color = "#121212";
                redBox.style.background = "#501f1f";
                greenBox.style.color = "#121212";
                greenBox.style.background = "#395708";
            }
            else {
                
                totalMinutesElement.classList.add('low-mid-gradient');
                selectCard('yellow-box');
                yellowBox.style.boxShadow = "0 0 1px 2px rgba(255, 255, 255, 0.8)";
                yellowBox.style.color = "white";
                yellowBox.style.background = "#c39a02";

                greenBox.style.boxShadow = "none";
                redBox.style.boxShadow = "none";
                redBox.style.color = "#121212";
                redBox.style.background = "#501f1f";
                greenBox.style.color = "#121212";
                greenBox.style.background = "#395708";
            }
        }
        if (totalm > max) {
            
            totalMinutesElement.classList.add('high-gradient');
            redBox.style.boxShadow = "0 0 1px 2px rgba(255, 255, 255, 0.8)";
            redBox.style.color = "white";
            redBox.style.background = "#9b2929";

            yellowBox.style.boxShadow="none";
            greenBox.style.boxShadow = "none";
            selectCard('red-box');
            greenBox.style.color = "#121212";
            greenBox.style.background = "#395708";
            yellowBox.style.background = "#735e12";
            yellowBox.style.color = "#121212";
        }





      }
      
    

    });
}
updateFX();