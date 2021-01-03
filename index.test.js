const wait = require('./wait');

test('throws invalid number', async () => {
  await expect(wait('foo')).rejects.toThrow('milliseconds not a number');
});