var CT = new CaltrainData();
CT.getDBConnection()
  .then(function(db){
    console.log('Database connected & Schema creation done successfully');
    // CT.insertData();
    
    // Load stops for users to select for departure and arrival stops
    // Use setTimeout() to delay make sure insertDate is done beforehand 
    setTimeout(function() {
      CT.retrieveStops()
      .then(function(stops) {
        console.log('stops retrieved');
        displayStopsSelection(stops); 
      })
      .catch(function(error) {
        console.log('stops retrieving errors: ', error);
      });
    }, 200);

    // Search the trip
    $('#find-btn').click(function(e) {
      var departure_stop = $('#departure-stop').val();
      var arrival_stop = $('#arrival-stop').val();
      // console.log('Clicked: ', departure_stop, arrival_stop);
      // TODO: 
      // Check if user selects same stations
      // should show error
      if (departure_stop === arrival_stop) {
        console.log('SAME');
        return;
      } else {
        // Filter and Calculate duration of trips
        CT.searchSchedule(departure_stop, arrival_stop)
          .then(function(results) {
            console.log(results.length);

            displayResultList(results, departure_stop, arrival_stop);
          });
      }

    });

  });

function displayStopsSelection(stops) {
  return stops.forEach(function(d) {
      $('#departure-stop').append('<option value="' + d.stop_name + '">' + d.stop_name +'</option>');
      $('#arrival-stop').append('<option value="' + d.stop_name + '">' + d.stop_name +'</option>');
    }); 
}

function displayResultList(data, departure_stop, arrival_stop) {
  console.log('displayResultList\n', data);
  // Organize Departure to Arrival station
  var schedules = [];
  var departureData = null;
  var arrivalData = null;
  // A set of departure, arrival, and duration of trip
  var scheduleObject = {};

  for (var i = 0; data.length > i; i++) {
    // Sort to get the data of departure or arrival
    if (data[i].stops.stop_name === departure_stop) {
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
          'duration': getDuration(departureData.departure_time, arrivalData.arrival_time)
        };

        schedules.push(scheduleObject);
        departureData = null;
        scheduleObject = null;
    }

  }

  // Calculate duration of trips between departure and arrival
  if (schedules.length > 0) {

    $('#result').addClass('show');

    schedules.sort(sortSchedules).forEach(function(info) {
      console.log("SORTED", info);
      $('#search-result').append(
        '<tr>' +
          '<td>' + info.departure +'</td>' +
          '<td>' + info.arrival +'</td>' +
          '<td>' + info.duration +'</td>' +
        '</tr>');
    });
  } else {
    if ($('#result').hasClass('show')) {
      $('#result').removeClass('show');
      $('#noresult').addClass('show');
    }
  }

}

function getDuration(departure_time, arrival_time) {
  // var departure = departure_time.split(':');
  // var arrival = arrival_time.split(':');

  // var dHour = null;
  // var dMinute = null;
  // var dSecond = null;

  // dHour = parseInt(departure[0]);
  // dMinute = parseInt(departure[1]);
  // dSecond = parseInt(departure[2]);
  // aHour = parseInt(arrival[0]);
  // aMinute = parseInt(arrival[1]);
  // aSecond = parseInt(arrival[2]);

  // var dSec = dHour*60*60 + dMinute*60 + dSecond;
  // var aSec = aHour*60*60 + aMinute*60 + aSecond;
  var dSec = hhmmssToSeconds(departure_time);
  var aSec = hhmmssToSeconds(arrival_time);
  var duration = (aSec - dSec) / 60 ;
  
  return duration.toString() + ' min';
}

function sortSchedules(a, b) { 
  if (hhmmssToSeconds(a.departure) > hhmmssToSeconds(b.departure)) {
    return 1;
  } else if(hhmmssToSeconds(a.departure) < hhmmssToSeconds(b.departure)) {
    return -1;
  } else {
    return 0;
  }
}

function hhmmssToSeconds(time) {
  var t = time.split(':');
  var hour = parseInt(t[0]);
  var minute = parseInt(t[1]);
  var second = parseInt(t[2]);

  return hour*60*60 + minute*60 + second;
}