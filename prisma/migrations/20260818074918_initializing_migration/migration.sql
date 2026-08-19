-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "permission_effect" AS ENUM ('ALLOW', 'DENY');

-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'LOGIN', 'PASSWORD_RESET', 'EMAIL_CHANGE', 'PHONE_CHANGE');

-- CreateEnum
CREATE TYPE "OtpChannel" AS ENUM ('EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "pharmacy_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "subscription_payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "billing_cycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "batch_source_type" AS ENUM ('PURCHASE_ORDER', 'OPENING_STOCK', 'STOCK_TRANSFER', 'MANUAL_ADJUSTMENT', 'SALE_RETURN', 'DONATION', 'IMPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "purchase_order_status" AS ENUM ('DRAFT', 'PENDING_SUPPLIER', 'ACCEPTED', 'REJECTED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "invoice_status" AS ENUM ('DRAFT', 'COMPLETED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "return_status" AS ENUM ('COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "stock_adjustment_status" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "adjustment_reason" AS ENUM ('DAMAGED', 'EXPIRED', 'PHYSICAL_COUNT', 'THEFT', 'OPENING_STOCK', 'OTHER');

-- CreateEnum
CREATE TYPE "stock_transfer_status" AS ENUM ('DRAFT', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "notification_status" AS ENUM ('UNREAD', 'READ');

-- CreateEnum
CREATE TYPE "support_ticket_status" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "audit_action" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "radius_unit" AS ENUM ('KM', 'MILE');

-- CreateEnum
CREATE TYPE "SystemLogLevel" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');

-- CreateEnum
CREATE TYPE "SystemLogSource" AS ENUM ('AUTH', 'API', 'DATABASE', 'INVENTORY', 'POS', 'PURCHASE', 'SALE', 'PAYMENT', 'SUBSCRIPTION', 'NOTIFICATION', 'CRON', 'SYSTEM');

-- CreateEnum
CREATE TYPE "supplier_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RefreshTokenRevocationReason" AS ENUM ('LOGOUT', 'PASSWORD_CHANGED', 'ACCOUNT_DISABLED', 'ADMIN_REVOKED', 'SECURITY', 'TOKEN_REUSED', 'EXPIRED', 'ROTATED');

-- CreateTable
CREATE TABLE "otps" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "destination" VARCHAR(255) NOT NULL,
    "type" "OtpType" NOT NULL,
    "channel" "OtpChannel" NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified_at" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "password" VARCHAR(255) NOT NULL,
    "avatar_url" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "status" "user_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pharmacy_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "effect" "permission_effect" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "legal_name" VARCHAR(255),
    "registration_number" VARCHAR(100),
    "license_number" VARCHAR(100),
    "tax_number" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "website" VARCHAR(255),
    "logo_url" TEXT,
    "status" "pharmacy_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_branches" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "billing_cycle" "billing_cycle" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "max_branches" INTEGER,
    "max_users_per_branch" INTEGER,
    "report_history_months" INTEGER,
    "allow_nearby_inventory" BOOLEAN NOT NULL DEFAULT false,
    "allow_quick_sale" BOOLEAN NOT NULL DEFAULT false,
    "trial_days" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "subscription_status" NOT NULL DEFAULT 'TRIAL',
    "started_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "trial_started_at" TIMESTAMP(3),
    "trial_expires_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" VARCHAR(500),
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_payments" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_status" "subscription_payment_status" NOT NULL DEFAULT 'PENDING',
    "payment_reference" VARCHAR(255),
    "paid_at" TIMESTAMP(3),
    "payment_method" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "manufacturer_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "generic_name" VARCHAR(255),
    "formula" VARCHAR(1000),
    "product_type_id" UUID,
    "retail_category_id" UUID,
    "dosage_form_id" UUID,
    "strength" VARCHAR(100),
    "pack_quantity" INTEGER,
    "pack_unit" VARCHAR(50),
    "barcode" VARCHAR(100),
    "image_url" TEXT,
    "description" TEXT,
    "requires_prescription" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_products" (
    "id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "selling_price" DECIMAL(12,2) NOT NULL,
    "is_controlled_drug" BOOLEAN NOT NULL DEFAULT false,
    "storage_instructions" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "branch_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retail_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "retail_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosage_forms" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "dosage_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_batches" (
    "id" UUID NOT NULL,
    "branch_product_id" UUID NOT NULL,
    "batch_number" VARCHAR(100) NOT NULL,
    "manufacturing_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "purchase_price" DECIMAL(12,2) NOT NULL,
    "mrp" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "source_type" "batch_source_type" NOT NULL,
    "purchase_order_item_id" UUID,

    CONSTRAINT "product_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "purchase_order_number" VARCHAR(50) NOT NULL,
    "status" "purchase_order_status" NOT NULL DEFAULT 'DRAFT',
    "order_date" DATE NOT NULL,
    "expected_delivery_date" DATE,
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "shipping_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "other_charges" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "supplier_response_at" TIMESTAMP(3),
    "fulfilled_at" TIMESTAMP(3),
    "received_at" TIMESTAMP(3),
    "supplier_notes" TEXT,
    "receiver_notes" TEXT,
    "internal_notes" TEXT,
    "created_by" UUID,
    "approved_by" UUID,
    "received_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" UUID NOT NULL,
    "purchase_order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "ordered_quantity" DECIMAL(14,3) NOT NULL,
    "fulfilled_quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "received_quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "unit_cost" DECIMAL(14,2) NOT NULL,
    "discount_percentage" DECIMAL(5,2),
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_percentage" DECIMAL(5,2),
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(14,2) NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "customer_code" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "gender" "gender",
    "date_of_birth" DATE,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "loyalty_points" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "is_walk_in" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_cash" BOOLEAN NOT NULL DEFAULT false,
    "requires_reference" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "cashier_id" UUID NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL,
    "status" "invoice_status" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "rounding_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "due_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "branch_product_id" UUID NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL,
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(14,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_item_batches" (
    "id" UUID NOT NULL,
    "invoice_item_id" UUID NOT NULL,
    "product_batch_id" UUID NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_item_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_payments" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "payment_method_id" UUID NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "gateway_transaction_id" VARCHAR(255),
    "gateway_reference" VARCHAR(255),
    "gateway_response" JSONB,
    "metadata" JSONB,
    "notes" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hold_orders" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "customer_id" UUID,
    "cashier_id" UUID NOT NULL,
    "hold_number" VARCHAR(50) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hold_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hold_order_items" (
    "id" UUID NOT NULL,
    "hold_order_id" UUID NOT NULL,
    "branch_product_id" UUID NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL,
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hold_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "returns" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "cashier_id" UUID NOT NULL,
    "return_number" VARCHAR(50) NOT NULL,
    "refund_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" "return_status" NOT NULL DEFAULT 'COMPLETED',
    "reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" UUID NOT NULL,
    "return_id" UUID NOT NULL,
    "invoice_item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "refund_amount" DECIMAL(14,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "adjustment_number" VARCHAR(50) NOT NULL,
    "status" "stock_adjustment_status" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "adjusted_by" UUID NOT NULL,
    "adjusted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_adjustment_items" (
    "id" UUID NOT NULL,
    "stock_adjustment_id" UUID NOT NULL,
    "branch_product_id" UUID NOT NULL,
    "product_batch_id" UUID,
    "reason" "adjustment_reason" NOT NULL,
    "quantity_before" DECIMAL(14,3) NOT NULL,
    "quantity_after" DECIMAL(14,3) NOT NULL,
    "adjustment_quantity" DECIMAL(14,3) NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "stock_adjustment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "from_branch_id" UUID NOT NULL,
    "to_branch_id" UUID NOT NULL,
    "transfer_number" VARCHAR(50) NOT NULL,
    "status" "stock_transfer_status" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "requested_by" UUID NOT NULL,
    "dispatched_by" UUID,
    "received_by" UUID,
    "dispatched_at" TIMESTAMP(3),
    "received_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfer_items" (
    "id" UUID NOT NULL,
    "stock_transfer_id" UUID NOT NULL,
    "branch_product_id" UUID NOT NULL,
    "product_batch_id" UUID,
    "quantity" DECIMAL(14,3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "stock_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID,
    "user_id" UUID NOT NULL,
    "status" "notification_status" NOT NULL DEFAULT 'UNREAD',
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "reference_type" VARCHAR(50),
    "reference_id" UUID,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "ticket_number" VARCHAR(50) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "status" "support_ticket_status" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_ticket_messages" (
    "id" UUID NOT NULL,
    "support_ticket_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_ticket_attachments" (
    "id" UUID NOT NULL,
    "support_ticket_id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "mime_type" VARCHAR(100),
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_ticket_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID,
    "branch_id" UUID,
    "user_id" UUID,
    "action" "audit_action" NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "before_data" JSONB,
    "after_data" JSONB,
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacy_settings" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "timezone" VARCHAR(100) NOT NULL DEFAULT 'Asia/Karachi',
    "currency" VARCHAR(10) NOT NULL DEFAULT 'PKR',
    "receipt_header" TEXT,
    "receipt_footer" TEXT,
    "print_logo" BOOLEAN NOT NULL DEFAULT true,
    "print_tax_number" BOOLEAN NOT NULL DEFAULT true,
    "print_phone" BOOLEAN NOT NULL DEFAULT true,
    "print_address" BOOLEAN NOT NULL DEFAULT true,
    "print_qr_code" BOOLEAN NOT NULL DEFAULT false,
    "show_cashier_name" BOOLEAN NOT NULL DEFAULT true,
    "minimum_stock_quantity" INTEGER NOT NULL DEFAULT 10,
    "critical_stock_quantity" INTEGER NOT NULL DEFAULT 5,
    "expiry_alert_before_days" INTEGER NOT NULL DEFAULT 30,
    "enable_stock_sharing" BOOLEAN NOT NULL DEFAULT false,
    "share_inventory_details" BOOLEAN NOT NULL DEFAULT false,
    "allow_reservations" BOOLEAN NOT NULL DEFAULT false,
    "search_radius" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "radius_unit" "radius_unit" NOT NULL DEFAULT 'KM',
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "sms_notifications" BOOLEAN NOT NULL DEFAULT false,
    "push_notifications" BOOLEAN NOT NULL DEFAULT true,
    "in_app_notifications" BOOLEAN NOT NULL DEFAULT true,
    "low_stock_alert" BOOLEAN NOT NULL DEFAULT true,
    "expiry_alert" BOOLEAN NOT NULL DEFAULT true,
    "purchase_alert" BOOLEAN NOT NULL DEFAULT true,
    "sale_alert" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharmacy_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID,
    "branch_id" UUID,
    "user_id" UUID,
    "level" "SystemLogLevel" NOT NULL,
    "source" "SystemLogSource" NOT NULL,
    "event" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "ip_address" VARCHAR(50),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255),
    "registration_number" VARCHAR(100),
    "tax_number" VARCHAR(100),
    "contact_person" VARCHAR(255),
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "address" TEXT,
    "city" VARCHAR(100),
    "notes" TEXT,
    "status" "supplier_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" "RefreshTokenRevocationReason",
    "replaced_by_token_id" UUID,
    "device_name" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otps_destination_idx" ON "otps"("destination");

-- CreateIndex
CREATE INDEX "otps_expires_at_idx" ON "otps"("expires_at");

-- CreateIndex
CREATE INDEX "otps_type_idx" ON "otps"("type");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions"("role_id");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions"("user_id");

-- CreateIndex
CREATE INDEX "user_permissions_permission_id_idx" ON "user_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE INDEX "pharmacies_status_idx" ON "pharmacies"("status");

-- CreateIndex
CREATE INDEX "branches_pharmacy_id_idx" ON "branches"("pharmacy_id");

-- CreateIndex
CREATE INDEX "branches_city_idx" ON "branches"("city");

-- CreateIndex
CREATE UNIQUE INDEX "branches_pharmacy_id_name_key" ON "branches"("pharmacy_id", "name");

-- CreateIndex
CREATE INDEX "user_branches_user_id_idx" ON "user_branches"("user_id");

-- CreateIndex
CREATE INDEX "user_branches_branch_id_idx" ON "user_branches"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_branches_user_id_branch_id_key" ON "user_branches"("user_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE INDEX "subscription_plans_is_active_idx" ON "subscription_plans"("is_active");

-- CreateIndex
CREATE INDEX "subscriptions_pharmacy_id_idx" ON "subscriptions"("pharmacy_id");

-- CreateIndex
CREATE INDEX "subscriptions_plan_id_idx" ON "subscriptions"("plan_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_expires_at_idx" ON "subscriptions"("expires_at");

-- CreateIndex
CREATE INDEX "subscription_payments_subscription_id_idx" ON "subscription_payments"("subscription_id");

-- CreateIndex
CREATE INDEX "subscription_payments_payment_status_idx" ON "subscription_payments"("payment_status");

-- CreateIndex
CREATE INDEX "subscription_payments_paid_at_idx" ON "subscription_payments"("paid_at");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_name_key" ON "manufacturers"("name");

-- CreateIndex
CREATE INDEX "manufacturers_name_idx" ON "manufacturers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_generic_name_idx" ON "products"("generic_name");

-- CreateIndex
CREATE INDEX "products_manufacturer_id_idx" ON "products"("manufacturer_id");

-- CreateIndex
CREATE INDEX "products_barcode_idx" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "products_requires_prescription_idx" ON "products"("requires_prescription");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE INDEX "products_product_type_id_idx" ON "products"("product_type_id");

-- CreateIndex
CREATE INDEX "products_retail_category_id_idx" ON "products"("retail_category_id");

-- CreateIndex
CREATE INDEX "products_dosage_form_id_idx" ON "products"("dosage_form_id");

-- CreateIndex
CREATE INDEX "branch_products_branch_id_idx" ON "branch_products"("branch_id");

-- CreateIndex
CREATE INDEX "branch_products_product_id_idx" ON "branch_products"("product_id");

-- CreateIndex
CREATE INDEX "branch_products_selling_price_idx" ON "branch_products"("selling_price");

-- CreateIndex
CREATE INDEX "branch_products_is_active_idx" ON "branch_products"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "branch_products_branch_id_product_id_key" ON "branch_products"("branch_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_name_key" ON "product_types"("name");

-- CreateIndex
CREATE INDEX "product_types_name_idx" ON "product_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "retail_categories_name_key" ON "retail_categories"("name");

-- CreateIndex
CREATE INDEX "retail_categories_parent_id_idx" ON "retail_categories"("parent_id");

-- CreateIndex
CREATE INDEX "retail_categories_name_idx" ON "retail_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dosage_forms_name_key" ON "dosage_forms"("name");

-- CreateIndex
CREATE INDEX "dosage_forms_name_idx" ON "dosage_forms"("name");

-- CreateIndex
CREATE INDEX "product_batches_branch_product_id_idx" ON "product_batches"("branch_product_id");

-- CreateIndex
CREATE INDEX "product_batches_expiry_date_idx" ON "product_batches"("expiry_date");

-- CreateIndex
CREATE INDEX "product_batches_batch_number_idx" ON "product_batches"("batch_number");

-- CreateIndex
CREATE UNIQUE INDEX "product_batches_branch_product_id_batch_number_key" ON "product_batches"("branch_product_id", "batch_number");

-- CreateIndex
CREATE INDEX "purchase_orders_pharmacy_id_idx" ON "purchase_orders"("pharmacy_id");

-- CreateIndex
CREATE INDEX "purchase_orders_branch_id_idx" ON "purchase_orders"("branch_id");

-- CreateIndex
CREATE INDEX "purchase_orders_supplier_id_idx" ON "purchase_orders"("supplier_id");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_orders_order_date_idx" ON "purchase_orders"("order_date");

-- CreateIndex
CREATE INDEX "purchase_orders_expected_delivery_date_idx" ON "purchase_orders"("expected_delivery_date");

-- CreateIndex
CREATE INDEX "purchase_orders_created_by_idx" ON "purchase_orders"("created_by");

-- CreateIndex
CREATE INDEX "purchase_orders_approved_by_idx" ON "purchase_orders"("approved_by");

-- CreateIndex
CREATE INDEX "purchase_orders_received_by_idx" ON "purchase_orders"("received_by");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_branch_id_purchase_order_number_key" ON "purchase_orders"("branch_id", "purchase_order_number");

-- CreateIndex
CREATE INDEX "purchase_order_items_purchase_order_id_idx" ON "purchase_order_items"("purchase_order_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_product_id_idx" ON "purchase_order_items"("product_id");

-- CreateIndex
CREATE INDEX "customers_pharmacy_id_idx" ON "customers"("pharmacy_id");

-- CreateIndex
CREATE INDEX "customers_phone_idx" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_is_walk_in_idx" ON "customers"("is_walk_in");

-- CreateIndex
CREATE INDEX "customers_is_active_idx" ON "customers"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "customers_pharmacy_id_customer_code_key" ON "customers"("pharmacy_id", "customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_pharmacy_id_phone_key" ON "customers"("pharmacy_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "customers_pharmacy_id_email_key" ON "customers"("pharmacy_id", "email");

-- CreateIndex
CREATE INDEX "payment_methods_pharmacy_id_idx" ON "payment_methods"("pharmacy_id");

-- CreateIndex
CREATE INDEX "payment_methods_is_active_idx" ON "payment_methods"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_pharmacy_id_code_key" ON "payment_methods"("pharmacy_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_pharmacy_id_name_key" ON "payment_methods"("pharmacy_id", "name");

-- CreateIndex
CREATE INDEX "invoices_pharmacy_id_idx" ON "invoices"("pharmacy_id");

-- CreateIndex
CREATE INDEX "invoices_branch_id_idx" ON "invoices"("branch_id");

-- CreateIndex
CREATE INDEX "invoices_customer_id_idx" ON "invoices"("customer_id");

-- CreateIndex
CREATE INDEX "invoices_cashier_id_idx" ON "invoices"("cashier_id");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_completed_at_idx" ON "invoices"("completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_branch_id_invoice_number_key" ON "invoices"("branch_id", "invoice_number");

-- CreateIndex
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_items_product_id_idx" ON "invoice_items"("product_id");

-- CreateIndex
CREATE INDEX "invoice_items_branch_product_id_idx" ON "invoice_items"("branch_product_id");

-- CreateIndex
CREATE INDEX "invoice_item_batches_invoice_item_id_idx" ON "invoice_item_batches"("invoice_item_id");

-- CreateIndex
CREATE INDEX "invoice_item_batches_product_batch_id_idx" ON "invoice_item_batches"("product_batch_id");

-- CreateIndex
CREATE INDEX "invoice_payments_invoice_id_idx" ON "invoice_payments"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_payments_payment_method_id_idx" ON "invoice_payments"("payment_method_id");

-- CreateIndex
CREATE INDEX "invoice_payments_status_idx" ON "invoice_payments"("status");

-- CreateIndex
CREATE INDEX "hold_orders_branch_id_idx" ON "hold_orders"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "hold_orders_branch_id_hold_number_key" ON "hold_orders"("branch_id", "hold_number");

-- CreateIndex
CREATE INDEX "hold_order_items_hold_order_id_idx" ON "hold_order_items"("hold_order_id");

-- CreateIndex
CREATE INDEX "hold_order_items_branch_product_id_idx" ON "hold_order_items"("branch_product_id");

-- CreateIndex
CREATE INDEX "returns_invoice_id_idx" ON "returns"("invoice_id");

-- CreateIndex
CREATE INDEX "returns_customer_id_idx" ON "returns"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "returns_branch_id_return_number_key" ON "returns"("branch_id", "return_number");

-- CreateIndex
CREATE INDEX "return_items_return_id_idx" ON "return_items"("return_id");

-- CreateIndex
CREATE INDEX "return_items_invoice_item_id_idx" ON "return_items"("invoice_item_id");

-- CreateIndex
CREATE INDEX "stock_adjustments_branch_id_idx" ON "stock_adjustments"("branch_id");

-- CreateIndex
CREATE INDEX "stock_adjustments_status_idx" ON "stock_adjustments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_adjustments_branch_id_adjustment_number_key" ON "stock_adjustments"("branch_id", "adjustment_number");

-- CreateIndex
CREATE INDEX "stock_adjustment_items_stock_adjustment_id_idx" ON "stock_adjustment_items"("stock_adjustment_id");

-- CreateIndex
CREATE INDEX "stock_adjustment_items_branch_product_id_idx" ON "stock_adjustment_items"("branch_product_id");

-- CreateIndex
CREATE INDEX "stock_transfers_from_branch_id_idx" ON "stock_transfers"("from_branch_id");

-- CreateIndex
CREATE INDEX "stock_transfers_to_branch_id_idx" ON "stock_transfers"("to_branch_id");

-- CreateIndex
CREATE INDEX "stock_transfers_status_idx" ON "stock_transfers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transfers_pharmacy_id_transfer_number_key" ON "stock_transfers"("pharmacy_id", "transfer_number");

-- CreateIndex
CREATE INDEX "stock_transfer_items_stock_transfer_id_idx" ON "stock_transfer_items"("stock_transfer_id");

-- CreateIndex
CREATE INDEX "stock_transfer_items_branch_product_id_idx" ON "stock_transfer_items"("branch_product_id");

-- CreateIndex
CREATE INDEX "stock_transfer_items_product_batch_id_idx" ON "stock_transfer_items"("product_batch_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_created_by_idx" ON "support_tickets"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_pharmacy_id_ticket_number_key" ON "support_tickets"("pharmacy_id", "ticket_number");

-- CreateIndex
CREATE INDEX "support_ticket_messages_support_ticket_id_idx" ON "support_ticket_messages"("support_ticket_id");

-- CreateIndex
CREATE INDEX "support_ticket_attachments_support_ticket_id_idx" ON "support_ticket_attachments"("support_ticket_id");

-- CreateIndex
CREATE INDEX "audit_logs_pharmacy_id_idx" ON "audit_logs"("pharmacy_id");

-- CreateIndex
CREATE INDEX "audit_logs_branch_id_idx" ON "audit_logs"("branch_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacy_settings_pharmacy_id_key" ON "pharmacy_settings"("pharmacy_id");

-- CreateIndex
CREATE INDEX "system_logs_level_idx" ON "system_logs"("level");

-- CreateIndex
CREATE INDEX "system_logs_source_idx" ON "system_logs"("source");

-- CreateIndex
CREATE INDEX "system_logs_created_at_idx" ON "system_logs"("created_at");

-- CreateIndex
CREATE INDEX "system_logs_pharmacy_id_idx" ON "system_logs"("pharmacy_id");

-- CreateIndex
CREATE INDEX "system_logs_branch_id_idx" ON "system_logs"("branch_id");

-- CreateIndex
CREATE INDEX "system_logs_user_id_idx" ON "system_logs"("user_id");

-- CreateIndex
CREATE INDEX "suppliers_pharmacy_id_idx" ON "suppliers"("pharmacy_id");

-- CreateIndex
CREATE INDEX "suppliers_status_idx" ON "suppliers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_pharmacy_id_name_key" ON "suppliers"("pharmacy_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_revoked_at_idx" ON "refresh_tokens"("revoked_at");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_branches" ADD CONSTRAINT "user_branches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_branches" ADD CONSTRAINT "user_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_retail_category_id_fkey" FOREIGN KEY ("retail_category_id") REFERENCES "retail_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_dosage_form_id_fkey" FOREIGN KEY ("dosage_form_id") REFERENCES "dosage_forms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_products" ADD CONSTRAINT "branch_products_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_products" ADD CONSTRAINT "branch_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retail_categories" ADD CONSTRAINT "retail_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "retail_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_batches" ADD CONSTRAINT "product_batches_branch_product_id_fkey" FOREIGN KEY ("branch_product_id") REFERENCES "branch_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_batches" ADD CONSTRAINT "product_batches_purchase_order_item_id_fkey" FOREIGN KEY ("purchase_order_item_id") REFERENCES "purchase_order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_branch_product_id_fkey" FOREIGN KEY ("branch_product_id") REFERENCES "branch_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_item_batches" ADD CONSTRAINT "invoice_item_batches_invoice_item_id_fkey" FOREIGN KEY ("invoice_item_id") REFERENCES "invoice_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_item_batches" ADD CONSTRAINT "invoice_item_batches_product_batch_id_fkey" FOREIGN KEY ("product_batch_id") REFERENCES "product_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_orders" ADD CONSTRAINT "hold_orders_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_orders" ADD CONSTRAINT "hold_orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_orders" ADD CONSTRAINT "hold_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_orders" ADD CONSTRAINT "hold_orders_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_order_items" ADD CONSTRAINT "hold_order_items_hold_order_id_fkey" FOREIGN KEY ("hold_order_id") REFERENCES "hold_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_order_items" ADD CONSTRAINT "hold_order_items_branch_product_id_fkey" FOREIGN KEY ("branch_product_id") REFERENCES "branch_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_invoice_item_id_fkey" FOREIGN KEY ("invoice_item_id") REFERENCES "invoice_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_adjusted_by_fkey" FOREIGN KEY ("adjusted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_stock_adjustment_id_fkey" FOREIGN KEY ("stock_adjustment_id") REFERENCES "stock_adjustments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_branch_product_id_fkey" FOREIGN KEY ("branch_product_id") REFERENCES "branch_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_product_batch_id_fkey" FOREIGN KEY ("product_batch_id") REFERENCES "product_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_branch_id_fkey" FOREIGN KEY ("from_branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_branch_id_fkey" FOREIGN KEY ("to_branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_dispatched_by_fkey" FOREIGN KEY ("dispatched_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_stock_transfer_id_fkey" FOREIGN KEY ("stock_transfer_id") REFERENCES "stock_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_branch_product_id_fkey" FOREIGN KEY ("branch_product_id") REFERENCES "branch_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_product_batch_id_fkey" FOREIGN KEY ("product_batch_id") REFERENCES "product_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_messages" ADD CONSTRAINT "support_ticket_messages_support_ticket_id_fkey" FOREIGN KEY ("support_ticket_id") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_messages" ADD CONSTRAINT "support_ticket_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_attachments" ADD CONSTRAINT "support_ticket_attachments_support_ticket_id_fkey" FOREIGN KEY ("support_ticket_id") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_settings" ADD CONSTRAINT "pharmacy_settings_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
