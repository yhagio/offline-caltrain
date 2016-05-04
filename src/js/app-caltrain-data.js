// 1. Build schema (getDBConnection)
// 2. Establish database connection (buildSchema)
// 3. Retrieve all the tables (onConnected)

var CaltrainData = function() {
  this.db = null;
  window.CT = this;
} 

CaltrainData.prototype.getDBConnection = function() {
  if (this.db != null) {
    return this.db;
  }

  // This is necessary for the app to run with 
  // no errors while
  var schemaBuilder = this.buildSchema();
  if (schemaBuilder == null) {
    return Promise.resolve(null);
  }

  var connectOptions = {storeType: lf.schema.DataStoreType.INDEXED_DB};
  return this.buildSchema().connect(connectOptions).then(function(db) {
    this.db = db;
    this.onConnected();
    return db;
  }.bind(this));
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

  console.log('DB connection established.');
  // TODO: Import and Sync the GTFS files
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
    addColumn('date', lf.Type.INTEGER).
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

  console.log('Schema created!');
  return schemaBuilder;
};

CaltrainData.prototype.insertData = function(){

};
