import fs from 'fs';
import path from 'path';
import { YONO_APPS } from '../src/data/appsData';
import { FAQ_DATA } from '../src/data/faqData';
import { YonoApp } from '../src/types';

const BASE_URL = 'https://yono-game.vercel.app';
const TODAY_DATE = '2026-09-02';
const isDistMode = process.argv.includes('--dist');

// 1. Build ItemList schema for all apps
const itemListElements = YONO_APPS.map((app, index) => {
  const slug = app.slug || app.id;
  return {
    '@type': 'ListItem',
    position: index + 1,
    name: `${app.name} APK`,
    url: `${BASE_URL}/${slug}`
  };
});

// 2. Build FAQ schema for homepage
const faqElements = FAQ_DATA.map((faq) => ({
  '@type': 'Question',
  name: faq.question,
  acceptedAnswer: {
    '@type': 'Answer',
    text: faq.answer
  }
}));

// 3. Build Homepage semantic HTML for #root
const appsHtmlList = YONO_APPS.map((app, idx) => {
  const slug = app.slug || app.id;
  const appUrl = `/${slug}`;
  return `        <li style="margin-bottom: 16px; padding: 16px; border: 1px solid #334155; border-radius: 10px; background-color: #0f172a;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <h3 style="margin: 0 0 6px 0; font-size: 18px;">
                <a href="${appUrl}" style="color: #f59e0b; font-weight: 800; text-decoration: none;">
                  #${idx + 1} ${app.name} APK Download
                </a>
                ${app.badge ? `<span style="font-size: 11px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 9999px; margin-left: 8px;">[${app.badge}]</span>` : ''}
              </h3>
              <p style="margin: 0 0 6px 0; color: #cbd5e1; font-size: 14px;">
                <strong>Sign-up Bonus:</strong> ₹${app.signupBonus}${app.maxSignupBonus ? ` - ₹${app.maxSignupBonus}` : ''} Free | 
                <strong>Min Withdrawal:</strong> ₹${app.minWithdrawal} Instant UPI | 
                <strong>Rating:</strong> ${app.rating}⭐ (${app.downloads}) | 
                <strong>Refer Code:</strong> <code style="color: #f59e0b; font-weight: bold; background: #1e293b; padding: 2px 6px; border-radius: 4px;">${app.referCode}</code>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                ${app.tagline || `Play verified card and slot games with fast UPI payouts on ${app.name}.`}
              </p>
            </div>
            <a href="${app.downloadUrl}" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: 800; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; white-space: nowrap;">
              ⚡ Download APK (${app.apkSize})
            </a>
          </div>
        </li>`;
}).join('\n');

const faqsHtml = FAQ_DATA.map((faq) => `        <div style="margin-bottom: 16px; padding: 14px; border: 1px solid #1e293b; border-radius: 8px; background-color: #020617;">
          <h3 style="margin: 0 0 8px 0; color: #f8fafc; font-size: 16px; font-weight: 700;">${faq.question}</h3>
          <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">${faq.answer}</p>
        </div>`).join('\n');

// 4. Helper to generate App-specific FAQs
function getAppFaqs(app: YonoApp) {
  return [
    {
      q: `How to download and install ${app.name} APK on Android?`,
      a: `To download ${app.name} APK safely: 1) Click the golden \"Download Official APK\" button on this page. 2) Once the file (${app.apkSize}) completes downloading, open it from your phone's notification bar or downloads folder. 3) If prompted, enable \"Install from Unknown Sources\" in Android settings. 4) The app installs in under 10 seconds.`
    },
    {
      q: `How much Sign-up Bonus do I get in ${app.name}?`,
      a: `New players get an instant free sign-up bonus of ₹${app.signupBonus}${app.maxSignupBonus ? ` up to ₹${app.maxSignupBonus}` : ''} immediately after binding their mobile number via OTP. Use official referral code \"${app.referCode}\" during registration to unlock maximum VIP welcome rewards and deposit match.`
    },
    {
      q: `What is the minimum withdrawal limit and payout time for ${app.name}?`,
      a: `The minimum withdrawal limit for ${app.name} is just ₹${app.minWithdrawal}. Payouts are processed in ${app.withdrawalSpeed || '1 to 5 minutes'} directly to your bank account or UPI ID (Google Pay, PhonePe, Paytm, BHIM) 24/7 with zero hidden fees.`
    },
    {
      q: `Is ${app.name} APK safe and virus-free?`,
      a: `Yes, ${app.name} APK is 100% verified and scanned with Google Play Protect and VirusTotal. It contains zero adware or malware and connects securely over 256-bit SSL encrypted servers.`
    }
  ];
}

