const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Test database connection error:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database:', error);
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});