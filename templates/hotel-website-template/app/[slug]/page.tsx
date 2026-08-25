import React from "react";
import { notFound } from "next/navigation";
import { roomTypeService } from "@/lib/services/RoomTypeService";
import { defaultRoomTypes } from "@/constants/default-room-types";
import ProjectDetailsClient from "./ProjectDetailsClient";
import { slugify } from "@/lib/utils/slugify";
import { SITE, getSiteUrl } from "@/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  let dbRoom = null;
  try {
    const list = await roomTypeService.listRoomTypes();
    dbRoom = list.find((p) => slugify(p.name) === slug || p.id === slug) || null;
  } catch (err) {
    console.error("Database fetch failed in generateMetadata:", err);
  }

  const room = dbRoom || defaultRoomTypes.find((p) => slugify(p.name) === slug || p.id === slug);

  if (!room) {
    return {
      title: `Not Found | ${SITE.brand.shortName}`,
      description: "The requested room details could not be found.",
    };
  }

  const projectTitle = `${room.name} | ${SITE.brand.name}`;
  const projectDesc = `Discover rate plans, amenities, and details of ${room.name} at ${SITE.brand.name} in Gaya.`;
  const projectKeywords = `${room.name}, ${room.name} Gaya, ${SITE.brand.name} ${room.name}, ${room.name} price, ${room.name} booking`;

  return {
    title: projectTitle,
    description: projectDesc,
    keywords: projectKeywords,
    alternates: {
      canonical: getSiteUrl(slug),
    },
    openGraph: {
      title: projectTitle,
      description: projectDesc,
      url: getSiteUrl(slug),
      siteName: SITE.brand.name,
      images: [
        {
          url: room.image || SITE.assets.logoOfficial,
          width: 800,
          height: 600,
          alt: `${room.name}`,
        },
      ],
      locale: SITE.seo.locale,
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  let room: any = null;
  try {
    room = await roomTypeService.getRoomType(slug);
  } catch (err) {
    console.error("Database fetch failed in Page component:", err);
  }

  if (!room) {
    notFound();
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-bg-tan">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: `${room.name} | ${SITE.brand.name}`,
            image: room.image
              ? room.image.startsWith("http")
                ? room.image
                : getSiteUrl(room.image)
              : undefined,
            url: getSiteUrl(slug),
            address: {
              "@type": "PostalAddress",
              addressLocality: SITE.contact.address.locality,
              addressRegion: SITE.contact.address.region,
              addressCountry: SITE.contact.address.country,
            },
            description: `Explore rate plans, amenities, and details of ${room.name}.`,
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: room.startingPrice || undefined,
            },
          }),
        }}
      />
      <ProjectDetailsClient project={room} />
    </div>
  );
}
