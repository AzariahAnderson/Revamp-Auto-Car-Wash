import RevampSite from "@/components/revamp/revamp-site";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=89+Stormberg+Avenue+Bosmont+Johannesburg";

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
  geo: {
    "@type": "GeoCoordinates",
    latitude: -26.18905,
    longitude: 27.95321,
  },
  hasMap: MAPS_URL,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "15:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
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
