const User = require('../../../models/user');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  it('should hash password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await bcrypt.compare('password123', user.password);
    expect(isMatch).toBeTruthy();
  });
});