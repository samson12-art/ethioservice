console.log('Testing...');
try {
  require('express');
  console.log('✅ Express loaded');
  require('mongoose');
  console.log('✅ Mongoose loaded');
  require('dotenv').config();
  console.log('✅ Dotenv loaded');
  console.log('MONGO_URI:', process.env.MONGO_URI);
} catch (error) {
  console.error('❌ Error:', error.message);
}