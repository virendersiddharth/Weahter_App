const yourWeather = document.querySelector("[data-your-weather]");
const searchWeather = document.querySelector("[data-search-weather]");
const grantAccessButton = document.querySelector('[data-grant-access-button]');

const grantAccessBox = document.querySelector("[data-grant-access]");
const loaderContainer = document.querySelector("[data-loader-container]");
const searchContainer = document.querySelector('[data-search-container]')
const finalDataContainer = document.querySelector("[data-dynamic-details]");

const dynamicDataContainer = document.querySelector('[data-dynamic-value-container]');
const cityName = document.querySelector('[data-city-name]');

const inputCity = document.querySelector('[data-input-city]');
const searchIcon = document.querySelector('[data-search-icon]');

const descriptionWeather = document.querySelector('[data-description]');
const weatherIcon = document.querySelector('[data-weather-icon]');

const temprature = document.querySelector('[data-temprature]');
const windspeed = document.querySelector('[data-windspeed]');
const humidity = document.querySelector('[data-humidity]');
const clouds = document.querySelector('[data-clouds]');

const countryImage = document.querySelector('[data-country-image]');
const windspeedImage = document.querySelector('[data-windspeed-image]');
const humidityImage = document.querySelector('[data-humidity-image]');
const coludsImage = document.querySelector('[data-clouds-image]');


getDataSessionStorage();

yourWeather.addEventListener('click', ()=>{
    searchWeather.classList.remove('active');
    finalDataContainer.classList.remove('active');
    searchContainer.classList.remove('active');
    // yourWeather.classList.add('active');
    getDataSessionStorage();
})

function getDataSessionStorage(){
    yourWeather.classList.add('active');
    const userCoordinates = sessionStorage.getItem("user-coordinates");
    // console.log(userCoordinates);
    if(!userCoordinates){
        grantAccessBox.classList.add('active');
        // console.log('Inside if');
    }
    // console.log('last-session');
    else{
        const coordinates = JSON.parse(userCoordinates);
        getWeatherDetailsFromUserLocation(coordinates);
    }
}


async function getWeatherDetailsFromUserLocation(cordinates){
    try{
        // getGeoLoaction();

        const {latitude, longitude} = cordinates;
        grantAccessBox.classList.remove('active');
        loaderContainer.classList.add('active');
        
        let result1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`);
        let data1 = await result1.json();
        // console.log(data1);
        loaderContainer.classList.remove('active');
        finalDataContainer.classList.add('active');
        renderValue(data1);
    }
    catch(err){
        finalDataContainer.classList.remove('active');
        // alert('Cannot Find Try Again');
    }
}

function getGeoLoaction(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position){
    const user_coordinates = {
        latitude : position.coords.latitude,
        longitude : position.coords.longitude 
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(user_coordinates));
    getDataSessionStorage();
}

grantAccessButton.addEventListener('click', getGeoLoaction)

searchWeather.addEventListener('click', ()=>{
    yourWeather.classList.remove('active');
    grantAccessBox.classList.remove('active');
    finalDataContainer.classList.remove('active');
    loaderContainer.classList.remove('active');
    searchWeather.classList.add('active');
    searchContainer.classList.add('active');

    let str = "";
    inputCity.value = str;
})

searchIcon.addEventListener('click', ()=>{
    if(inputCity.value){
        // finalDataContainer.classList.add('active');
        getWeatherDetailsFromCity();
    }
})


const api_key = 'e4bcc3b384359208147b088b9063da1a';

async function getWeatherDetailsFromCity(){

    try{
        let city = inputCity.value;    
        finalDataContainer.classList.remove('active');
        loaderContainer.classList.add('active');
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
        let data = await result.json();
        console.log(data);
        loaderContainer.classList.remove('active');
        finalDataContainer.classList.add('active');
        renderValue(data);
    }
    catch(err){
        finalDataContainer.classList.remove('active');
        alert('Cannot Find Try Again');
    }
}

function renderValue(data){
    let tempreatueString = data?.main?.temp + " °C";
    let countryCode = data?.sys?.country;
    countryCode = countryCode.toLowerCase();
    countryCode = `https://flagcdn.com/16x12/${countryCode}.png`;

    console.log(countryCode);

    cityName.textContent = data?.name;
    countryImage.src = countryCode;

    descriptionWeather.textContent = data?.weather[0].description;
    console.log(descriptionWeather);

    let tempweathericon = data?.weather[0]?.icon;
    weatherIcon.src = `https://openweathermap.org/img/w/${tempweathericon}.png`;
    // weatherIcon.src = `https://openweathermap.org/img/w/50n.png`;

    temprature.textContent = tempreatueString;
    windspeedImage.src = `assets/wind.png`;
    windspeed.textContent = data?.wind?.speed;
    humidityImage.src = `assets/humidity.png`;
    humidity.textContent = data?.main?.humidity;
    coludsImage.src = `assets/cloud.png`;
    clouds.textContent = data?.clouds?.all;
}
