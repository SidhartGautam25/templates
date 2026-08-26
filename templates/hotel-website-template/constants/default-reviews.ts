export interface DefaultReview {
  id: string;
  name: string;
  otherInfo: string | null;
  description: string;
  sortOrder: number;
}

export const defaultReviews: DefaultReview[] = [
  {
    id: "review-1",
    name: "Aman Sharma",
    otherInfo: "Mumbai, Maharashtra",
    description:
      "Our weekend at Lakeside Haven was exactly what we needed — calm lake views, spotless rooms, and staff who genuinely cared. The garden cottage felt private and peaceful.",
    sortOrder: 10,
  },
  {
    id: "review-2",
    name: "Priya Mukherjee",
    otherInfo: "Pune, Maharashtra",
    description:
      "We booked the family lake suite for a reunion. Spacious layout, reliable Wi-Fi, and breakfast on the terrace made it effortless. Easy drive from Pune too.",
    sortOrder: 9,
  },
  {
    id: "review-3",
    name: "Vikram Rathore",
    otherInfo: "New Delhi",
    description:
      "Well-maintained property with thoughtful amenities. Room service was prompt and the hill-view deluxe room had a beautiful sunset every evening.",
    sortOrder: 8,
  },
  {
    id: "review-4",
    name: "Rajesh Kumar",
    otherInfo: null,
    description:
      "Secure parking, smooth check-in, and a relaxed atmosphere throughout the resort. Would happily return for another Lonavala getaway.",
    sortOrder: 7,
  },
];
