/* global describe it expect before it */

import {
  hhmmssToSeconds,
  getDuration,
  sortSchedules,
  removeQuotations,
  whatDayIsToday,
  formatDate,
} from '../src/js/helpers';

describe('[Helpers]', () => {
  it('hhmmssToSeconds() converts time string to number', () => {
    expect(hhmmssToSeconds('7:33:00')).to.be.a('number');
    expect(hhmmssToSeconds('7:33:00')).to.equal(27180);
  });

  it('getDuration() calculates travel time', () => {
    expect(getDuration('7:33:00', '7:43:00')).to.be.a('string');
    expect(getDuration('7:33:00', '7:43:00')).to.equal('10 min');
  });

  it('sortSchedules() sorts schedule a > b', () => {
    const a = { departure: '7:33:00' };
    const b = { departure: '7:43:00' };
    expect(sortSchedules(a, b)).to.equal(-1);
  });

  it('sortSchedules() sorts schedule a < b', () => {
    const a = { departure: '7:33:00' };
    const b = { departure: '7:43:00' };
    expect(sortSchedules(b, a)).to.equal(1);
  });

  it('sortSchedules() sorts schedule a === b', () => {
    const a = { departure: '7:33:00' };
    const b = { departure: '7:33:00' };
    expect(sortSchedules(a, b)).to.equal(0);
  });

  it('removeQuotations() ', () => {
    const text1 = 'hello';
    const text2 = '"abc"';
    expect(removeQuotations(text1)).to.equal('hello');
    expect(removeQuotations(text2)).to.equal('abc');
  });

  it('whatDayIsToday() returns correct day', () => {
    const sunday = { getDay: function() { return 0 } };
    const monday = { getDay: function() { return 1 } };
    const tuesday = { getDay: function() { return 2 } };
    const wednesday = { getDay: function() { return 3 } };
    const thursday = { getDay: function() { return 4 } };
    const friday = { getDay: function() { return 5 } };
    const saturday = { getDay: function() { return 6 } };
    const def = { getDay: function() { return '' } };

    expect(whatDayIsToday(sunday)).to.equal('sunday');
    expect(whatDayIsToday(monday)).to.equal('monday');
    expect(whatDayIsToday(tuesday)).to.equal('tuesday');
    expect(whatDayIsToday(wednesday)).to.equal('wednesday');
    expect(whatDayIsToday(thursday)).to.equal('thursday');
    expect(whatDayIsToday(friday)).to.equal('friday');
    expect(whatDayIsToday(saturday)).to.equal('saturday');
    expect(whatDayIsToday(def)).to.equal('');
  });

  it('formatDate() formats a date to yyyymmdd', () => {
    const newDate = new Date(908500000);
    expect(formatDate(newDate)).to.equal('19700111');
  });

  it('formatDate() formats another date to yyyymmdd', () => {
    const anotherDate = new Date(1005019995343);
    expect(formatDate(anotherDate)).to.equal('20011105');
  });
});
