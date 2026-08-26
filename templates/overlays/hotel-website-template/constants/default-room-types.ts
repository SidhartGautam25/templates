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
    id: "deluxe-ac-room",
    name: "Deluxe Ac Room",
    startingPrice: 2100,
    size: "140 sq.ft (13 sq.mt)",
    view: "City View",
    bedType: "1 King Bed",
    bathrooms: "1 Bathroom",
    image: '["/assets/deluxe_ac_1.png", "/assets/deluxe_ac_2.png", "/assets/deluxe_ac_3.png"]',
    sortOrder: 5,
    amenities: {
      popular: ["Iron/Ironing Board", "Bathroom", "Air Conditioning", "Mineral Water", "Wi-Fi"],
      features: ["Closet", "Chair", "Work Desk"],
      basic: ["Kettle"],
      media: ["TV"],
      bathroom: ["Hairdryer", "Bathtub", "Hot & Cold Water", "Toiletries", "Towels"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation | Breakfast only",
        price: 2800,
        discountedPrice: 2100,
        taxesAndFees: 294,
        details: ["Breakfast included", "Free Cancellation till check-in"],
      },
    ],
  },
  {
    id: "twin-deluxe-with-bathtub",
    name: "Twin Deluxe With Bathtub",
    startingPrice: 2625,
    size: "250 sq.ft (23 sq.mt)",
    view: "Garden View",
    bedType: "1 King Bed",
    bathrooms: "1 Bathroom",
    image: '["/assets/twin_deluxe_1.png", "/assets/twin_deluxe_2.png"]',
    sortOrder: 4,
    amenities: {
      popular: ["Mineral Water", "Wi-Fi", "Bathroom", "Air Conditioning"],
      basic: ["Kettle"],
      media: ["TV"],
      bathroom: ["Hairdryer", "Bathtub", "Hot & Cold Water", "Toiletries", "Towels"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation",
        price: 3500,
        discountedPrice: 2625,
        taxesAndFees: 367,
        details: ["Free Cancellation till check-in"],
      },
    ],
  },
  {
    id: "standard-room",
    name: "Standard Room",
    startingPrice: 3750,
    size: "120 sq.ft (11 sq.mt)",
    view: "Garden View",
    bedType: "1 King Bed",
    bathrooms: "1 Bathroom",
    image: defaultImage,
    sortOrder: 3,
    amenities: {
      popular: ["Bathroom", "Wi-Fi", "Mineral Water"],
      media: ["TV"],
      bathroom: ["Toiletries", "Hot & Cold Water", "Towels"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation",
        price: 5000,
        discountedPrice: 3750,
        taxesAndFees: 526,
        details: ["Free Cancellation till check-in"],
      },
      {
        option: "Room With Free Cancellation | Breakfast only",
        price: 5300,
        discountedPrice: 3975,
        taxesAndFees: 557,
        details: ["Breakfast included", "Free Cancellation till check-in"],
      },
    ],
  },
  {
    id: "twin-deluxe",
    name: "Twin Deluxe",
    startingPrice: 5625,
    size: "250 sq.ft (23 sq.mt)",
    view: "Garden View",
    bedType: "1 King Bed",
    bathrooms: "1 Bathroom",
    image: defaultImage,
    sortOrder: 2,
    amenities: {
      popular: ["Air Conditioning", "Iron/Ironing Board", "Bathroom", "Wi-Fi", "Mineral Water"],
      media: ["TV"],
      bathroom: ["Toiletries", "Hot & Cold Water", "Towels"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation",
        price: 7500,
        discountedPrice: 5625,
        taxesAndFees: 787,
        details: ["Free Cancellation till check-in"],
      },
    ],
  },
  {
    id: "family-deluxe-triple-bed",
    name: "Family Deluxe Triple Bed",
    startingPrice: 6375,
    size: "200 sq.ft (19 sq.mt)",
    view: "Garden View",
    bedType: "Bedroom 1 - 3 Single Bed(s)",
    bathrooms: "Bathrooms - 1",
    image: defaultImage,
    sortOrder: 1,
    amenities: {
      popular: ["Iron/Ironing Board", "Bathroom", "Air Conditioning", "Wi-Fi", "Mineral Water"],
      basic: ["Kettle"],
      media: ["TV"],
      bathroom: ["Hairdryer", "Hot & Cold Water", "Toiletries", "Towels"],
    },
    ratePlans: [
      {
        option: "Room With Free Cancellation",
        price: 8500,
        discountedPrice: 6375,
        taxesAndFees: 893,
        details: ["Free Cancellation till check-in"],
      },
      {
        option: "Room With Free Cancellation | Breakfast only",
        price: 8800,
        discountedPrice: 6600,
        taxesAndFees: 924,
        details: ["Breakfast included", "Free Cancellation till check-in"],
      },
    ],
  },
];
