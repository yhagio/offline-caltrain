// 1. Build schema (getDBConnection)
// 2. Establish database connection (buildSchema)
// 3. Retrieve all the tables (onConnected)
// 4. Import the GTFS data to IndexedDB (insertData

var CaltrainData = function() {
  this.db = null;
  window.CT = this;
} 

CaltrainData.prototype.getDBConnection = function() {
  var self = this;
  // if (this.db != null) {
  //   return this.db;
  // }
  if (self.db !== null) {
    return Promise.resolve(self.db);
  }

  var connectOptions = {storeType: lf.schema.DataStoreType.INDEXED_DB};
  return self.buildSchema().connect(connectOptions).then(function(db) {
    self.db = db;
    self.onConnected();
    // TODO: Import and Sync the GTFS files
    self.insertData();
    return db;
  });
};

CaltrainData.prototype.onConnected = function() {
  this.calendar = this.db.getSchema().table('calendar');
  this.calendar_dates = this.db.getSchema().table('calendar_dates');
  this.fare_attributes = this.db.getSchema().table('fare_attributes');
  this.fare_rules = this.db.getSchema().table('fare_rules');
  this.routes = this.db.getSchema().table('routes');
  this.shapes = this.db.getSchema().table('shapes');
  this.stop_times = this.db.getSchema().table('stop_times');
  this.stops = this.db.getSchema().table('stops');
  this.trips = this.db.getSchema().table('trips');

  console.log('DB connection established');
}

CaltrainData.prototype.buildSchema = function() {
  var schemaBuilder = lf.schema.create('caltrain', 1);

  schemaBuilder.createTable('calendar').
    addColumn('service_id', lf.Type.STRING).
    addColumn('monday', lf.Type.INTEGER).
    addColumn('tuesday', lf.Type.INTEGER).
    addColumn('wednesday', lf.Type.INTEGER).
    addColumn('thursday', lf.Type.INTEGER).
    addColumn('friday', lf.Type.INTEGER).
    addColumn('saturday', lf.Type.INTEGER).
    addColumn('sunday', lf.Type.INTEGER).
    addColumn('start_date', lf.Type.STRING).
    addColumn('end_date', lf.Type.STRING).
    addPrimaryKey(['service_id']);

  schemaBuilder.createTable('calendar_dates').
    addColumn('service_id', lf.Type.STRING).
    addColumn('date', lf.Type.STRING).
    addColumn('exception_type', lf.Type.INTEGER).
    addPrimaryKey(['service_id']);

  schemaBuilder.createTable('fare_attributes').
    addColumn('fare_id', lf.Type.STRING).
    addColumn('price', lf.Type.INTEGER).
    addColumn('currency_type', lf.Type.STRING).
    addColumn('payment_method', lf.Type.INTEGER).
    addColumn('transfers', lf.Type.INTEGER).
    addColumn('transfer_duration', lf.Type.INTEGER). // Blank in file
    addPrimaryKey(['fare_id']);

  schemaBuilder.createTable('fare_rules').
    addColumn('fare_id', lf.Type.STRING).
    addColumn('route_id', lf.Type.STRING).
    addColumn('origin_id', lf.Type.INTEGER).
    addColumn('destination_id', lf.Type.INTEGER).
    addPrimaryKey(['fare_id']);

  schemaBuilder.createTable('routes').
    addColumn('route_id', lf.Type.STRING).
    addColumn('route_short_name', lf.Type.STRING).
    addColumn('route_long_name', lf.Type.STRING).
    addColumn('route_type', lf.Type.INTEGER).
    addColumn('route_color', lf.Type.STRING).
    addPrimaryKey(['route_id']);

  schemaBuilder.createTable('shapes').
    addColumn('shape_id', lf.Type.STRING).
    addColumn('shape_pt_lat', lf.Type.STRING).
    addColumn('shape_pt_lon', lf.Type.STRING).
    addColumn('shape_pt_sequence', lf.Type.INTEGER).
    addColumn('shape_dist_traveled', lf.Type.INTEGER). // Blank in file
    addPrimaryKey(['shape_id']);

  schemaBuilder.createTable('stop_times').
    addColumn('trip_id', lf.Type.STRING).
    addColumn('arrival_time', lf.Type.STRING).
    addColumn('departure_time', lf.Type.STRING).
    addColumn('stop_id', lf.Type.STRING).
    addColumn('stop_sequence', lf.Type.INTEGER).
    addColumn('pickup_type', lf.Type.INTEGER).
    addColumn('drop_off_type', lf.Type.INTEGER).
    addPrimaryKey(['trip_id']);

  schemaBuilder.createTable('stops').
    addColumn('stop_id', lf.Type.STRING).
    addColumn('stop_code', lf.Type.STRING).
    addColumn('stop_name', lf.Type.STRING).
    addColumn('stop_lat', lf.Type.STRING).
    addColumn('stop_lon', lf.Type.STRING).
    addColumn('zone_id', lf.Type.STRING).
    addColumn('stop_url', lf.Type.STRING).
    addColumn('location_type', lf.Type.INTEGER).
    addColumn('parent_station', lf.Type.STRING).
    addColumn('platform_code', lf.Type.STRING).
    addColumn('wheelchair_boarding', lf.Type.INTEGER).
    addPrimaryKey(['stop_id']);

  schemaBuilder.createTable('trips').
    addColumn('route_id', lf.Type.STRING).
    addColumn('service_id', lf.Type.STRING).
    addColumn('trip_id', lf.Type.STRING).
    addColumn('trip_headsign', lf.Type.STRING).
    addColumn('trip_short_name', lf.Type.INTEGER).
    addColumn('direction_id', lf.Type.INTEGER).
    addColumn('shape_id', lf.Type.STRING).
    addColumn('wheelchair_accessible', lf.Type.INTEGER).
    addColumn('bikes_allowed', lf.Type.INTEGER).
    addPrimaryKey(['route_id']);

  console.log('Schema created');
  return schemaBuilder;
};

