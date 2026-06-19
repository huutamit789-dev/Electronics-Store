require('dotenv').config();

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const productCategoryByName = {
  'Gaming Laptop': 'Laptops',
  'Smart Watch': 'Smart Watches',
  'iPhone 15 Pro': 'Smartphones',
  'Samsung Galaxy S24': 'Smartphones',
  'MacBook Air M3': 'Laptops',
  'Dell XPS 15': 'Laptops',
  'PlayStation 5': 'Gaming',
  'Xbox Series X': 'Gaming',
  'Sony WH-1000XM5': 'Audio Devices',
  'Apple AirPods Pro 2': 'Audio Devices',
  'JBL Charge 5': 'Audio Devices',
  'Bose SoundLink Flex': 'Audio Devices',
  'Razer BlackShark V2': 'Audio Devices'
};

async function main() {
  await mongoose.connect(process.env.DB_STRING, {
    dbName: process.env.DB_NAME || 'ElectronicsDB'
  });

  const db = mongoose.connection.db;
  const categories = await db.collection('cates').find().toArray();
  const categoryIdByName = Object.fromEntries(
    categories.map(category => [category.name, String(category._id)])
  );

  let modifiedTotal = 0;

  for (const [productName, categoryName] of Object.entries(productCategoryByName)) {
    const categoryId = categoryIdByName[categoryName];

    if (!categoryId) {
      throw new Error(`Missing category: ${categoryName}`);
    }

    const result = await db.collection('products').updateOne(
      { name: productName },
      {
        $set: { cate_id: new ObjectId(categoryId) },
        $unset: { category_id: '' }
      }
    );

    modifiedTotal += result.modifiedCount;
    console.log(`${productName} => ${categoryName} (${categoryId}), matched=${result.matchedCount}, modified=${result.modifiedCount}`);
  }

  const duplicateCategoriesCount = await db.collection('categories').countDocuments();

  if (duplicateCategoriesCount === 0) {
    await db.collection('categories').drop().catch(error => {
      if (error.codeName !== 'NamespaceNotFound') {
        throw error;
      }
    });
    console.log('Dropped empty duplicate collection: categories');
  } else {
    console.log(`Kept collection categories because it contains ${duplicateCategoriesCount} documents`);
  }

  const productCategoryIds = await db.collection('products').distinct('cate_id');
  console.log('Product cate_id values after migration:', productCategoryIds.map(String));
  console.log('Modified products:', modifiedTotal);

  await mongoose.disconnect();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
