// ***** Experiment Vanilla IndexedDB

// var DB_NAME = "test";

// var request = indexedDB.open(DB_NAME, 1);

// request.onerror = function(e) {
//   console.log('Error: \n', e);
// }

// request.onupgradeneeded = function(e) {
//   var db = e.target.result;

//   var objectStore = db.createObjectStore('people');

//   objectStore.transaction.oncomplete = function(e) {
//     var peopleStore = db.transaction("people", "readwrite").objectStore("people");

//   }
// }