CaltrainData.prototype.insertData = function() {
  // Fetch all the GTFS files and loop through them.
  // On reading each file, get the corresponding table and
  // insert the data to it. If already exists, overwrite it.
  var self = this;
  var GTFSfiles = [
    'calendar',
    'calendar_dates',
    'fare_attributes',
    'fare_rules',
    'routes',
    'shapes',
    'stop_times',
    'stops',
    'trips'
  ];
  var fileName = null;
  var table = null;

  for(var c = 0; GTFSfiles.length > c; c++) {

    fileName = '../gtfs/' + GTFSfiles[c] + '.txt';
    table = self.db.getSchema().table(GTFSfiles[c]);

    fetch(fileName)
      .then(function(res) {
        return res.text();
      })
      .then(function(data) {
        self.importFromTxtToDB(table, data)
        .then(function() {
          console.log(fileName+' has been imported!')
        })
        .catch(function(err) {
          console.log(fileName+' is not imported. '+err);
        });
      })
      .catch(function(error) {
        console.log('Error(insertData):\n', error);
      });
  }
};

CaltrainData.prototype.importFromTxtToDB = function(table, data) {
  // Split the text file data by each line
  var lines = data.split(/\r\n/);
  // The first line is the column name of a table
  var tableColumnNames = lines[0].split(",");
  // Loop through each line (except the column name line)
  var rows = [];
  for(var i = 1; i < lines.length; i++){
    // If the line is empty, skip it
    if (lines[i].length === 0) continue;
    var obj = {};
    var currentline = lines[i].split(",");

    for(var j = 0; j < tableColumnNames.length; j++){
      // Trim and remove extra quotations of a string before
      // storing it to corresponding table row
      var currentString = currentline[j].trim();
      obj[ tableColumnNames[j] ] = removeQuotations(currentString);
    }
    
    rows.push(table.createRow(obj));
  }
  return this.db
             .insertOrReplace()
             .into(table)
             .values(rows)
             .exec();
};

CaltrainData.prototype.displayStationList = function() {
  // Retrieve the stops data and append each as <option> inside <select>
  return this.db.select().from(this.stops).exec();
};

CaltrainData.prototype.searchSchedule = function() {

};

// Remove starting & ending quotation marks of a string if exists
function removeQuotations(text) {
  if ( text.startsWith('"') ) {
    return text.slice(1, text.length - 1);
  } 
  return text;
}
