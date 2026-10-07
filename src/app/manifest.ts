import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Revamp Auto Car Wash",
    short_name: "Revamp",
    description:
      "Hand car wash in Bosmont, Johannesburg. Half House R65 · Full House R120. Clean cars hit different.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    categories: ["business", "automotive"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Book a wash",
        url: "/#book",
        description: "Book your wash on WhatsApp",
      },
      {
        name: "Pricing",
        url: "/#pricing",
        description: "Half House R65 · Full House R120",
      },
    ],
  };
}
