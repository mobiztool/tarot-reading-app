interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Website Schema
export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ดูดวงไพ่ยิปซี - Tarot Reading App',
    description:
      'ค้นพบคำตอบและแนวทางชีวิตด้วยไพ่ยิปซี 78 ใบ ดูดวงประจำวัน ไพ่ 3 ใบ พร้อมความหมายละเอียด',
    url: 'https://tarot-reading-app-ebon.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://tarot-reading-app-ebon.vercel.app/cards?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'th',
  };

  return <JsonLd data={data} />;
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

// Article Schema (for card pages)
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  author = 'Tarot Reading App',
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tarot Reading App',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tarot-reading-app-ebon.vercel.app/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={data} />;
}

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// Organization Schema
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tarot Reading App',
    alternateName: 'ดูดวงไพ่ยิปซี',
    url: 'https://tarot-reading-app-ebon.vercel.app',
    logo: 'https://tarot-reading-app-ebon.vercel.app/logo.png',
    sameAs: [],
  };

  return <JsonLd data={data} />;
}

