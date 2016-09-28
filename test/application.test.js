/* global describe it expect before it */

import {
  resetSearchResults,
  displayResultError,
  displayTopMessage,
  removeTopMessage,
  displayStopsSelection,
  displayResultList,
} from '../src/js/application';


describe('[Application]', () => {
  let $;
  before(() => {
    $ = require('jquery');
  });

  it('resetSearchResults()', () => {
    const searchResult = $('<tbody id="search-result"><tr><td>18:00</td><td>18:40</td><td>40 min</td></tr></tbody>');
    const error = $('<div id="error"><p>Some Error</p></div>');
    const noresult = $('<div id="noresult" class="no-result show"><h3>None ...</h3></div>');

    resetSearchResults(() => {
      expect(searchResult.html()).to.equal('');
      expect(error.html()).to.equal('');
      expect(noresult.hasClass('show')).to.be.false;
    });
  });

  it('displayResultError()', () => {
    const error = $('<div id="error"></div>');
    $('#error').append('<p class="error-msg">Arrival station must be different</p>');
    const searchResult = $('<tbody id="search-result"><tr><td>18:00</td><td>18:40</td><td>40 min</td></tr></tbody>');
    const noresult = $('<div id="noresult" class="no-result show"><h3>None ...</h3></div>');

    displayResultError(() => {
      expect(searchResult.html()).to.equal('');
      expect(error.html()).to.equal('<p class="error-msg">Arrival station must be different</p>');
      expect(noresult.hasClass('show')).to.be.false;
    });
  });

  it('displayTopMessage() has correct message', () => {
    const dom = $('<div id="loading-status"></div>');
    const message = 'Loading...';
    const color = 'blue';

    displayTopMessage(message, color, () => {
      expect(dom.html()).to.equal('Loading...');
    });
  });

  it('displayTopMessage() has correct class', () => {
    const dom = $('<div id="loading-status"></div>');
    const message = 'Loading...';
    const color = 'blue';

    displayTopMessage(message, color, () => {
      expect($(`.loading-status-${color}`)).to.exist;
    });
  });

  it('removeTopMessage()', () => {
    const dom = $('<div id="loading-status"><p>Loading info...</p></div>');
    removeTopMessage(() => {
      expect(dom.html()).to.equal('');
    });
  });

  it('displayStopsSelection() append correct childs', () => {
    const stops = [
      { stop_name: 'San Francisco' },
      { stop_name: 'Palo Alto' },
    ];
    const departureStop = $('<select id="departure-stop" class="full-width" name="departure-stop"></select>');
    const arrivalStop = $('<select id="arrival-stop" class="full-width" name="departure-stop"></select>');

    displayStopsSelection(stops, () => {
      expect(departureStop.length).to.equal(2);
      expect(arrivalStop.length).to.equal(2);
    });
  });


  it('displayResultList() displays the search result if found', () => {
    const data = [
      {
        stop_times: {
          arrival_time: '08:20:00',
          departure_time: '08:20:00',
          stop_id: '70022',
          trip_id: '422u',
        },
        stops: {
          stop_name: '22nd St Caltrain',
        },
      },
      {
        stop_times: {
          arrival_time: '09:00:00',
          departure_time: '09:00:00',
          stop_id: '70122',
          trip_id: '422u',
        },
        stops: {
          stop_name: 'Belmont Caltrain',
        },
      },
    ];
    const departureStop = '22nd St Caltrain';

    const result = $('<div id="result" class="result-box"><table class="table"><thead><tr><th>Departure Time</th><th>Arrival Time</th><th>Duration</th></tr></thead><tbody id="search-result"></tbody></table></div>');
    const noresult = $('<div id="noresult" class="no-result"><h3>None ...</h3></div>');

    displayResultList(data, departureStop, () => {
      expect($('#search-result').length).to.equal(1);
    });
  });

  it('displayResultList() displays the search result if found', () => {
    const data = [
      {
        stop_times: {
          arrival_time: '08:20:00',
          departure_time: '08:20:00',
          stop_id: '70022',
          trip_id: '422u',
        },
        stops: {
          stop_name: '22nd St Caltrain',
        },
      },
      {
        stop_times: {
          arrival_time: '8:48:00',
          departure_time: '8:48:00',
          stop_id: '70121',
          trip_id: '423u',
        },
        stops: {
          stop_name: 'Belmont Caltrain',
        },
      },
    ];
    const departureStop = '22nd St Caltrain';

    const result = $('<div id="result" class="result-box"><table class="table"><thead><tr><th>Departure Time</th><th>Arrival Time</th><th>Duration</th></tr></thead><tbody id="search-result"></tbody></table></div>');
    const noresult = $('<div id="noresult" class="no-result"><h3>None ...</h3></div>');

    displayResultList(data, departureStop, () => {
      expect($('#search-result').length).to.equal(0);
      expect($('#noresult').hasClass('show')).to.be.true;
    });
  });
});

