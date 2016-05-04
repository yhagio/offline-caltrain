var STATIC_CACHE_NAME = 'stm-data-1';

this.addEventListener('install', function(event) {
  var urlsToCache = [
    '/gtfs/agency.txt',
    '/gtfs/calendar.txt',
    '/gtfs/calendar_dates.txt',
    '/gtfs/fare_attributes.txt',
    '/gtfs/fare_rules.txt',
    '/gtfs/routes.txt',
    '/gtfs/shapes.txt',
    '/gtfs/stop_times.txt',
    '/gtfs/stops.txt',
    '/gtfs/trips.txt',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lovefield/2.1.8/lovefield.min.js'
    // 'https://cdn.jsdelivr.net/pouchdb/5.3.2/pouchdb.min.js'
  ];

  event.waitUntil(
    // Add cache the urls from urlsToCache
    caches.open(STATIC_CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/gtfs/agency.txt',
        '/gtfs/calendar.txt',
        '/gtfs/calendar_dates.txt',
        '/gtfs/fare_attributes.txt',
        '/gtfs/fare_rules.txt',
        '/gtfs/routes.txt',
        '/gtfs/shapes.txt',
        '/gtfs/stop_times.txt',
        '/gtfs/stops.txt',
        '/gtfs/trips.txt',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/lovefield/2.1.8/lovefield.min.js'
        // 'https://cdn.jsdelivr.net/pouchdb/5.3.2/pouchdb.min.js'
      ]);
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    // Remove the old cache
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('stm-data-') &&
                 cacheName != STATIC_CACHE_NAME;
          // Return true if you want to remove this cache,
          // but caches are shared across the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


this.addEventListener('fetch', function(event) {

  event.respondWith(
    // 4. Respond with an entry from the cache if there is one.
    // If there isn't, fetch from the network.
    caches.match(event.request).then(function(response) {
      // console.log('FETCH RES: ', response);
      if (response) return response;
      return fetch(event.request);
    })

    // 3. Custom error messages (event.request)
    // fetch('https://media.giphy.com/media/MDJcGiy1WOqOc/giphy.gif').then(function(response) {
    //   if (response.status == 404) {
    //     return new Response('Oops, not found.')
    //   }
    //   return response;
    // }).catch(function() {
    //   return new Response('Oh no! Cannot get it.')
    // })

    // 2. Respond with image by fetching it
    // fetch('http://lorempixel.com/400/200/sports/1/Dummy-Text/')

    // 1. Responds with html 
    // new Response('<p style="color: red">Hola</p>', {
    //   headers: {'Content-Type': 'text/html'}
    // })
  );
});