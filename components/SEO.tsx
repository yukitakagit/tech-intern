
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming standard routing, but we are using state routing in App.tsx, so we use props.

interface SEOProps {
  title: string;
  description?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = '未経験からエンジニアを目指す学生のための長期インターンシップ求人サイト。リモートワーク、実務経験が積める案件多数掲載。', 
  ogType = 'website',
  ogImage = 'https://picsum.photos/id/1/1200/630', // Default placeholder
  jsonLd 
}) => {
  const siteTitle = 'Tech intern | エンジニアインターンシップ';
  const fullTitle = title === 'Tech intern' ? siteTitle : `${title} | Tech intern`;
  const currentUrl = window.location.href;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // 2. Update Meta Tags
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setOgMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    
    // OGP
    setOgMeta('og:title', fullTitle);
    setOgMeta('og:description', description);
    setOgMeta('og:type', ogType);
    setOgMeta('og:url', currentUrl);
    setOgMeta('og:image', ogImage);
    setOgMeta('og:site_name', 'Tech intern');
    
    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [fullTitle, description, ogType, ogImage, currentUrl]);

  // 3. Update JSON-LD
  useEffect(() => {
    if (!jsonLd) return;

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      // Cleanup isn't strictly necessary for a SPA as we overwrite, 
      // but good practice if we were unmounting entirely.
    };
  }, [jsonLd]);

  return null;
};
