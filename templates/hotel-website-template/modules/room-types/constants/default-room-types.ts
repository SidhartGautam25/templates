import { SITE } from "./site";

export interface RatePlan {
  option: string;
  price: number;
  discountedPrice: number;
  taxesAndFees: number;
  details: string[];
}

export interface RoomAmenities {
  popular: string[];
  features?: string[];
  basic?: string[];
  media?: string[];
  bathroom?: string[];
}

export interface RoomType {
  id: string;
  name: string;
  startingPrice: number;
  size: string;
  view: string;
  bedType: string;
  bathrooms: string;
  amenities: RoomAmenities;
  ratePlans: RatePlan[];
  image: string;
  sortOrder?: number;
}

const defaultImage = SITE.assets.defaultProjectImage;

export const defaultRoomTypes: RoomType[] = [
  {
    id: "lake-view-deluxe",
    name: "Lake View Deluxe",
    startingPrice: 4500,
    size: "220 sq.ft (20 sq.mt)",
    view: "Lake View",
    bedType: "1 King Bed",
    bathrooms: "1 Bathroom",
    image: defaultImage,
    sortOrder: 5,
    amenities: {
      popular: ["Lake View", "Air Conditioning", "Wi-Fi", "Mineral Water"],
      features: ["Private balcony", "Work desk", "Reading chair"],
      media: ["Smart TV"],
      bathroom: ["Rain shower", "Premium toiletries", "Hairdryer"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation | Breakfast included",
        price: 6000,
        discountedPrice: 4500,
        taxesAndFees: 630,
        details: ["Breakfast included", "Free cancellation till check-in"],
      },
    ],
  },
  {
    id: "garden-cottage",
    name: "Garden Cottage",
    startingPrice: 5200,
    size: "280 sq.ft (26 sq.mt)",
    view: "Garden View",
    bedType: "1 King Bed",
    bathrooms: "1 Bathroom",
    image: defaultImage,
    sortOrder: 4,
    amenities: {
      popular: ["Garden access", "Wi-Fi", "Air Conditioning"],
      basic: ["Tea/coffee maker"],
      media: ["Smart TV"],
      bathroom: ["Bathtub", "Hot & cold water", "Towels"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation",
        price: 6900,
        discountedPrice: 5200,
        taxesAndFees: 725,
        details: ["Free cancellation till check-in"],
      },
    ],
  },
  {
    id: "family-lake-suite",
    name: "Family Lake Suite",
    startingPrice: 7200,
    size: "340 sq.ft (32 sq.mt)",
    view: "Lake & Garden View",
    bedType: "2 Queen Beds",
    bathrooms: "2 Bathrooms",
    image: defaultImage,
    sortOrder: 3,
    amenities: {
      popular: ["Family seating area", "Wi-Fi", "Air Conditioning"],
      media: ["Smart TV"],
      bathroom: ["Toiletries", "Hot & cold water"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation | Breakfast included",
        price: 9600,
        discountedPrice: 7200,
        taxesAndFees: 1008,
        details: ["Breakfast included", "Free cancellation till check-in"],
      },
    ],
  },
  {
    id: "premium-hill-view",
    name: "Premium Hill View Room",
    startingPrice: 5800,
    size: "250 sq.ft (23 sq.mt)",
    view: "Hill View",
    bedType: "1 King Bed",
    bathrooms: "1 Bathroom",
    image: defaultImage,
    sortOrder: 2,
    amenities: {
      popular: ["Panoramic views", "Air Conditioning", "Wi-Fi"],
      media: ["Smart TV"],
      bathroom: ["Rain shower", "Toiletries"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation",
        price: 7700,
        discountedPrice: 5800,
        taxesAndFees: 809,
        details: ["Free cancellation till check-in"],
      },
    ],
  },
  {
    id: "executive-lake-villa",
    name: "Executive Lake Villa",
    startingPrice: 12500,
    size: "520 sq.ft (48 sq.mt)",
    view: "Private Lake Deck",
    bedType: "1 King Bed + Living Room",
    bathrooms: "2 Bathrooms",
    image: defaultImage,
    sortOrder: 1,
    amenities: {
      popular: ["Private deck", "Butler on call", "Air Conditioning", "Wi-Fi"],
      features: ["Dining nook", "Outdoor seating"],
      media: ["Smart TV"],
      bathroom: ["Jacuzzi", "Premium toiletries", "Hairdryer"],
    },
    ratePlans: [
      {
        option: "Villa With Free Cancellation | All meals",
        price: 16500,
        discountedPrice: 12500,
        taxesAndFees: 1733,
        details: ["Breakfast and dinner included", "Free cancellation till check-in"],
      },
    ],
  },
];
