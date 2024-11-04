
(e => {
const $ = ele => ele.includes('*') ?
document.querySelectorAll(ele.replace('*',''))
: document.querySelector(ele);

const date = new Date();
const now = {
  month: date.getMonth()+1,
  year: date.getFullYear(),
  day: date.getDate()
}

const shorten = word => {
  return word.length > 12
   ? word.slice(0,11) + '...' : word
}

const blurers = []

let toClose = false;
const bars = $('*.section');
const [focusSection,locationSection,foreCastSection,newUserSection,detailSection] = bars;
const url = location.href;
const confirmBar = $('.confirmBar');
const pageBlurer = $('.blurer');
const confirmMsg = confirmBar.querySelector('.message');
const confirmActionBtns = confirmBar.querySelectorAll('.actions *');
const [noBtn,yesBtn] = confirmActionBtns;
const grantBtn = locationSection.querySelector('.grant');
const skipRequestBtn = locationSection.querySelector('.skip');
const blurPage = e => pageBlurer.style.display = 'flex';
const unblurPage = e => pageBlurer.style.display = 'none';
const searchBar = $('.searchBar');
const loadBar = $('.loadBar');
const alertBox = $('.alertBox');
const forecastDisplay = focusSection.querySelector('.forecastDisplay');
const [todayDisplay,tommorowDisplay,moreDisplay] = [...forecastDisplay.children];
const [detailBgDisp,detailTempDisp,detailHumDisp,
veinIcon,detailPressureDisp,detailWindDirDisp,detailEmoji,
detailSkinTempDisp,detailStatusDisp,detailCloudCovDisp
,locationIcon,detailCityDisp,detailDateDisp,detailCountryDisp] = [...detailSection.children];


const load = (msg,state) => {
  if(state){
    blurers.push('loader')
    loadBar.querySelector('.loadText').textContent = msg;
    loadBar.style.display = 'flex'
  }else{
    blurers.pop()
    loadBar.style.display = 'none'
  }
}

const getId = ele => {
  let id;
  bars.forEach((bar,i) => {
    if(ele == bar){
      id = i
    }
  })
  
  return id
}

const alertUser = msg => {
  alertBox.textContent = msg;
  alertBox.style.bottom = '-100%';
  alertBox.style.display = 'block';
  alertBox.style.animationName = 'alert';
  setTimeout(e => {
  alertBox.style.bottom = '-100%';
  alertBox.style.display = 'none';
  alertBox.style.animationName = 'null';
  },4000)
}


const confirmation = (message,callback) => {
  blurPage()
  blurers.push('confirmation');
	confirmBar.style.display = 'flex';
	confirmMsg.textContent = message;
	yesBtn.onclick = e =>  callback(true)
	noBtn.onclick = e => callback(false)
	confirmActionBtns.forEach(btn => {
		btn.addEventListener('click',e => {
			confirmBar.style.display = 'none';
			unblurPage();
			blurers.pop()
		})
	})
}

const backgrounds = {
  cloud: './images/cloudy_sky.png',
  sunny: './images/sunny_sky.png',
  snowing: './images/icy_sky.png',
  mist: './images/dusty_sky.png',
  striking: './images/striking_sky.png',
  normal: './images/normal_sky.png',
  raining: './images/raining_sky.png'
}

const appBars = {
  histories: [],
  forward: function(bar){
    const barId = getId(bar);
    toClose = false;
    bars.forEach((bar,id) => {
      bar.style.display = id == barId ? 'flex' : 'none'
    })
    this.histories.push(barId)
  },
  back: function(){
    
    if(!blurers.length){
    const lastId = this.histories.at(-2);
    const nowId = this.histories.at(-1)
    if(nowId !== 0 && lastId !== undefined){
      bars.forEach((bar,id) => {
      bar.style.display = id == lastId ? 'flex' : 'none';
    })
    this.histories.pop();
    toClose = false;
    }else{
        confirmation('Are You Sure You Want To Exit This App',agreed => {
          if(agreed){
            toClose = true;
            for(let i = 0; i < 2; i++){
              history.back()
            }
          }
        })
    }
  }else{
    if(blurers.at(-1) == 'confirmation'){
      confirmBar.style.display = 'none';
      unblurPage();
      blurers.pop()
    }else{
      load('',false);
    }
  }
}

}


const defaultStorage = {
  location: {
    long: '',
    lat: '',
  },
  apikey: 'cb71517903c03778adc7fcfbffb37144',
  apikey2: 'c3f691a1172044b2a13a486af4fc50a0',
  forecastApi: '',
  isnewUser: true,
  forecasts: {
    list: []
  },
}

const geocodeApi = (city) => 
 `https://api.opencagedata.com/geocode/v1/json?q=Frauenplan+1%2C+99423+Weimar%2C+${city}&key=${appStorage.apikey2}`
 
const backCodeApi = (long,lat) =>
`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${long}&key=${appStorage.apikey2}`

forecastApi = (long,lat) =>
`https://api.openweathermap.org/data/2
.5/forecast?lat=${lat}&lon=${long}
&appid=${appStorage.apikey}`;


const appName = 'weather_app';
const appStorage = localStorage.getItem(appName) !== null ?
JSON.parse(localStorage.getItem(appName)) : defaultStorage;

const updateStorage = e => {
  localStorage.setItem(appName,JSON.stringify(appStorage));
}

updateStorage()
/* 
api.openweathermap.org/data/2
.5/forecast?lat={lat}&lon={lon}
&appid={API key}
*/

const getLocation = callback => {
  if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(e => {
      const {longitude,latitude} = e.coords;
      callback(longitude,latitude,'')
    },e => {
      callback('error')
    })
  }else{
    callback('support');
  }
}
 


const geocodeCity = (city,callback) => {
fetch(geocodeApi(city))
  .then(response => response.json())
  .then(data => {
    
    if(data.results.length){
    let { state, country, continent } = data.results[0].components;
    let formatted = data.results[0].formatted;
    const {lat,lng} = data.results[0].geometry;
    
    country = country ? country : 'Not Found';
    formatted = formatted ? formatted : 'Not Found';
    continent = continent ? continent : 'Not Found'
    
    callback(lng,lat,{
      lat,
      lng,
      formatted,
      state: state ? state : city,
      country,
      continent
    })
    }else{
      callback('invalid')
    }
  }).catch(er => {
    callback('connection');
  })
}


const toCelsius = fahrenheit => Math.floor((fahrenheit - 32 * 5)/9);

const getIconDetail = id => {
  // background,name,emoji
  if(id <= 232){
    return [backgrounds.striking,'Dark Thunderstrorm','🌩️']
  }else if(id <= 321 || id <= 781){
    return [backgrounds.normal,'Light Clouds','🌥️']
  }else if(id <= 531){
    return [backgrounds.raining,'Raining','🌧️']
  }else if(id <= 622){
    return [backgrounds.snowing,'Snowing','🌨️']
  }else if(id <= 781){
    return [backgrounds.mist,'Dust Sky (Mist) ','🌪️']
  }else if(id <= 800){
    return [backgrounds.sunny,'Sunny Day','☀️']
  }else{
    return [backgrounds.cloud,'Cloudy','☁️']
  }
}
/*
focusOn({
  main: {
    temp: 200,
    humidity: 10,
    pressure: {},
  },
  weather: [{
    description: 'Overcast Clouds',
    icon: '🌧️'
  }],
  city: 'Borno State',
  date: '01 Nov 2024'
})*/

const showDetails = data => {
  appBars.forward(detailSection);
  const {temp,humidity,pressure,feels_like} = data.main;
  const {description,id} = data.weather[0];
  const {speed,deg} = data.wind;
  const cloudcover = data.clouds.all;
  
  const [bg,status,emoji] = getIconDetail(id)
  
  detailBgDisp.src = bg;
  detailTempDisp.textContent = toCelsius(temp) + '°C';
  detailHumDisp.textContent = 'Humidity: ' + humidity + '%';
  detailPressureDisp.textContent = 'Air Pressure: ' + pressure + 'HPA';
  detailWindDirDisp.textContent = 'Wind Direction: ' + deg + '°';
  detailEmoji.textContent = emoji;
  detailSkinTempDisp.textContent = 'Skin Temperature: ' + toCelsius(feels_like) + '°C';
  detailStatusDisp.textContent = 'Status: ' + status;
  detailCloudCovDisp.textContent = 'Clouds Cover: ' + cloudcover + '%';
  detailCityDisp.textContent = shorten(data.city.state);
  detailDateDisp.textContent = data.date;
  detailCountryDisp.textContent = data.city.continent + ' ' + data.city.country
}

const constructVisualiser = data => {
  
  const {temp,humidity,pressure,feels_like} = data.main;
  const {description,id} = data.weather[0];
  const {speed,deg} = data.wind;
  
  const [bg,detail,emoji] = getIconDetail(id)
  
    const visualiser = document.createElement('div');
   visualiser.className = 'foreCast';
 visualiser.innerHTML = `<div class="emojiDisplay">${emoji}</div>
       <div class="tempDisplay">${toCelsius(temp)}°C</div>
       <div class="forecastDay">${data.date.split('>')[0]}</div>
 `;
 
 data.bg = bg;
 visualiser.setAttribute('data',JSON.stringify(data));
 
 let timer;
 visualiser.addEventListener('touchstart',e => {
   timer = setTimeout(e => {
     showDetails(data)
   },500)
 })
 
 visualiser.addEventListener('touchend',e => {
   clearTimeout(timer)
 })
 
 return visualiser
}


const focusOn = forecast => {
  if(forecast.main){
  const {temp,humidity} = forecast.main;
  const {description,icon,id} = forecast.weather[0];
  const [bg,status,emoji] = getIconDetail(forecast.weather[0].id);
 
  const [input,cityDisplay,dateDisplay,tempDisplay,humDisplay] = [...focusSection.children];
  cityDisplay.textContent = shorten(forecast.city.state);
  dateDisplay.textContent = `${forecast.date} > ${status} ${emoji}`
  tempDisplay.textContent = toCelsius(temp) + '°C';
  humDisplay.textContent = 'Humidity: ' + humidity + '%';
  document.body.style.backgroundImage = `url(${forecast.bg})`;
  }
}




/*
focusOn({
  main: {
    temp: 200,
    humidity: 10,
    pressure: {},
  },
  weather: [{
    description: 'Overcast Clouds',
    icon: '🌧️'
  }],
  city: 'Borno State',
  date: '01 Nov 2024'
})*/


const getDateFormat = (y,m,d) => {
  const months = ['January','Febuary','March','April','May','Jun','July','August','September','October','November','December'];
  if(d == now.day){
    return 'Today'
  }else if(d == now.day+1){
    return 'Tommorow'
  }else{
    return  `${d} ${months[m-1]} ${y}`
  }
}



const showWeather = data => {
  let list;
  let [todayDisplay,tommorowDisplay,moreDisplay] = [...forecastDisplay.children]

  if(data.list.length){
  list = data.list.filter((weather, ind) => 
   ind % 8 == 0 ? weather : null
  )
  
  const container = foreCastSection.querySelector('.forecastDisplay');
  container.innerHTML = '';

  list.forEach((forecast, i) => {
    // update to check if date meets current day
    const [year, month, day] = forecast.dt_txt.split(' ')[0].split('-');
    forecast.city = data.city
    if (i == 0) {
      forecast.date = shorten(getDateFormat(year,month,day));
      const visualiser = constructVisualiser(forecast);
      forecastDisplay.replaceChild(visualiser, todayDisplay);
     // focusOn(JSON.parse(visualiser.getAttribute('data')));
    } else if (i == 1) {
      forecast.date = shorten(getDateFormat(year,month,day));
      const visualiser = constructVisualiser(forecast);
      forecastDisplay.replaceChild(visualiser, tommorowDisplay);
    }
  
    forecast.date = getDateFormat(year, month, day);
    const visualiser = constructVisualiser(forecast);
    container.appendChild(visualiser)
  
 
  });
  
  [...forecastDisplay.children].forEach((v, i) => {
  
  if (i !== 2) {
    v.onclick = e => {
        [...forecastDisplay.children].forEach((sv, si) => {
        sv.style.background = si == i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)';
      })
      focusOn(JSON.parse(v.getAttribute('data')))
    }
  }
  
  });
  
  [todayDisplay,tommorowDisplay,moreDisplay] = [...forecastDisplay.children]
   todayDisplay.click()
  
  }
  
  }


