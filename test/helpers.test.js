/* global describe it expect : true */

import {
  hhmmssToSeconds,
} from '../src/js/helpers';

describe('[Helpers]', () => {
  it('hhmmssToSeconds', () => {
    expect(hhmmssToSeconds('7:33:00')).to.be.a('number');
    expect(hhmmssToSeconds('7:33:00')).to.equal(27180);
  });
});
