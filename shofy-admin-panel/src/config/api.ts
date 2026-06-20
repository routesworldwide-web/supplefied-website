const productionSiteUrl = "https://supplefied.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? productionSiteUrl
    : "http://localhost:7000");
