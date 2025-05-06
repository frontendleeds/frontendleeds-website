'use client';

import { useEffect } from 'react';

const LinkedInInsightTag = () => {
  useEffect(() => {
    const partnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID

    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
    
      _linkedin_partner_id = "${partnerId}";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push("${partnerId}");
    `;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    script2.async = true;
    document.head.appendChild(script2);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none;" alt=""
        src="https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif" />
    `;
    document.body.appendChild(noscript);

    return () => {
   
    };
  }, []);

  return null; 
};

export default LinkedInInsightTag;
