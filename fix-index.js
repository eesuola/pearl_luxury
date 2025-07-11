// fix-index.js - Run this script once to fix the database index issue
import mongoose from 'mongoose';

const fixDatabaseIndexes = async () => {
  try {
    // Connect to your database (replace with your actual connection string)
    await mongoose.connect(process.env.MONGODB_URI || mongodb+srv://eesuolapo:PM1roCEZNd8nXH1p@pearl-luxury.pdw2huf.mongodb.net/?retryWrites=true&w=majority&appName=pearl-luxury
);
    console.log('Connected to MongoDB');
    
    // Get the salesbooks collection
    const collection = mongoose.connection.db.collection('salesbooks');
    
    // Check current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop the problematic receiptId index if it exists
    try {
      await collection.dropIndex('receiptId_1');
      console.log('Successfully dropped receiptId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('receiptId_1 index does not exist, skipping...');
      } else {
        console.error('Error dropping receiptId index:', error);
      }
    }
    
    // Ensure orderId index exists and is unique
    try {
      await collection.createIndex({ orderId: 1 }, { unique: true });
      console.log('Created unique index on orderId');
    } catch (error) {
      if (error.code === 85) {
        console.log('orderId index already exists');
      } else {
        console.error('Error creating orderId index:', error);
      }
    }
    
    // Clean up any documents with null receiptId if they exist
    const result = await collection.deleteMany({ receiptId: null });
    console.log(`Cleaned up ${result.deletedCount} documents with null receiptId`);
    
    console.log('Database indexes fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing database indexes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
fixDatabaseIndexes().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});