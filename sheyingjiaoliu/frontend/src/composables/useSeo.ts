export interface SEOMeta {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
}

export const useSEO = () => {
  const updateMeta = (meta: SEOMeta) => {
    if (typeof document === 'undefined') return;

    const { title, description, keywords, ogImage, ogType, twitterCard } = meta;

    // Update title
    document.title = title ? `${title} - 摄影分享平台` : '摄影分享平台';

    // Update meta tags
    const metaTags = {
      'description': description,
      'keywords': keywords || '摄影,照片分享,摄影社区,器材,课程',
      'author': '摄影分享平台',
      'robots': 'index, follow',
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      let metaEl = document.querySelector(`meta[name="${name}"]`);
      if (!metaEl) {
        metaEl = document.createElement('meta');
        metaEl.setAttribute('name', name);
        document.head.appendChild(metaEl);
      }
      metaEl.setAttribute('content', content);
    });

    // Update Open Graph tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:image': ogImage || '/icons/og-image.png',
      'og:type': ogType || 'website',
      'og:url': window.location.href,
      'og:site_name': '摄影分享平台',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let ogEl = document.querySelector(`meta[property="${property}"]`);
      if (!ogEl) {
        ogEl = document.createElement('meta');
        ogEl.setAttribute('property', property);
        document.head.appendChild(ogEl);
      }
      ogEl.setAttribute('content', content);
    });

    // Update Twitter Card tags
    if (twitterCard) {
      let twitterEl = document.querySelector('meta[name="twitter:card"]');
      if (!twitterEl) {
        twitterEl = document.createElement('meta');
        twitterEl.setAttribute('name', 'twitter:card');
        document.head.appendChild(twitterEl);
      }
      twitterEl.setAttribute('content', twitterCard);

      let twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
      if (!twitterTitleEl) {
        twitterTitleEl = document.createElement('meta');
        twitterTitleEl.setAttribute('name', 'twitter:title');
        document.head.appendChild(twitterTitleEl);
      }
      twitterTitleEl.setAttribute('content', title);

      let twitterDescEl = document.querySelector('meta[name="twitter:description"]');
      if (!twitterDescEl) {
        twitterDescEl = document.createElement('meta');
        twitterDescEl.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDescEl);
      }
      twitterDescEl.setAttribute('content', description);

      let twitterImageEl = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImageEl) {
        twitterImageEl = document.createElement('meta');
        twitterImageEl.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImageEl);
      }
      twitterImageEl.setAttribute('content', ogImage || '/icons/og-image.png');
    }

    // Add structured data
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: '摄影分享平台',
      url: 'https://photoshare.example.com',
      description: description,
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://photoshare.example.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(schema);
    document.head.appendChild(schemaScript);
  };

  const getCanonicalUrl = (): string => {
    if (typeof window === 'undefined') return '';
    return window.location.href.split('?')[0];
  };

  const addCanonicalTag = () => {
    if (typeof document === 'undefined') return;

    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = getCanonicalUrl();
    document.head.appendChild(canonical);
  };

  return {
    updateMeta,
    getCanonicalUrl,
    addCanonicalTag,
  };
};
