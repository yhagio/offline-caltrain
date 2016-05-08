# Offline first transportation schedule web app for mobile & desktop

### Requirement
- Allows users to select a departure and arrival trainstation
- See a list of trains times, and durations
- Initially, the application should load a default train schedule
- Use an API or a GTFS file for the data for the public transportation
- If the application is online, your schedule should reflect real-time transit data, informing the user of any delays they may encounter.

**How to run this app:**
- Clone this repo
- On terminal, run `npm install`
- Install npm package `http-server` to run (`npm i -g http-server`).
- On terminal, run `gulp` and run `cd dist && http-server` on another tab 
- Visit `http://localhost:8080/`

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
- [ ] Styling


