export interface GalleryImageInput {
  title: string;
  category?: string;
  description?: string | null;
  imageUrl: string;
  sortOrder?: number;
  published?: boolean;
}

export interface GalleryImageUpdate {
  title?: string;
  category?: string;
  description?: string | null;
  imageUrl?: string;
  sortOrder?: number;
  published?: boolean;
}
