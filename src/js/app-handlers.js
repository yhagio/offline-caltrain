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
      debugger;
      var departure_stop = $('#departure-stop').val();
      var arrival_stop = $('#arrival-stop').val();
      // Filter and Calculate duration of trips
      CT.searchSchedule(departure_stop, arrival_stop)
        .then(function(results) {
          console.log(results.length);
        });
    });

  });

function displayStopsSelection(stops) {
  return stops.forEach(function(d) {
      $('#departure-stop').append('<option value="' + d.stop_name + '">' + d.stop_name +'</option>');
      $('#arrival-stop').append('<option value="' + d.stop_name + '">' + d.stop_name +'</option>');
    }); 
}

function displayResultList(data) {
  console.log('displayResultList\n', data);
  data.forEach(function(d) {
    $('#departure-stop')
      .append(
        '<tr>' +
          '<td>' + /* Departure Time */ +'</td>' +
          '<td>' + /* Arrival Time   */ +'</td>' +
          '<td>' + /* Duration       */ +'</td>' +
        '</tr>'
      );
  });
}
