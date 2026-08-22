import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const checkUsers = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('❌ MONGODB_URI not found in .env');
      return;
    }
    
    console.log('Attempting to connect...');
    
    // Try to connect
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connected successfully!');
    
    // Get connection info
    const adminDb = mongoose.connection.db.admin();
    const userInfo = await adminDb.command({ usersInfo: 1 });
    
    console.log('📊 Database users:');
    userInfo.users.forEach(user => {
      console.log(`   - ${user.user} (${user.db})`);
    });
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Common issues:');
    console.log('   1. Wrong username or password');
    console.log('   2. IP not whitelisted');
    console.log('   3. Database user lacks permissions');
  }
};

checkUsers();