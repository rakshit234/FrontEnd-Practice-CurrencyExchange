const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btnEl = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swap = document.querySelector(".swap");

window.addEventListener('load',()=>{
    updateExchangeRate();
})

for(let select of dropdowns){
    for(let currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if(select.name==='from' && currCode==="USD"){
            newOption.selected = "selected";
        }
        else if(select.name==='to' && currCode==='INR'){
            newOption.selected = "selected";
        }
        select.appendChild(newOption);
    };
    select.addEventListener("change",(evt)=>{
        updateFlag(evt.target);
    });

};

const updateFlag = (elem) => {
    let currCode = elem.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/32.png`
    let img = elem.parentElement.querySelector("img");
    img.src = newSrc;
};

btnEl.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtValue = amount.value;
    if(amtValue==='' || amtValue<0){
        amtValue = 1;
        amount.value = '1';
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let rates = data[fromCurr.value.toLowerCase()];
    let rate = rates[toCurr.value.toLowerCase()];
    let finalAmt = (amtValue * rate).toFixed(2);
    msg.innerText = `${amtValue} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
}

swap.addEventListener("click",()=>{
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    // Update the flags
    updateFlag(fromCurr);
    updateFlag(toCurr);

    // Update the exchange rate
    updateExchangeRate();
});