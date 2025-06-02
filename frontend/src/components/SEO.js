import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  image,
  url,
  type = 'website',
  publishedAt,
  modifiedAt,
  author = 'Bharti FreeLimbs'
}) => {
  const siteTitle = 'Bharti FreeLimbs';
  const defaultDescription = 'Providing free prosthetic limbs and comprehensive support services including food, medical care, and shelter. Find prosthetic centers, food stalls, medical clinics near you.';
  const defaultImage = '/logo.png';
  const siteUrl = 'https://www.bharti-freelimbs.com';
  const organizationLogo = `${siteUrl}/logo.png`;
  const defaultKeywords = [
    'prosthetic limbs',
    'free prosthetics',
    'medical support',
    'free food',
    'medical clinics',
    'disability support',
    'healthcare services',
    'prosthetic centers in India',
    'free medical care',
    'disability assistance',
    'prosthetic limb donation',
    'medical aid',
    'free healthcare',
    'prosthetic services',
    'disability healthcare'
  ];

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={[...defaultKeywords, ...keywords].join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Open Graph meta tags for social sharing */}
      <meta property="og:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || `${siteUrl}${defaultImage}`} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || `${siteUrl}${defaultImage}`} />
      <meta name="twitter:site" content="@BhartiFreeLimbs" />

      {/* Additional SEO meta tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 day" />
      <meta name="generator" content="React" />
      <link rel="canonical" href={url || siteUrl} />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Structured Data for Google Rich Results */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          "name": siteTitle,
          "description": defaultDescription,
          "url": siteUrl,
          "logo": organizationLogo,
          "sameAs": [
            "https://facebook.com/BhartiFreeLimbs",
            "https://twitter.com/BhartiFreeLimbs",
            "https://instagram.com/BhartiFreeLimbs"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN",
            "addressRegion": "India"
          },
          "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": "+91-XXXXXXXXXX",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          }],
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "foundingDate": "2024",
          "keywords": defaultKeywords.join(", ")
        })}
      </script>

      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": image || `${siteUrl}${defaultImage}`,
            "author": {
              "@type": "Organization",
              "name": author
            },
            "publisher": {
              "@type": "Organization",
              "name": siteTitle,
              "logo": {
                "@type": "ImageObject",
                "url": organizationLogo
              }
            },
            "datePublished": publishedAt || new Date().toISOString(),
            "dateModified": modifiedAt || new Date().toISOString()
          })}
        </script>
      )}

      {/* Breadcrumb structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          title && {
            "@type": "ListItem",
            "position": 2,
            "name": title,
            "item": url || siteUrl
          }].filter(Boolean)
        })}
      </script>

      {/* Medical Organization structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": siteTitle,
          "url": siteUrl,
          "logo": organizationLogo,
          "medicalSpecialty": "Prosthetics",
          "description": defaultDescription,
          "availableService": [
            {
              "@type": "MedicalProcedure",
              "name": "Prosthetic Limb Fitting",
              "description": "Free prosthetic limb fitting services"
            },
            {
              "@type": "MedicalTherapy",
              "name": "Rehabilitation",
              "description": "Rehabilitation services for prosthetic users"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 