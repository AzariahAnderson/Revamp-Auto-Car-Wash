import RevampSite from "@/components/revamp/revamp-site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  name: "Revamp Auto Car Wash",
  slogan: "Clean cars hit different.",
  telephone: ["+27 76 302 6570", "+27 75 037 8818"],
  priceRange: "R65 - R140",
  address: {
    "@type": "PostalAddress",
    streetAddress: "89 Stormberg Avenue",
    addressLocality: "Bosmont",
    addressRegion: "Gauteng",
    addressCountry: "ZA",
  },
  makesOffer: [
    {
      "@type": "Offer",
      name: "Half House Wash",
      description: "Exterior wash & dry",
      price: "65",
      priceCurrency: "ZAR",
    },
    {
      "@type": "Offer",
      name: "Full House Wash",
      description: "Exterior wash + interior vacuum",
      price: "120",
      priceCurrency: "ZAR",
    },
    {
      "@type": "Offer",
      name: "Bigger Vehicles Surcharge",
      description: "SUVs & bakkies",
      price: "20",
      priceCurrency: "ZAR",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RevampSite />
    </>
  );
}
