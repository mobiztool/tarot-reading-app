/**
 * Stripe Customer Management
 * Creates and manages Stripe customers linked to app users
 */
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { logStripeError } from './errors';

// Lazy import stripe to prevent build-time API key requirement
const getStripe = async () => {
  const { stripe } = await import('./server');
  return stripe;
};

/**
 * Create a new Stripe customer for a user
 * Links the Stripe customer ID to the user in database
 */
export async function createStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  // Check if customer already exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, name: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  try {
    // Create customer in Stripe
    const stripe = await getStripe();
    const customer = await stripe.customers.create({
      email,
      name: name || user?.name || undefined,
      metadata: {
        userId,
        source: 'tarot-reading-app',
      },
    });

    // Save Stripe customer ID to database
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  } catch (error) {
    logStripeError(error, {
      operation: 'createStripeCustomer',
      userId,
    });
    throw error;
  }
}

/**
 * Get or create Stripe customer for a user
 * Returns existing customer ID or creates new one
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  // First try to find existing user
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, name: true },
  });

  // If user doesn't exist in our database, create them
  if (!user) {
    console.log('[Stripe Customer] User not found in database, creating:', userId);
    user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        name: name || null,
      },
      select: { stripeCustomerId: true, name: true },
    });
  }

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  return createStripeCustomer(userId, email, name || user?.name);
}

/**
 * Update Stripe customer information
 */
export async function updateStripeCustomer(
  customerId: string,
  updates: Stripe.CustomerUpdateParams
): Promise<Stripe.Customer> {
  try {
    const stripe = await getStripe();
    const customer = await stripe.customers.update(customerId, updates);
    return customer;
  } catch (error) {
    logStripeError(error, {
      operation: 'updateStripeCustomer',
      customerId,
    });
    throw error;
  }
}

/**
 * Get Stripe customer by ID
 */
export async function getStripeCustomer(
  customerId: string
): Promise<Stripe.Customer | Stripe.DeletedCustomer | null> {
  try {
    const stripe = await getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    logStripeError(error, {
      operation: 'getStripeCustomer',
      customerId,
    });
    return null;
  }
}

/**
 * Get Stripe customer ID from user ID
 */
export async function getStripeCustomerIdByUserId(
  userId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  return user?.stripeCustomerId || null;
}

/**
 * Delete Stripe customer (for GDPR compliance)
 */
export async function deleteStripeCustomer(customerId: string): Promise<boolean> {
  try {
    const stripe = await getStripe();
    await stripe.customers.del(customerId);
    return true;
  } catch (error) {
    logStripeError(error, {
      operation: 'deleteStripeCustomer',
      customerId,
    });
    return false;
  }
}

/**
 * Sync user info to Stripe customer
 * Call this when user updates their profile
 */
export async function syncUserToStripeCustomer(
  userId: string,
  email?: string,
  name?: string | null
): Promise<void> {
  const customerId = await getStripeCustomerIdByUserId(userId);
  
  if (!customerId) {
    return;
  }

  const updates: Stripe.CustomerUpdateParams = {};
  
  if (email) {
    updates.email = email;
  }
  
  if (name !== undefined) {
    updates.name = name || undefined;
  }

  if (Object.keys(updates).length > 0) {
    await updateStripeCustomer(customerId, updates);
  }
}
