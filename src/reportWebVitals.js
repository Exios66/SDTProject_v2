const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Cumulative Layout Shift (CLS)
      getCLS(onPerfEntry, { reportAllChanges: true });

      // First Input Delay (FID)
      getFID(onPerfEntry, { reportAllChanges: true });

      // First Contentful Paint (FCP)
      getFCP(onPerfEntry, { reportAllChanges: true });

      // Largest Contentful Paint (LCP)
      getLCP(onPerfEntry, { reportAllChanges: true });

      // Time to First Byte (TTFB)
      getTTFB(onPerfEntry);

      // Log a message when all metrics have been reported
      console.log('Web Vitals metrics reported successfully');

      // You can add custom logic here, such as sending the metrics to an analytics service
      // Example: sendToAnalytics({ CLS, FID, FCP, LCP, TTFB });
    }).catch(error => {
      console.error('Failed to load web-vitals:', error);
    });

    // Optionally, you can add more performance measurements here
    // For example, measuring the total load time of the application
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Total load time: ${loadTime.toFixed(2)}ms`);
      if (onPerfEntry instanceof Function) {
        onPerfEntry({ name: 'loadTime', value: loadTime });
      }
    });
  }
};

export default reportWebVitals;