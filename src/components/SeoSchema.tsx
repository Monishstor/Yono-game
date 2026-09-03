import React, { useEffect } from 'react';
import { YonoApp, SiteSettings } from '../types';
import { FAQ_DATA } from '../data/faqData';

interface SeoSchemaProps {
  apps: YonoApp[];
  activeApp?: YonoApp | null;
  siteSettings?: SiteSettings;
  siteTitle?: string;
}

export const SeoSchema: React.FC<SeoSchemaProps> = ({
  apps,
  activeApp,
  siteSettings,
  siteTitle = 'All New Yono Games 2026 - Instant Withdrawal Apps & APK Download (Official List)'
}) => {
  const isSingleAppPage = Boolean(activeApp);

  const currentTitle = isSingleAppPage && activeApp
    ? `${activeApp.name} APK Download (2026) - New Yono Games 2026 & Instant Withdrawal App (₹${activeApp.minWithdrawal} UPI)`
    : (siteSettings?.siteTitle || siteTitle);

  const currentDesc = isSingleAppPage && activeApp
    ? `Download official ${activeApp.name} APK for Android. Verified New Yono Games 2026 instant withdrawal app with ${activeApp.withdrawalSpeed || '1-3 min'} ₹${activeApp.minWithdrawal} UPI cashout, ₹${activeApp.signupBonus}${activeApp.maxSignupBonus ? ` to ₹${activeApp.maxSignupBonus}` : ''} Free Bonus with referral code "${activeApp.referCode}".`
    : (siteSettings?.metaDescription || 'Download All New Yono Games 2026 list & verified instant withdrawal apps with free ₹51 to ₹1500 sign-up bonus, instant ₹100 minimum UPI withdrawals, daily promo codes and official verified APK files.');

  const currentKeywords = isSingleAppPage && activeApp
    ? `${activeApp.name} apk download, new yono games 2026, instant withdrawal apps, ${activeApp.name} instant withdrawal, ${activeApp.name} official app, ${activeApp.name} refer code, ${activeApp.name} bonus ₹${activeApp.signupBonus}, ${activeApp.name} rummy apk, instant upi withdrawal rummy app, all yono apps 2026`
    : (siteSettings?.metaKeywords || 'new yono games 2026, instant withdrawal apps, new yono games 2026 list, instant withdrawal rummy apps, all new yono games 2026, instant upi withdrawal game apps, new yono games 2026 download, fastest instant withdrawal rummy app, new yono app 2026, minimum withdrawal 100 rummy app instant withdrawal, new yono games launch today 2026, instant withdrawal cash games 2026, real money instant withdrawal apps, latest new yono games 2026 apk, new yono rummy games 2026, yono instant withdrawal app, all yono apps');

  const originUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://yono-game.vercel.app';

  const siteCanonical = (siteSettings?.canonicalUrl && !siteSettings.canonicalUrl.includes('netlify') && !siteSettings.canonicalUrl.includes('allnewyonoapps')
    ? siteSettings.canonicalUrl
    : originUrl).replace(/\/+$/, '');

  // Exact canonical URL matching sitemap.xml entries (clean /slug path)
  const currentCanonical = isSingleAppPage && activeApp
    ? `${siteCanonical}/${encodeURIComponent(activeApp.slug || activeApp.id)}`
    : siteCanonical;

  const currentAuthor = siteSettings?.siteAuthor || 'All New Yono Apps Official Portal';
  const googleVerification = siteSettings?.googleSiteVerification;
  const currentOgImage = (isSingleAppPage && activeApp && activeApp.imageUrl)
    ? (activeApp.imageUrl.startsWith('http') ? activeApp.imageUrl : `${originUrl}${activeApp.imageUrl}`)
    : `${originUrl}/main-site-logo.svg`;

  useEffect(() => {
    // 1. Dynamic Document Title
    if (currentTitle) {
      document.title = currentTitle;
    }

    // Helper to update or create a meta tag by name or property
    const updateMetaTag = (attrName: 'name' | 'property', attrValue: string, contentValue: string | undefined) => {
      if (!contentValue) return;
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', contentValue);
    };

    // 2. Dynamic Primary Meta Tags
    updateMetaTag('name', 'description', currentDesc);
    updateMetaTag('name', 'keywords', currentKeywords);
    updateMetaTag('name', 'author', currentAuthor);
    updateMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('name', 'bingbot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('name', 'theme-color', '#f59e0b');

    // Google Search Console Verification Tag
    if (googleVerification) {
      updateMetaTag('name', 'google-site-verification', googleVerification);
    }

    // 3. Dynamic OpenGraph / Facebook / WhatsApp Meta Tags
    updateMetaTag('property', 'og:type', isSingleAppPage ? 'product' : 'website');
    updateMetaTag('property', 'og:title', currentTitle);
    updateMetaTag('property', 'og:description', currentDesc);
    updateMetaTag('property', 'og:url', currentCanonical);
    updateMetaTag('property', 'og:site_name', siteSettings?.siteTitle || 'All New Yono Apps');
    updateMetaTag('property', 'og:image', currentOgImage);

    // 4. Dynamic Twitter Card Meta Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', currentTitle);
    updateMetaTag('name', 'twitter:description', currentDesc);
    updateMetaTag('name', 'twitter:image', currentOgImage);

    // 5. Canonical Link Tag
    if (currentCanonical) {
      let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', currentCanonical);
    }

    // 6. Website & Organization Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': siteSettings?.siteTitle || 'All New Yono Apps',
      'url': siteCanonical,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${siteCanonical}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      'description': currentDesc,
      'author': {
        '@type': 'Organization',
        'name': currentAuthor,
        'url': siteCanonical
      }
    };

    // 7. SoftwareApplication Schema
    let softwareAppSchema: any;
    if (isSingleAppPage && activeApp) {
      softwareAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': `${activeApp.name} APK`,
        'operatingSystem': 'Android 5.0+',
        'applicationCategory': 'GameApplication',
        'fileSize': activeApp.apkSize || '45MB',
        'softwareVersion': activeApp.version || '2026.8',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'INR'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': activeApp.rating ? activeApp.rating.toString() : '4.9',
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': activeApp.reviewsCount ? activeApp.reviewsCount.toString() : '28500'
        },
        'description': `Download official ${activeApp.name} APK. Claim ₹${activeApp.signupBonus} free sign-up bonus with ₹${activeApp.minWithdrawal} instant minimum UPI withdrawal.`,
        'downloadUrl': (activeApp.downloadUrl && !activeApp.downloadUrl.startsWith('#')) ? activeApp.downloadUrl : `${siteCanonical}/${activeApp.slug || activeApp.id}`
      };
    }

    // 8. Catalog ItemList Schema
    const appListSchema = !isSingleAppPage ? {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Top All Yono Games APK Download List (2026)',
      'numberOfItems': apps.length,
      'itemListElement': apps.map((app, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': `${app.name} APK`,
        'url': `${siteCanonical}/${encodeURIComponent(app.slug || app.id)}`
      }))
    } : null;

    // 9. FAQ Schema
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': FAQ_DATA.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    // 10. Breadcrumbs Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': isSingleAppPage && activeApp ? [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': siteCanonical
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'All Yono Games',
          'item': `${siteCanonical}/#all-apps-section`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': `${activeApp.name} APK Download`,
          'item': currentCanonical
        }
      ] : [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': siteCanonical
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'All Yono Games APK List',
          'item': `${siteCanonical}/#all-apps-section`
        }
      ]
    };

    // Inject all structured data into document head
    const schemas: Array<{ id: string; data: unknown }> = [
      { id: 'seo-schema-website', data: websiteSchema },
      { id: 'seo-schema-faq', data: faqSchema },
      { id: 'seo-schema-breadcrumbs', data: breadcrumbSchema }
    ];

    if (softwareAppSchema) {
      schemas.push({ id: 'seo-schema-software', data: softwareAppSchema });
    }
    if (appListSchema) {
      schemas.push({ id: 'seo-schema-app-list', data: appListSchema });
    }

    schemas.forEach(({ id, data }) => {
      let scriptTag = document.getElementById(id) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = id;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(data);
    });

    return () => {
      schemas.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          el.remove();
        }
      });
    };
  }, [apps, activeApp, isSingleAppPage, currentTitle, currentDesc, currentKeywords, currentCanonical, currentAuthor, googleVerification, currentOgImage, originUrl, siteCanonical, siteSettings]);

  return null;
};
