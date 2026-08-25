import React, { useEffect } from 'react';
import { YonoApp, SiteSettings } from '../types';
import { FAQ_DATA } from '../data/faqData';

interface SeoSchemaProps {
  apps: YonoApp[];
  siteSettings?: SiteSettings;
  siteTitle?: string;
}

export const SeoSchema: React.FC<SeoSchemaProps> = ({ 
  apps, 
  siteSettings,
  siteTitle = 'All New Yono Apps (2026) - APK Downloads & Real Cash Games' 
}) => {
  const currentTitle = siteSettings?.siteTitle || siteTitle;
  const currentDesc = siteSettings?.siteDescription || 'Download All New Yono Games & Apps 2026 list with ₹51 to ₹1500 sign-up bonus, ₹100 instant minimum UPI withdrawal, daily promo codes and safe verified APK files.';
  const currentKeywords = siteSettings?.metaKeywords || 'all yono apps, yono games apk download, all new yono app 2026, yono vip, yono rummy 500 bonus, yono slots 777, yono games list, yono referral code';
  const currentCanonical = siteSettings?.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://allnewyonoapps.com');
  const currentAuthor = siteSettings?.authorName || 'YONO Official Community';
  const googleVerification = siteSettings?.googleVerificationCode;
  const currentOgImage = siteSettings?.ogImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80';

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
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:title', currentTitle);
    updateMetaTag('property', 'og:description', currentDesc);
    updateMetaTag('property', 'og:url', currentCanonical);
    updateMetaTag('property', 'og:site_name', currentTitle);
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
      'name': currentTitle,
      'url': currentCanonical,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${currentCanonical}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      'description': currentDesc,
      'author': {
        '@type': 'Organization',
        'name': currentAuthor,
        'url': currentCanonical
      }
    };

    // 7. FAQ Schema for Google Search Rich Accordions
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

    // 8. SoftwareApplication / ItemList Schema for Google Star Ratings & Downloads
    const softwareAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Top All Yono Games APK Download List (2026)',
      'description': 'Verified collection of top rated Yono apps with real-cash bonuses and instant UPI withdrawals',
      'itemListElement': (apps.length > 0 ? apps : [
        {
          id: 'yono-777-default',
          name: 'Yono 777 Official',
          tagline: '₹500 Bonus',
          rating: 4.9,
          downloads: '1.2M+',
          apkSize: '48 MB',
          downloadUrl: '#'
        }
      ]).slice(0, 10).map((app, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'item': {
          '@type': 'SoftwareApplication',
          'name': app.name,
          'operatingSystem': 'Android 5.0+',
          'applicationCategory': 'GameApplication',
          'fileSize': 'apkSize' in app && app.apkSize ? app.apkSize : '45MB',
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
            'ratingCount': '24800'
          },
          'description': `Download ${app.name} APK. Claim sign-up bonus with ₹100 instant minimum UPI withdrawal.`
        }
      }))
    };

    // 9. BreadcrumbList Schema for clean Google search path
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': currentCanonical
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'All Yono Games APK List',
          'item': `${currentCanonical}/#all-apps-section`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Bonus & UPI Withdrawals',
          'item': `${currentCanonical}/#bonus-table-section`
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
  }, [apps, currentTitle, currentDesc, currentKeywords, currentCanonical, currentAuthor, googleVerification, currentOgImage]);

  return null;
};
