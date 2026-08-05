import { BillingCycle, PrismaClient } from '@prisma/client';
import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from 'prisma/seed.type';

export async function seedSubscriptionPlans({ prisma }: SeedContext) {
    await prisma.subscriptionPlan.createMany({
        data: [
            // =========================
            // BASIC
            // =========================

            {
                name: 'Basic Monthly',
                description: 'Basic monthly plan for small pharmacies.',
                billing_cycle: BillingCycle.MONTHLY,
                price: 1999,
                max_branches: 2,
                max_users: 2,
                report_history_months: 2,
                allow_nearby_inventory: false,
                allow_quick_sale: false,
                is_active: true,
            },

            {
                name: 'Basic Yearly',
                description: 'Basic yearly plan for small pharmacies.',
                billing_cycle: BillingCycle.YEARLY,
                price: 19999,
                max_branches: 2,
                max_users: 2,
                report_history_months: 2,
                allow_nearby_inventory: false,
                allow_quick_sale: false,
                is_active: true,
            },

            // =========================
            // PROFESSIONAL
            // =========================

            {
                name: 'Professional Monthly',
                description: 'Professional monthly plan for growing pharmacies.',
                billing_cycle: BillingCycle.MONTHLY,
                price: 3999,
                max_branches: 5,
                max_users: 5,
                report_history_months: 6,
                allow_nearby_inventory: true,
                allow_quick_sale: true,
                is_active: true,
            },

            {
                name: 'Professional Yearly',

                description: 'Professional yearly plan for growing pharmacies.',

                billing_cycle: BillingCycle.YEARLY,

                price: 39999,

                max_branches: 5,

                max_users: 5,

                report_history_months: 6,

                allow_nearby_inventory: true,

                allow_quick_sale: true,

                is_active: true,
            },

            // =========================
            // ENTERPRISE
            // =========================

            {
                name: 'Enterprise Monthly',
                description: 'Enterprise monthly plan for large pharmacy networks.',
                billing_cycle: BillingCycle.MONTHLY,
                price: 5999,
                max_branches: null,
                max_users: null,
                report_history_months: 12,
                allow_nearby_inventory: true,
                allow_quick_sale: true,
                is_active: true,
            },

            {
                name: 'Enterprise Yearly',
                description: 'Enterprise yearly plan for large pharmacy networks.',
                billing_cycle: BillingCycle.YEARLY,
                price: 59999,
                max_branches: null,
                max_users: null,
                report_history_months: 12,
                allow_nearby_inventory: true,
                allow_quick_sale: true,
                is_active: true,
            },
        ],

        skipDuplicates: true,
    });

    console.log(MESSAGES.SUCCESS.SUBSCRIPTION_PLANS_SEEDED);
}