// 5. Generate dedicated Pre-rendered HTML for a single game
function generateAppHtml(app: YonoApp, scriptTag: string, styleTags: string): string {
  const slug = app.slug || app.id;
  const canonicalUrl = `${BASE_URL}/${slug}`;
  const title = `${app.name} APK Download (Official 2026) - New Yono Games 2026 & Instant Withdrawal App`;
  const desc = `Download official ${app.name} APK for Android. Verified New Yono Games 2026 instant withdrawal app with ${app.withdrawalSpeed || '1-3 min'} ₹${app.minWithdrawal} UPI withdrawal, ₹${app.signupBonus}${app.maxSignupBonus ? ` to ₹${app.maxSignupBonus}` : ''} Free Bonus with referral code ${app.referCode}.`;
  const keywords = `${app.name} apk download, new yono games 2026, instant withdrawal apps, ${app.name} instant withdrawal, ${app.name} official app, ${app.name} refer code, ${app.name} bonus ₹${app.signupBonus}, ${app.name} rummy apk, instant upi withdrawal rummy app, all yono apps 2026`;
  const appFaqs = getAppFaqs(app);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': app.name,
    'operatingSystem': 'Android',
    'applicationCategory': 'GameApplication',
    'fileSize': app.apkSize,
    'softwareVersion': app.version || 'v2.8.5',
    'downloadUrl': app.downloadUrl,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': String(app.rating),
      'ratingCount': app.reviewsCount ? String(app.reviewsCount) : '15400',
      'bestRating': '5',
      'worstRating': '1'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${BASE_URL}/`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'All Yono Games',
        'item': `${BASE_URL}/`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${app.name} APK`,
        'item': canonicalUrl
      }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': appFaqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  // Other top games to display at bottom for internal SEO link juice
  const otherApps = YONO_APPS.filter(a => a.id !== app.id).slice(0, 6);
  const otherAppsHtml = otherApps.map(o => {
    const oSlug = o.slug || o.id;
    return `          <li style="margin-bottom: 8px;">
            <a href="/${oSlug}" style="color: #f59e0b; text-decoration: underline; font-weight: 600;">
              ${o.name} APK (₹${o.signupBonus} Bonus)
            </a> - ${o.tagline || 'Verified Yono game download'}
          </li>`;
  }).join('\n');

  const faqsRenderHtml = appFaqs.map(f => `        <div style="margin-bottom: 16px; padding: 14px; border: 1px solid #1e293b; border-radius: 8px; background-color: #0b1329;">
          <h3 style="margin: 0 0 8px 0; color: #f8fafc; font-size: 15px; font-weight: 700;">${f.q}</h3>
          <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">${f.a}</p>
        </div>`).join('\n');

  return `<!doctype html>
<html lang="en-IN" class="dark" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="bingbot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="theme-color" content="#f59e0b" />
    <meta name="google-site-verification" content="PuYCOqnll6hKoInkrOAa3rbDy2J5Pt_T_ziySmBgcjA" />
    <meta name="google-site-verification" content="qrp2K5vYd82Cx3k1E2_0oUczGSXl3c9LcNhUjr686gY" />
    
    <!-- Self-referencing Canonical URL for this specific APK (Matches Sitemap.xml) -->
    <link rel="canonical" href="${canonicalUrl}" id="dynamic-canonical" />
    <link rel="alternate" hreflang="en-IN" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />
    <link rel="icon" type="image/svg+xml" href="/main-site-logo.svg" />
    <link rel="apple-touch-icon" href="/main-site-logo.svg" />
    
    <!-- OpenGraph Metadata -->
    <meta property="og:type" content="product" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${BASE_URL}${app.imageUrl || '/main-site-logo.svg'}" />
    <meta property="og:site_name" content="All New Yono Apps" />
    
    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${BASE_URL}${app.imageUrl || '/main-site-logo.svg'}" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&family=Plus+Jakarta+Sans:wght@500;700&display=swap" />
    ${styleTags}

    <!-- Schema.org SoftwareApplication -->
    <script type="application/ld+json">
      ${JSON.stringify(softwareSchema)}
    </script>

    <!-- Schema.org BreadcrumbList -->
    <script type="application/ld+json">
      ${JSON.stringify(breadcrumbSchema)}
    </script>

    <!-- Schema.org FAQPage -->
    <script type="application/ld+json">
      ${JSON.stringify(faqSchema)}
    </script>
  </head>
  <body style="margin: 0; background-color: #020617; color: #f8fafc; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;">
    <!-- Crawlable Pre-rendered Content for Search Bots -->
    <div id="root">
      <nav style="padding: 12px 16px; background-color: #0f172a; border-bottom: 1px solid #1e293b; font-size: 13px; color: #94a3b8;">
        <div style="max-width: 900px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <a href="/" style="color: #f59e0b; text-decoration: none; font-weight: bold;">← Back to All Yono Games</a>
            <span style="margin: 0 8px;">/</span>
            <span>${app.name} APK</span>
          </div>
          <span style="color: #10b981; font-weight: 600;">✔ Play Protect Verified</span>
        </div>
      </nav>

      <main style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
        <!-- App Overview Card -->
        <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
            <div style="width: 80px; height: 80px; background-color: #1e293b; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; border: 2px solid #f59e0b;">
              🎮
            </div>
            <div style="flex: 1; min-width: 250px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #f8fafc;">
                  ${app.name} APK Download (2026)
                </h1>
                ${app.badge ? `<span style="background: #10b981; color: #000; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px;">${app.badge}</span>` : ''}
              </div>
              <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 14px;">
                ${app.tagline || 'Official Android Game APK Download Portal'}
              </p>
              <div style="display: flex; gap: 16px; color: #cbd5e1; font-size: 13px; flex-wrap: wrap;">
                <span>⭐ <strong>${app.rating} / 5.0</strong></span>
                <span>📥 <strong>${app.downloads}</strong></span>
                <span>📦 <strong>${app.apkSize}</strong></span>
                <span>📱 <strong>Android 5.0+</strong></span>
              </div>
            </div>
          </div>

          <!-- Download Action Area -->
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #1e293b; display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
            <a href="${app.downloadUrl}" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: 900; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; display: inline-flex; align-items: center; gap: 8px;">
              ⚡ Download Official APK (${app.apkSize})
            </a>
            ${app.backupDownloadUrl ? `
            <a href="${app.backupDownloadUrl}" style="background: #1e293b; color: #f8fafc; font-weight: 700; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; border: 1px solid #334155;">
              Mirror Server 2
            </a>` : ''}
          </div>
        </div>

        <!-- Key Highlights Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; text-align: center;">
            <div style="font-size: 13px; color: #94a3b8; margin-bottom: 4px;">Sign-up Free Bonus</div>
            <div style="font-size: 22px; font-weight: 900; color: #10b981;">₹${app.signupBonus}${app.maxSignupBonus ? ` - ₹${app.maxSignupBonus}` : ''}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Instant Mobile Bind</div>
          </div>
          <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; text-align: center;">
            <div style="font-size: 13px; color: #94a3b8; margin-bottom: 4px;">Min Instant Cashout</div>
            <div style="font-size: 22px; font-weight: 900; color: #f59e0b;">₹${app.minWithdrawal}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">24/7 UPI & Bank Payout</div>
          </div>
          <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; text-align: center;">
            <div style="font-size: 13px; color: #94a3b8; margin-bottom: 4px;">Official Refer Code</div>
            <div style="font-size: 20px; font-weight: 900; color: #38bdf8; font-family: monospace;">${app.referCode}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Claim Extra VIP Cashback</div>
          </div>
          <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; text-align: center;">
            <div style="font-size: 13px; color: #94a3b8; margin-bottom: 4px;">Withdrawal Speed</div>
            <div style="font-size: 20px; font-weight: 900; color: #a855f7;">${app.withdrawalSpeed || '1 - 5 Mins'}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Direct IMPS / UPI</div>
          </div>
        </div>

        <!-- How to Download & Install -->
        <section style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #f59e0b;">
            How to Download & Install ${app.name} APK
          </h2>
          <ol style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.8;">
            <li>Click on the <strong>Download Official APK</strong> button above to download the latest ${app.name} installation file (${app.apkSize}).</li>
            <li>If your browser displays a security alert, tap <strong>Download Anyway</strong> or <strong>OK</strong>.</li>
            <li>Go to your phone's Settings &gt; Security &gt; enable <strong>Install from Unknown Sources</strong>.</li>
            <li>Tap on the downloaded APK file and click <strong>Install</strong>.</li>
            <li>Open ${app.name}, bind your Indian phone number via OTP, and enter referral code <code style="color: #f59e0b;">${app.referCode}</code> to receive your free ₹${app.signupBonus} bonus!</li>
          </ol>
        </section>

        <!-- FAQs Section -->
        <section style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #f59e0b;">
            Frequently Asked Questions (${app.name})
          </h2>
${faqsRenderHtml}
        </section>

        <!-- Internal Links to Other Games -->
        <section style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: #f8fafc;">
            Explore Other All New Yono Games 2026:
          </h2>
          <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.8;">
${otherAppsHtml}
          </ul>
        </section>
      </main>

      <footer style="border-top: 1px solid #1e293b; padding: 24px 16px; text-align: center; color: #64748b; font-size: 12px;">
        <p style="margin: 0 0 8px 0;">© 2026 All New Yono Apps Official Portal. All Rights Reserved.</p>
        <p style="margin: 0;">Disclaimer: These games involve financial risk and may be addictive. Please play responsibly. Strictly 18+.</p>
      </footer>
    </div>
    ${scriptTag}
  </body>
</html>`;
}

