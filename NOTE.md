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