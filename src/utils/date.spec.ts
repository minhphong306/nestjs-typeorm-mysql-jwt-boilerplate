import { getDateFromDMYString } from './date';

describe('test date', function () {
  it('should return the date', function () {
    const res = getDateFromDMYString('10/02/2022');
    console.log(res);
  });
});