// 6. Generate Complete Sitemap XML with all 50 apps
function generateSitemapXml(): string {
  const urls: string[] = [];

  // Homepage
  urls.push(`  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TODAY_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // All Apps
  YONO_APPS.forEach(app => {
    const slug = app.slug || app.id;
    const isPinned = Boolean(app.pinToTop);
    const priority = isPinned ? '0.98' : (app.badge ? '0.95' : '0.90');
    urls.push(`  <!-- ${app.name} Official APK -->
  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <lastmod>${TODAY_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;
}

// 7. Homepage HTML Generator
function generateHomepageHtml(scriptTag: string, styleTags: string): string {
  return `<!doctype html>
<html lang="en-IN" class="dark" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>All New Yono Games 2026 - Instant Withdrawal Apps & APK Download (Official List)</title>
    <meta name="description" content="Download All New Yono Games 2026 List & top instant withdrawal apps: Jaiho 777, Hindi 777, Rummy 888, Share Slots, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & 50+ verified APKs with instant ₹5-₹777 free welcome bonuses & ₹100 instant UPI withdrawals." />
    <meta name="keywords" content="new yono games 2026, instant withdrawal apps, new yono games 2026 list, instant withdrawal rummy apps, all new yono games 2026, instant upi withdrawal game apps, new yono games 2026 download, fastest instant withdrawal rummy app, new yono app 2026, minimum withdrawal 100 rummy app instant withdrawal, new yono games launch today 2026, instant withdrawal cash games 2026, real money instant withdrawal apps, latest new yono games 2026 apk, new yono rummy games 2026, yono instant withdrawal app, jaiho 777 apk download, hindi 777, rummy 888, share slots, bet 213 apk, jaiho 91, club inr, max rummy, inr rummy, slots spin, yono arcade, yono rummy bonus" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="bingbot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="theme-color" content="#f59e0b" />
    <meta name="google-site-verification" content="PuYCOqnll6hKoInkrOAa3rbDy2J5Pt_T_ziySmBgcjA" />
    <meta name="google-site-verification" content="qrp2K5vYd82Cx3k1E2_0oUczGSXl3c9LcNhUjr686gY" />
    <link rel="canonical" href="${BASE_URL}/" id="dynamic-canonical" />
    <link rel="alternate" hreflang="en-IN" href="${BASE_URL}/" />
    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />
    <link rel="icon" type="image/svg+xml" href="/main-site-logo.svg" />
    <link rel="apple-touch-icon" href="/main-site-logo.svg" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${BASE_URL}/" />
    <meta property="og:title" content="All New Yono Games 2026 - Instant Withdrawal Apps & APK Download" />
    <meta property="og:description" content="Download All New Yono Games 2026 List & top instant withdrawal apps: Jaiho 777, Hindi 777, Rummy 888, Share Slots, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & 50+ verified APKs with instant ₹5-₹777 free welcome bonuses & ₹100 instant UPI withdrawals." />
    <meta property="og:image" content="${BASE_URL}/main-site-logo.svg" />
    <meta property="og:site_name" content="All New Yono Apps" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="All New Yono Games 2026 - Instant Withdrawal Apps & APK Download" />
    <meta name="twitter:description" content="Download All New Yono Games 2026 List & top instant withdrawal apps: Jaiho 777, Hindi 777, Rummy 888, Share Slots, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & 50+ verified APKs with instant ₹5-₹777 free welcome bonuses & ₹100 instant UPI withdrawals." />
    <meta name="twitter:image" content="${BASE_URL}/main-site-logo.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&family=Plus+Jakarta+Sans:wght@500;700&display=swap" />
    ${styleTags}

    <!-- Synchronous Canonical & Meta Handler for Headless Crawlers -->
    <script>
      (function() {
        try {
          var origin = window.location.origin || '${BASE_URL}';
          var search = window.location.search || '';
          var pathname = window.location.pathname || '';
          var params = new URLSearchParams(search);
          var appSlug = params.get('app') || params.get('game') || params.get('apk');

          if (!appSlug && pathname && pathname !== '/' && !pathname.includes('.')) {
            var cleanPath = pathname.replace(/^\\/+|\\/+$/g, '').replace(/^(app|game)\\//, '');
            if (cleanPath && cleanPath !== 'admin') {
              appSlug = cleanPath;
            }
          }

          if (appSlug) {
            var fullUrl = origin + '/?app=' + encodeURIComponent(appSlug);
            var canonicalEl = document.getElementById('dynamic-canonical');
            if (canonicalEl) {
              canonicalEl.setAttribute('href', fullUrl);
            }
            var ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) {
              ogUrl.setAttribute('content', fullUrl);
            }
          }
        } catch(e) {}
      })();
    </script>

    <!-- Schema.org WebSite -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "All New Yono Apps 2026",
        "url": "${BASE_URL}/",
        "description": "Download Verified All New Yono Games, Yono Games, Yono Rummy, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade APK 2026 with instant signup bonus & fast UPI payouts.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "${BASE_URL}/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    </script>

    <!-- Schema.org ItemList (Catalog of All 50 Games) -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "All New Yono Games Directory 2026",
        "description": "Complete list of 50 verified Yono games with APK download links, bonuses, and minimum withdrawal thresholds.",
        "numberOfItems": ${YONO_APPS.length},
        "itemListElement": ${JSON.stringify(itemListElements)}
      }
    </script>

    <!-- Schema.org FAQPage -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": ${JSON.stringify(faqElements)}
      }
    </script>
  </head>
  <body style="margin: 0; background-color: #020617; color: #f8fafc; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;">
    <!-- Pre-rendered crawlable HTML content for Googlebot & search engine spiders -->
    <div id="root">
      <header style="padding: 32px 16px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #0f172a 0%, #020617 100%);">
        <h1 style="font-size: 26px; font-weight: 900; color: #f59e0b; margin: 0 0 12px 0;">
          All New Yono Games 2026 - Instant Withdrawal Apps & APK Download (Official List)
        </h1>
        <p style="color: #94a3b8; max-width: 800px; margin: 0 auto; font-size: 15px; line-height: 1.6;">
          Official download portal for All New Yono Games 2026 list & verified instant withdrawal apps: Jaiho 777, Hindi 777, Rummy 888, Share Slots, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & 50+ verified APKs. Claim instant ₹5 to ₹777 welcome bonuses, fast ₹100 instant UPI withdrawals, and verified virus-free Android APKs.
        </p>
      </header>

      <main style="max-width: 1000px; margin: 0 auto; padding: 24px 16px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 16px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">
            Trending All New Yono Games List (2026)
          </h2>
          <ul style="list-style: none; padding: 0; margin: 0;">
${appsHtmlList}
          </ul>
        </section>

        <section style="margin-bottom: 40px; padding: 20px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; font-weight: 800; color: #f59e0b; margin-top: 0; margin-bottom: 16px;">
            Frequently Asked Questions (FAQs)
          </h2>
${faqsHtml}
        </section>
      </main>

      <footer style="border-top: 1px solid #1e293b; padding: 24px 16px; text-align: center; color: #64748b; font-size: 13px;">
        <p style="margin: 0 0 8px 0;">© 2026 All New Yono Apps Official Portal. All Rights Reserved.</p>
        <p style="margin: 0;">Disclaimer: These games involve financial risk and may be addictive. Please play responsibly. Strictly 18+.</p>
      </footer>
    </div>
    ${scriptTag}
  </body>
</html>`;
}

// 8. Execution Flow
async function main() {
  console.log(`Starting SSG Generation (mode: ${isDistMode ? 'DIST' : 'SOURCE'})...`);

  // Extract real assets from dist/index.html if in dist mode
  let distScriptTag = '<script type="module" src="/src/main.tsx"></script>';
  let distStyleTags = '';

  if (isDistMode) {
    const distIndexPath = path.resolve('dist/index.html');
    if (fs.existsSync(distIndexPath)) {
      const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
      const scriptMatch = distHtml.match(/<script\s+type="module"[^>]*src="([^"]*assets\/[^"]+)"[^>]*><\/script>/i);
      if (scriptMatch) {
        const srcPath = scriptMatch[1].replace(/^\.\//, '/');
        distScriptTag = `<script type="module" crossorigin src="${srcPath}"></script>`;
      }

      const headTags: string[] = [];
      const preloadMatches = distHtml.matchAll(/<link\s+rel="modulepreload"[^>]*href="([^"]*assets\/[^"]+)"[^>]*>/gi);
      for (const m of preloadMatches) {
        const hrefPath = m[1].replace(/^\.\//, '/');
        headTags.push(`<link rel="modulepreload" crossorigin href="${hrefPath}" />`);
      }

      const styleMatches = distHtml.matchAll(/<link\s+rel="stylesheet"[^>]*href="([^"]*assets\/[^"]+)"[^>]*>/gi);
      for (const m of styleMatches) {
        const hrefPath = m[1].replace(/^\.\//, '/');
        headTags.push(`<link rel="stylesheet" crossorigin href="${hrefPath}" />`);
      }

      if (headTags.length > 0) {
        distStyleTags = headTags.join('\n    ');
      }
    }
  }

  // 1) Update root index.html (when in source mode)
  if (!isDistMode) {
    const indexHtml = generateHomepageHtml('<script type="module" src="/src/main.tsx"></script>', '');
    fs.writeFileSync('./index.html', indexHtml, 'utf-8');
    console.log('✔ Updated ./index.html with fresh crawlable homepage data.');

    // Write updated sitemap.xml to public/sitemap.xml
    const sitemapContent = generateSitemapXml();
    fs.writeFileSync('./public/sitemap.xml', sitemapContent, 'utf-8');
    console.log(`✔ Generated ./public/sitemap.xml with ${YONO_APPS.length + 1} URLs.`);

    // Generate static app pages in public/app/[slug]/index.html and public/[slug]/index.html
    YONO_APPS.forEach(app => {
      const slug = app.slug || app.id;
      const appDir = path.resolve(`./public/app/${slug}`);
      if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
      }
      const rootSlugDir = path.resolve(`./public/${slug}`);
      if (!fs.existsSync(rootSlugDir)) {
        fs.mkdirSync(rootSlugDir, { recursive: true });
      }
      const appHtml = generateAppHtml(app, '<script type="module" src="/src/main.tsx"></script>', '');
      fs.writeFileSync(path.join(appDir, 'index.html'), appHtml, 'utf-8');
      fs.writeFileSync(path.join(rootSlugDir, 'index.html'), appHtml, 'utf-8');
    });
    console.log(`✔ Generated ${YONO_APPS.length} static app pages in ./public/app/ and ./public/[slug]/`);
  }

  // 2) When in --dist mode (runs AFTER vite build)
  if (isDistMode) {
    const distDir = path.resolve('dist');
    if (!fs.existsSync(distDir)) {
      console.error('dist directory does not exist! Run vite build first.');
      return;
    }

    // Write updated sitemap.xml to dist/sitemap.xml
    const sitemapContent = generateSitemapXml();
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');

    // Generate production pre-rendered pages for every single app
    let count = 0;
    YONO_APPS.forEach(app => {
      const slug = app.slug || app.id;
      const appDistDir = path.join(distDir, 'app', slug);
      if (!fs.existsSync(appDistDir)) {
        fs.mkdirSync(appDistDir, { recursive: true });
      }

      const appHtml = generateAppHtml(app, distScriptTag, distStyleTags);
      fs.writeFileSync(path.join(appDistDir, 'index.html'), appHtml, 'utf-8');

      // Also generate root path fallback: dist/[slug]/index.html
      const rootSlugDir = path.join(distDir, slug);
      if (!fs.existsSync(rootSlugDir)) {
        fs.mkdirSync(rootSlugDir, { recursive: true });
      }
      fs.writeFileSync(path.join(rootSlugDir, 'index.html'), appHtml, 'utf-8');

      count++;
    });

    console.log(`✔ Generated ${count} production static HTML files in dist/app/ and dist/[slug]/ with Vite assets!`);
  }

  console.log('SSG Build Complete!');
}

main().catch(err => {
  console.error('Error during SSG generation:', err);
  process.exit(1);
});

