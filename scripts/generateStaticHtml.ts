import fs from 'fs';
import { YONO_APPS } from '../src/data/appsData';
import { FAQ_DATA } from '../src/data/faqData';

const BASE_URL = 'https://yono-game.vercel.app';

// 1. Build ItemList schema for all 46 apps
const itemListElements = YONO_APPS.map((app, index) => ({
  '@type': 'ListItem',
  position: index + 1,
  name: `${app.name} APK`,
  url: `${BASE_URL}/?app=${encodeURIComponent(app.slug || app.id)}`
}));

// 2. Build FAQ schema
const faqElements = FAQ_DATA.map((faq) => ({
  '@type': 'Question',
  name: faq.question,
  acceptedAnswer: {
    '@type': 'Answer',
    text: faq.answer
  }
}));

// 3. Build semantic HTML for #root
const appsHtmlList = YONO_APPS.map((app, idx) => {
  const slug = app.slug || app.id;
  const appUrl = `/?app=${encodeURIComponent(slug)}`;
  return `        <li style="margin-bottom: 16px; padding: 12px; border: 1px solid #334155; border-radius: 8px; background-color: #0f172a;">
          <h3 style="margin: 0 0 6px 0; font-size: 16px;">
            <a href="${appUrl}" style="color: #f59e0b; font-weight: bold; text-decoration: underline;">
              #${idx + 1} ${app.name} APK Download
            </a>
            ${app.badge ? `<span style="font-size: 12px; color: #10b981; margin-left: 8px;">[${app.badge}]</span>` : ''}
          </h3>
          <p style="margin: 0 0 6px 0; color: #cbd5e1; font-size: 14px;">
            <strong>Sign-up Bonus:</strong> ₹${app.signupBonus}${app.maxSignupBonus ? ` - ₹${app.maxSignupBonus}` : ''} Free | 
            <strong>Min Withdrawal:</strong> ₹${app.minWithdrawal} Instant UPI | 
            <strong>Rating:</strong> ${app.rating}⭐ (${app.downloads} downloads) | 
            <strong>Refer Code:</strong> <code style="color: #f59e0b;">${app.referCode}</code>
          </p>
          <p style="margin: 0; color: #94a3b8; font-size: 13px;">
            ${app.tagline || `Play verified card and slot games with fast payouts on ${app.name}.`}
          </p>
        </li>`;
}).join('\n');

const faqsHtml = FAQ_DATA.map((faq) => `        <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #1e293b; border-radius: 8px;">
          <h3 style="margin: 0 0 6px 0; color: #f8fafc; font-size: 15px;">${faq.question}</h3>
          <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">${faq.answer}</p>
        </div>`).join('\n');

const htmlContent = `<!doctype html>
<html lang="en-IN" class="dark" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>All New Yono Games (2026 List) - Download New Yono App & Games APK</title>
    <meta name="description" content="Download All New Yono Games 2026 List: Jaiho 777, Hindi 777, Rummy 888, Share Slots, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & all verified APKs with instant ₹5-₹777 free welcome bonuses & ₹100 instant UPI withdrawals." />
    <meta name="keywords" content="jaiho 777 apk download, jaiho 777, jaiho777 apk, hindi 777 apk download, hindi777 apk, hindi 777 yono, rummy 888 apk download, rummy888 vip apk, share slots apk download, all new yono games, new yono app launch today, yono all games list 2026, bet 213 apk, jaiho 91, club inr, max rummy, inr rummy, slots spin, yono arcade, yono rummy bonus, yono games download" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="bingbot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="theme-color" content="#f59e0b" />
    <meta name="google-site-verification" content="PuYCOqnll6hKoInkrOAa3rbDy2J5Pt_T_ziySmBgcjA" />
    <meta name="google-site-verification" content="qrp2K5vYd82Cx3k1E2_0oUczGSXl3c9LcNhUjr686gY" />
    <link rel="canonical" href="https://yono-game.vercel.app/" id="dynamic-canonical" />
    <link rel="alternate" hreflang="en-IN" href="https://yono-game.vercel.app/" />
    <link rel="alternate" hreflang="x-default" href="https://yono-game.vercel.app/" />
    <link rel="icon" type="image/svg+xml" href="/main-site-logo.svg" />
    <link rel="apple-touch-icon" href="/main-site-logo.svg" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="https://yono-game.vercel.app/" />
    <meta property="og:title" content="All New Yono Games & APK Downloads 2026 (Jaiho 777, Hindi 777, Rummy 888, Share Slots)" />
    <meta property="og:description" content="Download All New Yono Games 2026 List: Jaiho 777, Hindi 777, Rummy 888, Share Slots, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & all verified APKs with instant bonuses." />
    <meta property="og:image" content="https://yono-game.vercel.app/main-site-logo.svg" />
    <meta property="og:site_name" content="All New Yono Apps" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="All New Yono Games 2026 List - Download New Yono App & APKs" />
    <meta name="twitter:description" content="Download All New Yono Games 2026 List: Jaiho 777, Hindi 777, Rummy 888, Share Slots, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & verified APKs." />
    <meta name="twitter:image" content="https://yono-game.vercel.app/main-site-logo.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&family=Plus+Jakarta+Sans:wght@500;700&display=swap" />

    <!-- Synchronous Canonical & Meta Handler for Headless Crawlers -->
    <script>
      (function() {
        try {
          var origin = window.location.origin || 'https://yono-game.vercel.app';
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
        "url": "https://yono-game.vercel.app/",
        "description": "Download Verified All New Yono Games, BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade APK 2026 with instant signup bonus & fast UPI payouts.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://yono-game.vercel.app/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    </script>

    <!-- Schema.org ItemList (Catalog of All 46 Games) -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "All New Yono Games Directory 2026",
        "description": "Complete list of 46 verified Yono games with APK download links, bonuses, and minimum withdrawal thresholds.",
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
          All New Yono Games (2026 List) - Download New Yono App & APKs
        </h1>
        <p style="color: #94a3b8; max-width: 800px; margin: 0 auto; font-size: 15px; line-height: 1.6;">
          Official download portal for All New Yono Games 2026 list: BET 213, Jaiho 91, Club INR, Max Rummy, INR Rummy, Slots Spin, Yono Arcade & 40+ verified APKs. Claim instant ₹5 to ₹777 welcome bonuses, ₹100 fast UPI withdrawals, and verified virus-free Android downloads.
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
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

fs.writeFileSync('./index.html', htmlContent, 'utf-8');
console.log('Successfully updated index.html with pre-rendered crawlable HTML!');
