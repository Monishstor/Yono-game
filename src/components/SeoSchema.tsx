import React, { useEffect } from 'react';
import { YonoApp, SiteSettings } from '../types';

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
  siteTitle = 'Yono Games Catalogue | App Information and Download Links'
}) => {
  const isSingleAppPage = Boolean(activeApp);

  const currentTitle = isSingleAppPage && activeApp
    ? `${activeApp.name} | App information and download link`
    : (siteSettings?.siteTitle || siteTitle);

  const currentDesc = isSingleAppPage && activeApp
    ? `View ${activeApp.name} app information, download options, installation guidance, and responsible-play information.`
    : (siteSettings?.metaDescription || 'Browse the Yono Games catalogue for app information, download links, installation guidance, and responsible-play information.');

  const currentKeywords = isSingleAppPage && activeApp
    ? `${activeApp.name}, app information, download link, installation guide`
    : (siteSettings?.metaKeywords || 'Yono Games, app catalogue, app information, installation guide');

  const originUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://yono-game.vercel.app';

  const siteCanonical = (siteSettings?.canonicalUrl && !siteSettings.canonicalUrl.includes('netlify') && !siteSettings.canonicalUrl.includes('allnewyonoapps')
    ? siteSettings.canonicalUrl
    : originUrl).replace(/\/+$/, '');

  // This is a client-rendered catalogue. Query-string views are not standalone
  // server-rendered documents, so they must consolidate indexing signals here.
  const currentCanonical = siteCanonical;

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

    // This app is rendered as one catalogue document. Keep structured data limited
    // to facts represented by the canonical HTML, rather than generating rich-result
    // claims for query-string views.

    // Inject the single canonical structured-data entity.
    const schemas: Array<{ id: string; data: unknown }> = [
      { id: 'seo-schema-website', data: websiteSchema }
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
  }, [apps, activeApp, isSingleAppPage, currentTitle, currentDesc, currentKeywords, currentCanonical, currentAuthor, googleVerification, currentOgImage, originUrl, siteCanonical, siteSettings]);

  return null;
};
