# Offline first transportation schedule web app for mobile & desktop

[![travis build](https://img.shields.io/travis/yhagio/offline-caltrain.svg?style=flat-square)](https://travis-ci.org/yhagio/offline-caltrain)


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


#### Build
```
npm run build:dev // Development
npm run build // Production
```

#### Run 
```
npm run start
```

#### Launching in Virtual Machine (i.e. Microsoft Azure > IE)
```
npm run start
```
in another terminal tab  (using Ngrok)
```
npm i -g ngrok
cd dist && ngrok http 8080
```

#### Test 
Testing with Chrome, Firefox, Safari, Opera
```
npm run test
```