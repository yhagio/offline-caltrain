/**
THIS FILE IS NO LONGER USED since this is
replaced with Webpack + Offline Plugin.

Make sure that Service Workers are supported.

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/bundle.sw.js', {scope: '/'})
    .then(function (registration) {
      console.log('Registered service worker');
    })
    .catch(function (e) {
      console.error('Error on registering service worker:\n', e);
    });
} else {
  console.log('Service Worker is not supported in this browser.');
}

**/