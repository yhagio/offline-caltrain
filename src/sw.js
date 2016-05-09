var STATIC_CACHE_NAME = 'caltrain-1';

this.addEventListener('install', function(event) {
  var urlsToCache = [
    '/dist/gtfs/agency.txt',
    '/dist/gtfs/calendar.txt',
    '/dist/gtfs/calendar_dates.txt',
    '/dist/gtfs/fare_attributes.txt',
    '/dist/gtfs/fare_rules.txt',
    '/dist/gtfs/routes.txt',
    '/dist/gtfs/shapes.txt',
    '/dist/gtfs/stop_times.txt',
    '/dist/gtfs/stops.txt',
    '/dist/gtfs/trips.txt',
    'https://cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lovefield/2.1.8/lovefield.min.js'
  ];

  event.waitUntil(
    // Add cache the urls from urlsToCache
    caches.open(STATIC_CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/dist/gtfs/agency.txt',
        '/dist/gtfs/calendar.txt',
        '/dist/gtfs/calendar_dates.txt',
        '/dist/gtfs/fare_attributes.txt',
        '/dist/gtfs/fare_rules.txt',
        '/dist/gtfs/routes.txt',
        '/dist/gtfs/shapes.txt',
        '/dist/gtfs/stop_times.txt',
        '/dist/gtfs/stops.txt',
        '/dist/gtfs/trips.txt',
        'https://cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/lovefield/2.1.8/lovefield.min.js'
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
    // Respond with an entry from the cache if there is one.
    // If there isn't, fetch from the network.
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request);
    })
  );
});