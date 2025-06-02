import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  image,
  url,
  type = 'website'
}) => {
  const siteTitle = 'Bharti FreeLimbs';
  const defaultDescription = 'Providing prosthetic limbs and support services to those in need. Find food stalls, medical clinics, and more.';
  const defaultImage = '/logo.png'; // Add your default social image path
  const siteUrl = 'https://bharti-free-limb.vercel.app'; // Update with your site URL

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={[...keywords, 'prosthetic limbs', 'medical support', 'free food', 'medical clinics'].join(', ')} />

      {/* Open Graph meta tags for social sharing */}
      <meta property="og:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || `${siteUrl}${defaultImage}`} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || `${siteUrl}${defaultImage}`} />

      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <link rel="canonical" href={url || siteUrl} />

      {/* Structured Data for Google Rich Results */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteTitle,
          "description": defaultDescription,
          "url": siteUrl,
          "logo": `${siteUrl}${defaultImage}`,
          "sameAs": [
            // Add your social media URLs here
            // "https://facebook.com/BhartiFreeLimbs",
            // "https://twitter.com/BhartiFreeLimbs",
            // "https://instagram.com/BhartiFreeLimbs"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 