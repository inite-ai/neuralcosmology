import Script from 'next/script';

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Neuralcosmology",
    "url": "https://neuralcosmology.com",
    "description": "A system of reality navigation through states, memory, and attention. Explore the intersection of neural networks and cosmic structures.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://neuralcosmology.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Organization",
      "name": "Neuralcosmology",
      "logo": {
        "@type": "ImageObject",
        "url": "https://neuralcosmology.com/logo.png"
      }
    }
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
} 