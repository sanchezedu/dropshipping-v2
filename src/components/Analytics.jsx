import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    const GA_ID = 'G-EEM69X2GRB';
    
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Initialize GA4
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);

    // Track page views on route change
    const handleRouteChange = () => {
      if (window.gtag) {
        gtag('event', 'page_view', {
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
      }
    };

    // Listen for navigation
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      handleRouteChange();
    };

    return () => {
      // Cleanup
      try {
        document.head.removeChild(script);
      } catch (e) {}
    };
  }, []);

  return null;
}
