"use client";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "F-STOP to Success",
    "description": "Professional PhotoTherapy training for mental health professionals",
    "url": "https://fstoptosuccess.com",
    "logo": "https://fstoptosuccess.com/images/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Kelly Gauthier",
      "jobTitle": "PhotoTherapy Specialist & Registered Art Therapist"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@fstoptosuccess.com",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://www.instagram.com/fstoptosuccess/"
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "PhotoTherapy Training Course",
    "description": "12-week comprehensive PhotoTherapy training program for mental health professionals. Learn proven techniques to increase client success, boost income, and reduce burnout.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "F-STOP to Success",
      "url": "https://fstoptosuccess.com"
    },
    "instructor": {
      "@type": "Person",
      "name": "Kelly Gauthier",
      "jobTitle": "PhotoTherapy Specialist & Registered Art Therapist",
      "description": "Registered Art Therapist with 20+ years of experience, earning a 6-figure income through PhotoTherapy-based practice."
    },
    "educationalLevel": "Professional Development",
    "timeRequired": "P12W",
    "numberOfCredits": "Continuing Education Credits Available",
    "audience": {
      "@type": "EducationalAudience",
      "audienceType": "Mental Health Professionals"
    },
    "coursePrerequisites": "Mental health professional or practitioner",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseWorkload": "PT3H",
      "duration": "P12W"
    },
    "offers": {
      "@type": "Offer",
      "category": "Professional Development",
      "availability": "https://schema.org/InStock",
      "url": "https://fstoptosuccess.com/enroll"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "F-STOP to Success",
    "url": "https://fstoptosuccess.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://fstoptosuccess.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fstoptosuccess.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Enroll",
        "item": "https://fstoptosuccess.com/enroll"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Workshop",
        "item": "https://fstoptosuccess.com/workshop"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
