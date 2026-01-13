/**
 * Script to create Stripe Products and Prices
 * Run with: npx tsx scripts/create-stripe-products.ts
 */

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true,
});

interface ProductConfig {
  name: string;
  nameTh: string;
  description: string;
  priceThb: number;
  tierId: string;
  features: string[];
}

const PRODUCTS: ProductConfig[] = [
  {
    name: 'Basic',
    nameTh: 'เบสิค',
    description: 'การ์ดทั้งหมด 5 แบบ ประวัติไม่จำกัด ไม่มีโฆษณา',
    priceThb: 99,
    tierId: 'basic',
    features: [
      'การ์ดความรัก การงาน ใช่/ไม่ใช่',
      'ประวัติไม่จำกัด',
      'ไม่มีโฆษณา',
      'บันทึกคำถามและคำทำนาย',
    ],
  },
  {
    name: 'Pro',
    nameTh: 'โปร',
    description: 'การ์ดพรีเมียม 10 แบบ คำทำนายเจาะลึก ส่งออก PDF',
    priceThb: 199,
    tierId: 'pro',
    features: [
      'ทุกอย่างใน Basic',
      'การ์ดพรีเมียม 5 แบบเพิ่มเติม',
      'คำทำนายเจาะลึกพิเศษ',
      'ระบบแนะนำการ์ดที่เหมาะสม',
      'ส่งออก PDF',
    ],
  },
  {
    name: 'VIP',
    nameTh: 'วีไอพี',
    description: 'การ์ดทั้งหมด 18 แบบ AI คำทำนาย แดชบอร์ดพิเศษ',
    priceThb: 399,
    tierId: 'vip',
    features: [
      'ทุกอย่างใน Pro',
      'การ์ดทั้งหมด 18 แบบ',
      'AI คำทำนายส่วนตัว',
      'วิเคราะห์รูปแบบการดูดวง',
      'แดชบอร์ดพิเศษ',
      'ซัพพอร์ตสำคัญ',
    ],
  },
];

async function createProducts() {
  console.log('🚀 Creating Stripe Products and Prices...\n');

  const results: { tierId: string; productId: string; priceId: string }[] = [];

  for (const productConfig of PRODUCTS) {
    try {
      // Check if product already exists
      const existingProducts = await stripe.products.search({
        query: `metadata['tierId']:'${productConfig.tierId}'`,
      });

      let product: Stripe.Product;

      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        console.log(`📦 Product "${productConfig.name}" already exists: ${product.id}`);
      } else {
        // Create product
        product = await stripe.products.create({
          name: `${productConfig.name} - ไพ่ยิปซีออนไลน์`,
          description: productConfig.description,
          metadata: {
            tierId: productConfig.tierId,
            nameTh: productConfig.nameTh,
          },
          // Add default_price later after creating price
        });
        console.log(`✅ Created product "${productConfig.name}": ${product.id}`);
      }

      // Check if price already exists
      const existingPrices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      const matchingPrice = existingPrices.data.find(
        p => p.unit_amount === productConfig.priceThb * 100 && 
             p.currency === 'thb' &&
             p.recurring?.interval === 'month'
      );

      let price: Stripe.Price;

      if (matchingPrice) {
        price = matchingPrice;
        console.log(`💰 Price for "${productConfig.name}" already exists: ${price.id}`);
      } else {
        // Create price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: productConfig.priceThb * 100, // Convert to satang
          currency: 'thb',
          recurring: {
            interval: 'month',
          },
          metadata: {
            tierId: productConfig.tierId,
          },
        });
        console.log(`✅ Created price for "${productConfig.name}": ${price.id} (฿${productConfig.priceThb}/month)`);

        // Set as default price
        await stripe.products.update(product.id, {
          default_price: price.id,
        });
      }

      results.push({
        tierId: productConfig.tierId,
        productId: product.id,
        priceId: price.id,
      });

      console.log('');
    } catch (error) {
      console.error(`❌ Error creating ${productConfig.name}:`, error);
      throw error;
    }
  }

  console.log('\n========================================');
  console.log('🎉 All products created successfully!\n');
  console.log('Add these to your .env.local:\n');
  console.log('```');
  for (const result of results) {
    console.log(`STRIPE_PRICE_ID_${result.tierId.toUpperCase()}=${result.priceId}`);
  }
  console.log('```');
  console.log('\n========================================');

  return results;
}

// Run the script
createProducts()
  .then((results) => {
    console.log('\n📋 Summary:');
    console.table(results);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to create products:', error);
    process.exit(1);
  });
