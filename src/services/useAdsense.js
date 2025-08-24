import { useEffect } from 'react';

const useAdSense = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5347154821972845';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
};

export default useAdSense;