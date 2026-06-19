export type BannerPlacement =
  | "home-hero-slider"
  | "home-banner-section-1"
  | "home-banner-section-2"
  | "product-gadget-banner"
  | "product-gadget-sidebar"
  | "product-banner-slider";

export type BannerStatus = "active" | "inactive";

export interface IBanner {
  _id: string;
  title?: string;
  image: string;
  imageId: string;
  redirectLink: string;
  placement: BannerPlacement;
  sortOrder: number;
  status: BannerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IBannerResponse {
  success: boolean;
  data: IBanner[];
}

export interface IBannerMutationResponse {
  success: boolean;
  message: string;
  data?: IBanner;
}