const updateWeather = (long,lat,city) => {
if(long !== 'invalid' && long !== 'connection'){
load('Getting Weather Of ' + shorten(city.state),true);
fetch(forecastApi(long,lat))
.then(response => response.json())
.then(data => {
  load('',false)
  data.city = city
  showWeather(data);
  appStorage.forecasts = data;
  updateStorage();
}).catch(er => {
  load('',false)
  alertUser('Fail To Get Weather Of ' + shorten(city.state) + ' Error/Bad Connection Occured');
  showWeather(appStorage.forecasts)
})
}else{
  load('',false);
  showWeather(appStorage.forecasts)
  alertUser(long == 'invalid' ? 'Invalid City Name Or Today Free Trial Ended' : 'Fail To Get Weather Bad Connection')
}
}

const introduceUser = e => {
  const introductionPart = $('*.newUser .msg');
  let focusPart = 0;
  
  const proceed = e => {
    if(focusPart !== 3){
      introductionPart.forEach((p,i) => p.style.display = i == focusPart ? 'flex' : 'none')
      focusPart++
    }else{
      appBars.forward(locationSection);
      appStorage.isnewUser = false;
      updateStorage()
    }
  }
  
    
  proceed()
  
  introductionPart.forEach(part => part.querySelector('.proceed').onclick = e => proceed());
}


