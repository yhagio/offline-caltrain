# Offline first transportation schedule web app for mobile & desktop

## Browsers support <sub><sup><sub><sub>made by @godban</sub></sub></sup></sub>

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- |
| last version| last version| last version| last version


![Screenshot](/screenshot.png)

### Requirement
- Allows users to select a departure and arrival trainstation
- See a list of trains times, and durations
- Initially, the application should load a default train schedule
- Use an API or a GTFS file for the data for the public transportation
- If the application is online, your schedule should reflect real-time transit data, informing the user of any delays they may encounter.

**How to run this app locally:**
```
git clone git@github.com:yhagio/offline-caltrain.git
cd offline-caltrain
npm install
gulp
```
To use `console.log()` make 
`var DEVELOPMENT = true;` instead of `false` in `./src/js/application.js`


- If you want to remove the data in indexeddb from your browser, run `indexedDB.deleteDatabase('caltrain')` on your browser console

### Resources
- [GTFS Diagram](https://upload.wikimedia.org/wikipedia/commons/2/28/GTFS_class_diagram.svg)
- [Caltrain GTFS](http://www.caltrain.com/developer.html)
- [The Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/)

**Offline Browser Database options**:
- [IndexedDB Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [PouchDB: JavaScript implementation of CouchDB](https://pouchdb.com/)
- [Lovefield: SQL-like API](https://google.github.io/lovefield/)
- [localForage: localStorage-like API](https://mozilla.github.io/localForage/)

* Lovefield seems good option for this project since the gtfs data sets are in fixed table like format, and can use SQL methods to get the combined data set from multiple tables.

- [Lovefield demos](https://github.com/google/lovefield/tree/master/demos)
- [Lovefield examples](https://github.com/google/lovefield/tree/master/docs/spec)
- [INSERT query builder](https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#42-insert-query-builder)
- [Query](https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#4-query)

### TODO
- [X] Save Caltrain data to IndexedDB via Lovefied
- [X] Retrieve the data for stops for users to select
- [X] Search the trip & display the result
- [X] Styling
- [X] ESlint
- [X] Replace Gulp with Webpack for build process
- [X] Remove pure-css and add SASS 
- [X] Cross Browser Testing (Chrome, Firefox, Safari, Opera)
- [X] ES2015 + Babel

##### Update (July 16, 2016)
- Installed [browsersync](https://www.browsersync.io/), integrated with gulp
- Removed unused files and codes
- Refactored javascript
- Modified CSS
- Added loading message

#### Build
```
npm run build:dev // Development
npm run build // Production
```

#### Testing in Virtual Machine (i.e. Microsoft Azure > IE)
```
npm run start
```
in another terminal tab  (using Ngrok)
```
npm i -g ngrok
cd dist && ngrok http 8080
```