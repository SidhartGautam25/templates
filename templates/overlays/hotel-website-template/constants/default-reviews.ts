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
    otherInfo: "Patna, Bihar",
    description: "The rooms are extremely clean, spacious, and well-designed. The staff is polite and helpful. Excellent location near Gaya town, very easy to travel to Mahabodhi temple.",
    sortOrder: 10,
  },
  {
    id: "review-2",
    name: "Priya Mukherjee",
    otherInfo: "Kolkata, West Bengal",
    description: "We stayed here for two nights during our pilgrimage. Highly impressed by the fast Wi-Fi and 24/7 reception support. The family deluxe room was perfect for us.",
    sortOrder: 9,
  },
  {
    id: "review-3",
    name: "Vikram Rathore",
    otherInfo: "New Delhi",
    description: "Great value for money. Air conditioning works perfectly, and rooms are very cozy. The room service delivery was prompt and polite.",
    sortOrder: 8,
  },
  {
    id: "review-4",
    name: "Rajesh Kumar",
    otherInfo: null,
    description: "One of the best resorts in the area. Secure parking space and 24/7 power backup made our stay smooth and hassle-free. Highly recommended!",
    sortOrder: 7,
  },
];
