import { db } from './index.ts';
import { users, apps, siteSettings, promoCodes, withdrawalFeeds } from './schema.ts';
import { eq } from 'drizzle-orm';
import { YonoApp, SiteSettings as SiteSettingsType, PromoCode } from '../types.ts';

// User Helpers
export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database user operation failed:", error);
    throw new Error("Failed to get or create user record.", { cause: error });
  }
}

// App Catalog Helpers
export async function getAllApps() {
  try {
    return await db.select().from(apps).orderBy(apps.id);
  } catch (error) {
    console.error("Failed to query apps:", error);
    throw new Error("Database query failed for apps catalog.", { cause: error });
  }
}

export async function upsertApp(appData: YonoApp) {
  try {
    const result = await db.insert(apps)
      .values({
        appId: appData.id,
        name: appData.name,
        tagline: appData.tagline,
        imageUrl: appData.imageUrl || '',
        downloadUrl: appData.downloadUrl || '',
        backupDownloadUrl: appData.backupDownloadUrl,
        category: appData.category,
        signupBonus: appData.signupBonus,
        minWithdrawal: appData.minWithdrawal,
        referCode: appData.referCode,
        rating: appData.rating,
        downloads: appData.downloads,
        isCustom: appData.isCustom || false,
        status: 'active',
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: apps.appId,
        set: {
          name: appData.name,
          tagline: appData.tagline,
          imageUrl: appData.imageUrl || '',
          downloadUrl: appData.downloadUrl || '',
          backupDownloadUrl: appData.backupDownloadUrl,
          category: appData.category,
          signupBonus: appData.signupBonus,
          minWithdrawal: appData.minWithdrawal,
          referCode: appData.referCode,
          rating: appData.rating,
          downloads: appData.downloads,
          isCustom: appData.isCustom || false,
          status: 'active',
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to upsert app:", error);
    throw new Error("Failed to save app to database.", { cause: error });
  }
}

// Site Settings Helpers
export async function getSiteSettings() {
  try {
    const results = await db.select().from(siteSettings).where(eq(siteSettings.key, 'global_config'));
    return results[0] || null;
  } catch (error) {
    console.error("Failed to query site settings:", error);
    throw new Error("Database query failed for site settings.", { cause: error });
  }
}

export async function updateSiteSettings(settings: SiteSettingsType) {
  try {
    const noticeTexts = Array.isArray(settings.notices) 
      ? settings.notices.map(n => typeof n === 'string' ? n : n.text) 
      : [];

    const result = await db.insert(siteSettings)
      .values({
        key: 'global_config',
        siteTitle: settings.siteTitle,
        metaDescription: settings.metaDescription,
        telegramUrl: settings.telegramLink,
        whatsappShareText: settings.whatsappShareText,
        notices: noticeTexts,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          siteTitle: settings.siteTitle,
          metaDescription: settings.metaDescription,
          telegramUrl: settings.telegramLink,
          whatsappShareText: settings.whatsappShareText,
          notices: noticeTexts,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to update site settings:", error);
    throw new Error("Failed to save site settings to database.", { cause: error });
  }
}
