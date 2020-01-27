import { makeId } from './id';

describe('makeId', () => {
  const idRegex = /^[a-z1-9-]+$/;

  it('should convert inputs to lower case', () => {
    expect(makeId('ABC-def123')).toMatch(idRegex);
  });

  it('should convert colons to dashes', () => {
    expect(makeId('ble-84:87:ad:ef')).toMatch(idRegex);
  });

  it('should convert underscores to dashes', () => {
    expect(makeId('bluetooth-classic_129-1-1')).toMatch(idRegex);
  });
});
