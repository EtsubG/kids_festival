import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the correct path
dotenv.config({ path: resolve(__dirname, '.env') });

const testConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('❌ MONGODB_URI is not defined in .env file!');
      console.log('📝 Please check that your .env file exists and contains MONGODB_URI');
      return;
    }
    
    // Hide password in logs for security
    const maskedUri = uri.replace(/:[^:]*@/, ':****@');
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Using URI:', maskedUri);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('bad auth')) {
      console.error('💡 Authentication failed. Check your username and password.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Network error. Check your internet connection and cluster name.');
    } else if (error.message.includes('whitelist')) {
      console.error('💡 IP not whitelisted. Go to Atlas > Network Access and add your IP.');
    } else if (error.message.includes('MongoServerError')) {
      console.error('💡 MongoDB server error. Check your connection string.');
    }
  }
};

testConnection();