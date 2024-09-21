


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

chrome.storage.local.get('totalMinutes', (data) => {
  if (data.totalMinutes !== undefined) {
      let totalm = data.totalMinutes;
      
      let truncatedMinutes = Math.floor(totalm); // Truncate the decimal
      document.getElementById('total-minutes').textContent = `~${truncatedMinutes}`; // Add ~ to the beginning
      let totalMinutesElement = document.getElementById('total-minutes');
      totalMinutesElement.className = '';
       
      let min = rangeInput[0].value;
      let max = rangeInput[1].value;
      console.log(min);
      console.log(max);
      console.log(totalm);



    if (totalm > 0 && totalm < min) {
        totalMinutesElement.classList.add('low-gradient');
    }
    if (totalm > min && totalm < max) {
        if (max-totalm < totalm-min) {
            totalMinutesElement.classList.add('mid-high-gradient');
        }
        else {
            totalMinutesElement.classList.add('low-mid-gradient');
        }
    }
    if (totalm > max) {
        totalMinutesElement.classList.add('high-gradient');
    }
  }
});