const backCodePosition = (lat,long,callback) => {
  fetch(backCodeApi(long,lat))
  .then(response => response.json())
  .then(data => {
    if(data.results.length){
     const { state, country, continent } = data.results[0].components;
     const formatted = data.results[0].formatted;
     const { lat, lng } = data.results[0].geometry
     callback(lng, lat, {
       state,
       country,
       formatted,
       continent,
     })
    }else{
      callback('invalid');
    }
  }).catch(er => {
    callback('connection');
  })
}




if(appStorage.isnewUser){
  newUserSection.style.display = 'flex';
  introduceUser();
}else{
  appBars.forward(focusSection);
  load('Getting Your Current City...', true)
  getLocation((lon, lat) => {
  appBars.forward(focusSection)
  if (lon && lon !== 'error') {
    load('Getting Your Current City...',true)
    backCodePosition(lat, lon, updateWeather)
  } else {
    load('', false);
    appBars.forward(focusSection);
    lon == 'error' ? alertUser('Turn On Location,Or Give Permission') : null;
    showWeather(appStorage.forecasts)
  }
})}

history.pushState('last',null,url)

onpopstate = e => {
  if(!toClose && e.state == null){
  appBars.back();
  history.forward(1)
  e.preventDefault()
  }
}



grantBtn.onclick = e => {
  load('Getting Your Current City...',true)
  getLocation((lon,lat) => {
    appBars.forward(focusSection)
    if(lon !== 'support' && lon !== 'error'){
    load('Getting Your Current City...')
    backCodePosition(lat,lon,updateWeather)
    }else{
      load('',false);
      appBars.forward(focusSection);
      lon == 'error' ? alertUser('Turn On Location,Or Give Permission') : alertUser('Your Device Dosnt Support Location');
    }
  })
}


skipRequestBtn.onclick = e => appBars.forward(focusSection)

searchBar.addEventListener('search',e => {
  searchBar.blur()
  const city = searchBar.value.split(' ')[0].trim().toLowerCase();
  load(`Loading ${city} Weather ForeCast`,true);
  geocodeCity(city,updateWeather);
})

moreDisplay.onclick = e => appBars.forward(foreCastSection)

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/weather_sw.js')
}
})(); and
