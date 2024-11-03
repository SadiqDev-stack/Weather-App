/*
const cacheName = 'Global Weather App';
const appAssets = [
  'images',
  './images/app_icon.png',
  './images/cloudy_sky.png',
  './images/mist_sky.png',
  './images/normal_sky.png',
  './images/raining_sky.png',
  './images/snowing_sky.png',
  './images/striking_sky.png',
  './images/sunny_sky.png',
  './images/vein_icon.png',
  'weather.json',
  'index.html',
  'weather.css',
  'weather.js',
  'weather_sw.js',
  '/'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(appAssets);
    })
  );
})


self.addEventListener('fetch',e => {
  e.respondWith(
     caches.match(e.request).then(response => {
       return response ? response : fetch(e.request)
     })
    )
})
*/
