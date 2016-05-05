// (function(document) {
  var CT = new CaltrainData();
  CT.getDBConnection()
    .then(function(){
      console.log('Database connected & Schema creation done successfully');
      // CT.insertData();
    });
// })(document);

/*
fetch(STOPS)
  .then(function(res) {
    return res.text();
  })
  .then(function(data) {
    var dataJSON = textFileToJSON(data);

    // dataJSON.forEach(function(d) {
    //   $('#departure-stop').append('<option value="' + d.stop_id + '">' + d.stop_name +'</option>');
    //   $('#arrival-stop').append('<option value="' + d.stop_id + '">' + d.stop_name +'</option>');
    // });
  })
  .catch(function(error) {
    console.log('ERROR: ', error);
  });

var jsonStopTimes;
fetch(STOP_TIMES)
  .then(function(res) {
    console.log('RES!');
    return res.text();
  })
  // .then(function(data) {
  //   console.log('DATA ...', data);
  
    // var dataJSON = textFileToJSON(data);
    // console.log('dataJSON', dataJSON);
    // jsonStopTimes = dataJSON;
  // })
  .catch(function(error) {
    console.log('ERROR: ', error);
  });


// Search the trip
$('#find-btn').click(function(e) {
  debugger;
  var departure_stop = $('#departure-stop').val();
  var arrival_stop = $('#arrival-stop').val();

  fetch(STOP_TIMES)
    .then(status)  
    .then(text) 
    .then(function(data) {
      var dataJSON = textFileToJSON(data);
      var filtered = dataJSON.filter(function(d) {
        return d.stop_id === departure_stop
      });
      return filtered;
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
    });

  // fetchTextFiles(STOP_TIMES, departure_stop, arrival_stop);
});
*/

function status(response) {  
  if (response.status >= 200 && response.status < 300) {  
    return Promise.resolve(response)  
  } else {  
    return Promise.reject(new Error(response.statusText))  
  }  
}

function text(response) {  
  return response.text()  
}

function fetchTextFiles(file, departure, arrival) {
  fetch(file)
    .then(function(res) {
      return res.text();
    })
    .then(function(data) {
      // console.log('data: ', data);
      var dataJSON = textFileToJSON(res);
      var filtered = dataJSON.filter(function(d) {
        return d.stop_id === departure
      });
      // console.log('filtered: ', filtered);
      return filtered;
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
    });
}

function displayResultList(data) {
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
