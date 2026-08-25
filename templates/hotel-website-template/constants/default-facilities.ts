export interface DefaultFacility {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

export const defaultFacilities: DefaultFacility[] = [
  {
    id: "reception-support",
    title: "Reception Support",
    description: "Our 24/7 reception service ensures round-the-clock assistance with check-in, inquiries, travel support, and all guest needs for a smooth, comfortable stay.",
    icon: "bell",
    sortOrder: 10,
  },
  {
    id: "high-speed-wifi",
    title: "High Speed Wifi",
    description: "Enjoy high-speed Wi-Fi throughout the hotel, ensuring fast, seamless connectivity for work, browsing, and entertainment during your stay.",
    icon: "wifi",
    sortOrder: 9,
  },
  {
    id: "air-condition",
    title: "Air Condition",
    description: "All rooms feature air conditioning, providing a cool, comfortable environment to ensure a relaxing stay throughout the stay.",
    icon: "wind",
    sortOrder: 8,
  },
  {
    id: "washing-machine",
    title: "Washing Machine",
    description: "We offer laundry service for quick, clean, and convenient clothing care, ensuring you stay fresh and comfortable throughout your visit.",
    icon: "refresh-cw",
    sortOrder: 7,
  },
  {
    id: "parking-space",
    title: "Parking Space",
    description: "Secure and spacious complimentary parking space is available for all our guests during their stay.",
    icon: "car",
    sortOrder: 6,
  },
  {
    id: "room-service",
    title: "Room Service",
    description: "Prompt and professional room service delivering gourmet food and drinks directly to your door.",
    icon: "utensils",
    sortOrder: 5,
  },
  {
    id: "power-backup",
    title: "Power Backup",
    description: "Full 24/7 power backup facilities to ensure uninterrupted comfort and convenience.",
    icon: "zap",
    sortOrder: 4,
  },
  {
    id: "housekeeping",
    title: "Housekeeping",
    description: "Daily professional housekeeping and sanitization services keeping your space clean and pristine.",
    icon: "sparkles",
    sortOrder: 3,
  },
];
