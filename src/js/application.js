/* global lf:true */
/* eslint no-undef: "error" */

(function () {
  'use strict';

  // Turn on/off for 'console.log'
  var DEVELOPMENT = true;

  if (DEVELOPMENT) {
    console.log = function () {};
  }

  // 1. Build schema (getDBConnection)
  // 2. Establish database connection (buildSchema)
  // 3. Retrieve all the tables (onConnected)
  // 4. Import the GTFS data to IndexedDB (insertData)
  // 5. Retrieve stops for users to select (retrieveStops)

  var CaltrainData = function () {
    this.db = null;
    window.CT = this;
  };

  CaltrainData.prototype.getDBConnection = function () {
    var self = this;
    if (this.db != null) {
      return this.db;
    }

    var connectOptions = {storeType: lf.schema.DataStoreType.INDEXED_DB};
    return self.buildSchema().connect(connectOptions).then(function (db) {
      self.db = db;
      self.onConnected();
      self.insertData();

      return db;
    });
  };

  CaltrainData.prototype.onConnected = function () {
    this.calendar = this.db.getSchema().table('calendar');
    this.calendar_dates = this.db.getSchema().table('calendar_dates');
    // this.fare_attributes = this.db.getSchema().table('fare_attributes');
    // this.fare_rules = this.db.getSchema().table('fare_rules');
    this.routes = this.db.getSchema().table('routes');
    // this.shapes = this.db.getSchema().table('shapes');
    this.stop_times = this.db.getSchema().table('stop_times');
    this.stops = this.db.getSchema().table('stops');
    this.trips = this.db.getSchema().table('trips');

    console.log('DB connection established!');
  };

  CaltrainData.prototype.buildSchema = function () {
    var schemaBuilder = lf.schema.create('caltrain', 1);

    schemaBuilder.createTable('calendar')
                 .addColumn('service_id', lf.Type.STRING)
                 .addColumn('monday', lf.Type.INTEGER)
                 .addColumn('tuesday', lf.Type.INTEGER)
                 .addColumn('wednesday', lf.Type.INTEGER)
                 .addColumn('thursday', lf.Type.INTEGER)
                 .addColumn('friday', lf.Type.INTEGER)
                 .addColumn('saturday', lf.Type.INTEGER)
                 .addColumn('sunday', lf.Type.INTEGER)
                 .addColumn('start_date', lf.Type.STRING)
                 .addColumn('end_date', lf.Type.STRING)
                 .addPrimaryKey(['service_id']);

    schemaBuilder.createTable('calendar_dates')
                 .addColumn('service_id', lf.Type.STRING)
                 .addColumn('date', lf.Type.STRING)
                 .addColumn('exception_type', lf.Type.INTEGER)
                 .addPrimaryKey(['service_id']);

    schemaBuilder.createTable('routes')
                 .addColumn('route_id', lf.Type.STRING)
                 .addColumn('route_short_name', lf.Type.STRING)
                 .addColumn('route_long_name', lf.Type.STRING)
                 .addColumn('route_type', lf.Type.INTEGER)
                 .addColumn('route_color', lf.Type.STRING)
                 .addPrimaryKey(['route_id']);

    schemaBuilder.createTable('stop_times')
                 .addColumn('trip_id', lf.Type.STRING)
                 .addColumn('arrival_time', lf.Type.STRING)
                 .addColumn('departure_time', lf.Type.STRING)
                 .addColumn('stop_id', lf.Type.STRING)
                 .addColumn('stop_sequence', lf.Type.INTEGER)
                 .addColumn('pickup_type', lf.Type.INTEGER)
                 .addColumn('drop_off_type', lf.Type.INTEGER)
                 .addPrimaryKey(['stop_id', 'trip_id']);

    schemaBuilder.createTable('stops')
                 .addColumn('stop_id', lf.Type.STRING)
                 .addColumn('stop_code', lf.Type.STRING)
                 .addColumn('stop_name', lf.Type.STRING)
                 .addColumn('stop_lat', lf.Type.STRING)
                 .addColumn('stop_lon', lf.Type.STRING)
                 .addColumn('zone_id', lf.Type.STRING)
                 .addColumn('stop_url', lf.Type.STRING)
                 .addColumn('location_type', lf.Type.INTEGER)
                 .addColumn('parent_station', lf.Type.STRING)
                 .addColumn('platform_code', lf.Type.STRING)
                 .addColumn('wheelchair_boarding', lf.Type.INTEGER)
                 .addPrimaryKey(['stop_id']);

    schemaBuilder.createTable('trips')
                 .addColumn('route_id', lf.Type.STRING)
                 .addColumn('service_id', lf.Type.STRING)
                 .addColumn('trip_id', lf.Type.STRING)
                 .addColumn('trip_headsign', lf.Type.STRING)
                 .addColumn('trip_short_name', lf.Type.INTEGER)
                 .addColumn('direction_id', lf.Type.INTEGER)
                 .addColumn('shape_id', lf.Type.STRING)
                 .addColumn('wheelchair_accessible', lf.Type.INTEGER)
                 .addColumn('bikes_allowed', lf.Type.INTEGER)
                 .addPrimaryKey(['route_id', 'service_id', 'trip_id']);

    console.log('Schema created!!');
    return schemaBuilder;
  };

  CaltrainData.prototype.insertData = function () {
    // Fetch all the GTFS files and loop through them.
    // On reading each file, get the corresponding table and
    // insert the data to it. If already exists, overwrite it.
    var self = this;
    var GTFSfiles = [
      'calendar',
      'calendar_dates',
      'stop_times',
      'stops',
      'trips'
    ];

    var filePathName = null;

    GTFSfiles.forEach(function (name, index) {
      filePathName = '../gtfs/' + name + '.txt';
      var table = self.db.getSchema().table(name);

      fetch(filePathName)
        .then(function (res) {
          return res.text();
        })
        .then(function (data) {
          // Convert text files to SQL table format to be inserted to db
          self.importFromTxtToDB(table, data)
          .then(function () {
            console.log(name + ' has been imported!');
          })
          .catch(function (err) {
            console.log(name + ' is not imported. ' + err);
          });
        })
        .catch(function (error) {
          console.log('Error(insertData):\n', error);
        });
    });
  };

  CaltrainData.prototype.importFromTxtToDB = function (table, data) {
    // Split the text file data by each line
    var lines = data.split(/\r\n/);
    // The first line is the column name of a table
    var tableColumnNames = lines[0].split(',');
    // Loop through each line (except the column name line)
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      // If the line is empty, skip it
      if (lines[i].length === 0) {
        continue;
      }
      var obj = {};
      var currentline = lines[i].split(',');

      for (var j = 0; j < tableColumnNames.length; j++) {
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

  CaltrainData.prototype.retrieveStops = function () {
    // Retrieve the stops data and append each as <option> inside <select>
    // Remove the duplicated station names by using 'lf.fn.distinct()'
    return this.db.select(lf.fn.distinct(this.stops.stop_name).as('stop_name'))
                  .from(this.stops)
                  .orderBy(this.stops.stop_name)
                  .exec();
  };

  CaltrainData.prototype.searchSchedule = function (departure, arrival) {
    // GTFS Diagram
    // https://upload.wikimedia.org/wikipedia/commons/2/28/GTFS_class_diagram.svg

    // Stops     <== (stop_id)    ==>   StopTimes
    // StopTimes <== (trip_id)    ==>   Trips
    // Trips     <== (route_id)   ==>   Routes
    // Trips     <== (service_id) ==>   CalendarDates
    // Trips     <== (service_id) ==>   Calendar

    var Stops = this.stops;
    var StopTimes = this.stop_times;
    var Trips = this.trips;
    // var Routes = this.routes;
    var CalendarDates = this.calendar_dates;
    var Calendar = this.calendar;

    var today = new Date();
    var formattedDate = formatDate(today);
    var todayDay = whatDayIsToday(today);

    return this
            .db
            .select(
              // get the data set we need to display
              StopTimes.trip_id,
              StopTimes.stop_id,
              StopTimes.departure_time,
              StopTimes.arrival_time,
              Stops.stop_name)
            .from(Stops, StopTimes, Trips, Calendar, CalendarDates)
            .where(
              lf.op.and(
                // Find the shared ids
                Stops.stop_id.eq(StopTimes.stop_id),
                StopTimes.trip_id.eq(Trips.trip_id),
                // Array of departure and arrival stations
                Stops.stop_name.in([departure, arrival]),
                // Make sure which service is available today.
                // Check if today is between start & end date from Calendar
                Calendar.start_date.lte(formattedDate),
                Calendar.end_date.gte(formattedDate),
                // Check if today is weekday or saturday or sunday
                Calendar[todayDay].eq(1),
                // Check if today is not exception day from CalendarDates
                CalendarDates.exception_type.neq(2),
                // Get the service id to return the one that is shared in Trips
                Trips.service_id.eq(CalendarDates.service_id)
              )
            )
            // Order by departure time
            .orderBy(StopTimes.departure_time)
            .exec();
  };

  // Remove starting & ending quotation marks of a string if exists
  function removeQuotations (text) {
    if (text.startsWith('"')) {
      return text.slice(1, text.length - 1);
    }
    return text;
  }
  // Determine today is weekday, saturday, or sunday
  function whatDayIsToday (date) {
    switch (date.getDay()) {
      case 0:
        return 'sunday';
      case 1:
        return 'monday';
      case 2:
        return 'tuesday';
      case 3:
        return 'wednesday';
      case 4:
        return 'thursday';
      case 5:
        return 'friday';
      case 6:
        return 'saturday';
    }
  }
  // Format date to yyyymmdd
  function formatDate (date) {
    var month = '';
    var day = '';

    var year = date.getFullYear().toString();

    if (date.getMonth() < 9) {
      month = '0' + parseInt(date.getMonth() + 1).toString();
    } else {
      month = parseInt(date.getMonth() + 1).toString();
    }

    if (date.getDate() < 10) {
      day = '0' + date.getDate();
    } else {
      day = date.getDate().toString();
    }

    return year + month + day;
  }

  /**
   * Application Controller Logics
   */

  var CT = new CaltrainData();

  CT.getDBConnection()
    .then(function (db) {
      console.log('Database connected & Schema creation done successfully');

      // Load stops for users to select for departure and arrival stops
      // Use setTimeout() to delay make sure insertDate is done beforehand

      removeTopMessage();
      displayTopMessage('Loading info...', 'blue');

      setTimeout(function () {
        CT.retrieveStops()
        .then(function (stops) {
          removeTopMessage();
          displayStopsSelection(stops);
        })
        .catch(function (error) {
          displayTopMessage(error, 'red');
          // console.log('Stops retrieving errors: ', error);
        });
      }, 200);

      // Search the trip
      $('#find-btn').click(function (e) {
        resetSearchResults();
        var departureStop = $('#departure-stop').val();
        var arrivalStop = $('#arrival-stop').val();
        // Check if user selects same stations
        // should show error
        if (departureStop === arrivalStop) {
          displayResultError();
          return;
        } else {
          // Filter and Calculate duration of trips,
          // then display the matched schedule
          CT.searchSchedule(departureStop, arrivalStop)
            .then(function (results) {
              displayResultList(results, departureStop);
            });
        }
      });
    });

  function displayStopsSelection (stops) {
    return stops.forEach(function (d) {
      $('#departure-stop').append('<option value="' + d.stop_name + '">' + d.stop_name + '</option>');
      $('#arrival-stop').append('<option value="' + d.stop_name + '">' + d.stop_name + '</option>');
    });
  }

  function displayResultList (data, departureStop) {
    // Organize Departure to Arrival station
    var schedules = [];
    var departureData = null;
    var arrivalData = null;
    // A set of departure, arrival, and duration of trip
    var scheduleObject = {};

    for (var i = 0; data.length > i; i++) {
      // Sort to get the data of departure or arrival
      if (data[i].stops.stop_name === departureStop) {
        departureData = data[i].stop_times;
        continue;
      } else {
        arrivalData = data[i].stop_times;
      }

      if (departureData &&
          arrivalData &&
          departureData.trip_id === arrivalData.trip_id &&
          departureData.departure_time < arrivalData.arrival_time) {
        scheduleObject = {
          'departure': departureData.departure_time,
          'arrival': arrivalData.arrival_time,
          // Calculate duration of trips between departure and arrival
          'duration': getDuration(departureData.departure_time, arrivalData.arrival_time)
        };
        schedules.push(scheduleObject);
        departureData = null;
        scheduleObject = null;
      }
    }

    if (schedules.length > 0) {
      // Display the matched schedule

      // Show the search result table
      $('#result').addClass('show');

      // Sort the schedule order by departure time and display them
      schedules.sort(sortSchedules).forEach(function (info) {
        $('#search-result').append(
          '<tr>' +
            '<td>' + info.departure + '</td>' +
            '<td>' + info.arrival + '</td>' +
            '<td>' + info.duration + '</td>' +
          '</tr>');
      });
    } else {
      // No schedule matched

      // Hide Search result table
      if ($('#result').hasClass('show')) {
        $('#result').removeClass('show');
      }
      // Show no-result
      $('#noresult').addClass('show');
    }
  }

  /**
   * Helper functions
   */

  function getDuration (departureTime, arrivalTime) {
    var dSec = hhmmssToSeconds(departureTime);
    var aSec = hhmmssToSeconds(arrivalTime);
    var duration = (aSec - dSec) / 60;

    return duration.toString() + ' min';
  }

  function sortSchedules (a, b) {
    if (hhmmssToSeconds(a.departure) > hhmmssToSeconds(b.departure)) {
      return 1;
    } else if (hhmmssToSeconds(a.departure) < hhmmssToSeconds(b.departure)) {
      return -1;
    } else {
      return 0;
    }
  }

  function hhmmssToSeconds (time) {
    var t = time.split(':');
    var hour = parseInt(t[0]);
    var minute = parseInt(t[1]);
    var second = parseInt(t[2]);

    return (hour * 60 * 60) + (minute * 60) + second;
  }

  function resetSearchResults () {
    // Reset Search Result
    $('#search-result').empty();
    // Reset Error
    $('#error').empty();
    // Hide no-result
    if ($('#noresult').hasClass('show')) {
      $('#noresult').removeClass('show');
    }
  }

  function displayResultError () {
    // Diplay the error
    $('#error').append('<p class="error-msg">Arrival station must be different</p>');
    // Erase search result
    $('#search-result').empty();
    // Hide Search result table
    if ($('#noresult').hasClass('show')) {
      $('#noresult').removeClass('show');
    }
  }

  function displayTopMessage (message, color) {
    $('#loading-status').append('<p class="loading-status-' + color + '">' + message + '</p>');
  }

  function removeTopMessage () {
    $('#loading-status').empty();
  }
}());
