const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js",
];

const APP_PREFIX = "FoodFest-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener("install", function (e) {
  e.waitUntil(
    // tells the browser to wait until the enclosing code is finished executing
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE); // adds all the files to cache to the cache storage under the cache name
    })
  );
});


self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // returns a promise with an array of the cache keys
      console.log(keyList);
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX); // any key that has an index value that matches the app prefix will be inserted into cacheKeepList
      });
      cacheKeeplist.push(CACHE_NAME); // adds the current cache name to the key list

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]); // on each iteration, if the function cannot find an index value of the key from keyList in the cache keep list, it will be deleted from the cache.
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith( //will intercept the HTTP response to send information from the service worker
    caches.match(e.request).then(function (request) { //matches the event request with the same resource that is in the cache, if it exists
      if (request) {
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request); // returns the resource if it exists, else it will fetch it from the network instead.
      }
    })
  );
});