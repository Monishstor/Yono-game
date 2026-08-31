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
  siteTitle = 'All New Yono Apps (2026) - APK Downloads & Real Cash Games' 
}) => {
  const isSingleAppPage = Boolean(activeApp);

  const currentTitle = isSingleAppPage && activeApp
    ? `${activeApp.name} APK Download (2026) - Free ₹${activeApp.signupBonus} Bonus & ₹${activeApp.minWithdrawal} UPI Withdrawal`
    : (siteSettings?.siteTitle || siteTitle);

  const currentDesc = isSingleAppPage && activeApp
    ? `Download official ${activeApp.name} APK for Android. Claim ₹${activeApp.signupBonus}${activeApp.maxSignupBonus ? ` to ₹${activeApp.maxSignupBonus}` : ''} Free Bonus with referral code "${activeApp.referCode}", 100% cashback, and fast ${activeApp.withdrawalSpeed || '1-3 min'} UPI cashouts.`
    : (siteSettings?.metaDescription || 'Download All New Yono Games & Apps 2026 list with ₹51 to ₹1500 sign-up bonus, ₹100 instant minimum UPI withdrawal, daily promo codes and safe verified APK files.');

  const currentKeywords = isSingleAppPage && activeApp
    ? `${activeApp.name} apk download, ${activeApp.name} official app, ${activeApp.name} refer code, ${activeApp.name} bonus ₹${activeApp.signupBonus}, ${activeApp.name} rummy apk, ${activeApp.name} withdrawal proof, all yono apps 2026`
    : (siteSettings?.metaKeywords || 'all yono apps, yono games apk download, all new yono app 2026, yono vip, yono rummy 500 bonus, yono slots 777, yono games list, yono referral code');

  const originUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://yono-game.vercel.app';

  const siteCanonical = siteSettings?.canonicalUrl && !siteSettings.canonicalUrl.includes('netlify') && !siteSettings.canonicalUrl.includes('allnewyonoapps')
    ? siteSettings.canonicalUrl
    : originUrl;

  const currentCanonical = isSingleAppPage && activeApp
    ? `${originUrl}/?app=${activeApp.slug || activeApp.id}`
    : siteCanonical;

  const currentAuthor = siteSettings?.siteAuthor || 'YONO Official Community';
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
      'url': originUrl,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${originUrl}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      'description': currentDesc,
      'author': {
        '@type': 'Organization',
        'name': currentAuthor,
        'url': originUrl
      }
    };

    // 7. FAQ Schema for Google Search Rich Accordions
    const gameSpecificFaqs = isSingleAppPage && activeApp ? [
      {
        q: `How to download and install ${activeApp.name} APK on Android?`,
        a: `Click the download button on this page to get the official ${activeApp.name} APK (${activeApp.apkSize}). Allow unknown sources in Android settings and complete installation within seconds.`
      },
      {
        q: `What is the sign-up bonus and referral code for ${activeApp.name}?`,
        a: `New players receive an instant ₹${activeApp.signupBonus}${activeApp.maxSignupBonus ? ` to ₹${activeApp.maxSignupBonus}` : ''} Free Bonus with referral code "${activeApp.referCode}" on OTP verification.`
      },
      {
        q: `What is the minimum withdrawal in ${activeApp.name}?`,
        a: `Minimum withdrawal is only ₹${activeApp.minWithdrawal} with instant 24/7 UPI & Bank cashout in ${activeApp.withdrawalSpeed || '1-3 minutes'}.`
      },
      {
        q: `Is ${activeApp.name} APK 100% safe and virus free?`,
        a: `Yes, all files on this page are verified against Play Protect standards with a 100% safety score.`
      }
    ] : FAQ_DATA.map(f => ({ q: f.question, a: f.answer }));

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': gameSpecificFaqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a
        }
      }))
    };

    // 8. SoftwareApplication Schema for 5-Star Ratings & Rich Snippet Downloads
    let softwareAppSchema: any;

    if (isSingleAppPage && activeApp) {
      // Single Dedicated App Schema
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
        'downloadUrl': (activeApp.downloadUrl && !activeApp.downloadUrl.startsWith('#')) ? activeApp.downloadUrl : `${originUrl}/?app=${activeApp.slug || activeApp.id}`
      };
    } else {
      // Portal-wide Top Apps ItemList Schema
      softwareAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Top All Yono Games APK Download List (2026)',
        'description': 'Verified collection of top rated Yono apps with real-cash bonuses and instant UPI withdrawals',
        'itemListElement': (apps.length > 0 ? apps : []).map((app, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'item': {
            '@type': 'SoftwareApplication',
            'name': `${app.name} APK`,
            'url': `${originUrl}/?app=${app.slug || app.id}`,
            'operatingSystem': 'Android 5.0+',
            'applicationCategory': 'GameApplication',
            'fileSize': app.apkSize || '45MB',
            'softwareVersion': app.version || '2026.8',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'INR'
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': app.rating ? app.rating.toString() : '4.9',
              'bestRating': '5',
              'worstRating': '1',
              'ratingCount': app.reviewsCount ? app.reviewsCount.toString() : '24800'
            },
            'description': `Download ${app.name} APK. Claim sign-up bonus with ₹100 instant minimum UPI withdrawal.`
          }
        }))
      };
    }

    // 9. BreadcrumbList Schema for Google Search Path Navigation
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': isSingleAppPage && activeApp ? [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': originUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'All Yono Games',
          'item': `${originUrl}/#all-apps-section`
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
          'item': originUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'All Yono Games APK List',
          'item': `${originUrl}/#all-apps-section`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Bonus & UPI Withdrawals',
          'item': `${originUrl}/#bonus-table-section`
        }
      ]
    };

    // Inject all structured data into document head
    const schemas = [
      { id: 'seo-schema-website', data: websiteSchema },
      { id: 'seo-schema-faq', data: faqSchema },
      { id: 'seo-schema-software', data: softwareAppSchema },
      { id: 'seo-schema-breadcrumbs', data: breadcrumbSchema }
    ];

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
        const scriptTag = document.getElementById(id);
        if (scriptTag) {
          scriptTag.remove();
        }
      });
    };
  }, [apps, activeApp, isSingleAppPage, currentTitle, currentDesc, currentKeywords, currentCanonical, currentAuthor, googleVerification, currentOgImage, originUrl, siteSettings]);

  return null;
};

