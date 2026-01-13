/**
 * Seed script for creating test users with different subscription tiers
 * Run with: npx tsx prisma/seed-test-users.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('👤 Creating test users for development/testing...\n');

  const testUsers = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'test-free@tarot.test',
      name: 'Test User (Free)',
      email_verified: true,
      auth_provider: 'email' as const,
      tier: null, // No subscription = Free tier
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'test-basic@tarot.test',
      name: 'Test User (Basic)',
      email_verified: true,
      auth_provider: 'email' as const,
      tier: 'basic',
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'test-pro@tarot.test',
      name: 'Test User (Pro)',
      email_verified: true,
      auth_provider: 'email' as const,
      tier: 'pro',
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'test-vip@tarot.test',
      name: 'Test User (VIP)',
      email_verified: true,
      auth_provider: 'email' as const,
      tier: 'vip',
    },
  ];

  for (const userData of testUsers) {
    const { tier, ...userFields } = userData;
    
    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: userFields.email },
      update: {
        name: userFields.name,
        email_verified: userFields.email_verified,
      },
      create: userFields,
    });

    console.log(`  ✅ Created user: ${user.email}`);

    // Create mock subscription for paid tiers
    if (tier) {
      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      const priceIdMap: Record<string, string> = {
        basic: process.env.STRIPE_PRICE_ID_BASIC || 'price_test_basic',
        pro: process.env.STRIPE_PRICE_ID_PRO || 'price_test_pro',
        vip: process.env.STRIPE_PRICE_ID_VIP || 'price_test_vip',
      };

      await prisma.subscription.upsert({
        where: { stripe_subscription_id: `sub_test_${tier}_${user.id.slice(0, 8)}` },
        update: {
          status: 'active',
          current_period_start: now,
          current_period_end: periodEnd,
        },
        create: {
          user_id: user.id,
          stripe_subscription_id: `sub_test_${tier}_${user.id.slice(0, 8)}`,
          stripe_customer_id: `cus_test_${user.id.slice(0, 8)}`,
          stripe_price_id: priceIdMap[tier],
          status: 'active',
          current_period_start: now,
          current_period_end: periodEnd,
        },
      });

      console.log(`     📦 Subscription: ${tier} tier (active)`);
    } else {
      console.log(`     📦 Subscription: free tier (no subscription)`);
    }
  }

  const totalUsers = await prisma.user.count();
  const totalSubs = await prisma.subscription.count();
  
  console.log('\n📊 Summary:');
  console.log(`   Total users: ${totalUsers}`);
  console.log(`   Total subscriptions: ${totalSubs}`);
  console.log('\n🎉 Test users created successfully!');
  
  console.log('\n📝 Test Users:');
  console.log('┌─────────────────────────────────────────────────────────────────┐');
  console.log('│  Email                    │ Tier   │ ID (first 8 chars)        │');
  console.log('├─────────────────────────────────────────────────────────────────┤');
  console.log('│  test-free@tarot.test     │ FREE   │ 00000000                  │');
  console.log('│  test-basic@tarot.test    │ BASIC  │ 00000000                  │');
  console.log('│  test-pro@tarot.test      │ PRO    │ 00000000                  │');
  console.log('│  test-vip@tarot.test      │ VIP    │ 00000000                  │');
  console.log('└─────────────────────────────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Error creating test users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
