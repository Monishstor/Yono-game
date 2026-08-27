import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').default('user').notNull(), // 'admin' | 'user'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Gaming Apps Catalog table
export const apps = pgTable('apps', {
  id: serial('id').primaryKey(),
  appId: text('app_id').notNull().unique(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  imageUrl: text('image_url').notNull(),
  downloadUrl: text('download_url').notNull(),
  backupDownloadUrl: text('backup_download_url'),
  category: text('category').array(),
  signupBonus: integer('signup_bonus').default(0).notNull(),
  minWithdrawal: integer('min_withdrawal').default(100).notNull(),
  referCode: text('refer_code'),
  rating: doublePrecision('rating').default(4.8).notNull(),
  downloads: text('downloads').default('1M+'),
  isCustom: boolean('is_custom').default(false).notNull(),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Site Settings table
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  siteTitle: text('site_title'),
  metaDescription: text('meta_description'),
  telegramUrl: text('telegram_url'),
  whatsappShareText: text('whatsapp_share_text'),
  notices: text('notices').array(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Promo Codes table
export const promoCodes = pgTable('promo_codes', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  title: text('title').notNull(),
  reward: text('reward').notNull(),
  appTarget: text('app_target'),
  status: text('status').default('Hot').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Withdrawal Feeds table
export const withdrawalFeeds = pgTable('withdrawal_feeds', {
  id: serial('id').primaryKey(),
  appName: text('app_name').notNull(),
  amount: integer('amount').notNull(),
  timestamp: text('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
