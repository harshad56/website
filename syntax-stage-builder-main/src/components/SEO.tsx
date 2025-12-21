import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  url?: string;
  structuredData?: object;
}

const SEO = ({
  title = 'CodeAcademy Pro - Learn Programming Online',
  description = 'Master programming with interactive courses, real-world projects, and AI-powered tutoring. Learn Python, JavaScript, Java, C++, and 20+ languages.',
  keywords = 'programming, coding, learn to code, programming courses, Python, JavaScript, Java, web development, software engineering',
  image = '/favicon.ico',
  type = 'website',
  url,
  structuredData,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const fullTitle = title.includes('CodeAcademy Pro') ? title : `${title} | CodeAcademy Pro`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'CodeAcademy Pro');

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:site_name', 'CodeAcademy Pro', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Add structured data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [fullTitle, description, keywords, image, type, currentUrl, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;


