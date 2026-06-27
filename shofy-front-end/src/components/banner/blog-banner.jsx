"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetBannersQuery } from "@/redux/features/bannerApi";

const BlogBanner = () => {
  const { data } = useGetBannersQuery("blog-page-banner");
  const banner = data?.data?.[0];

  if (!banner) {
    return null;
  }

  return (
    <section className="tp-blog-page-banner pt-40" aria-label="Blog promotion">
      <div className="container">
        <div className="tp-blog-page-banner-inner">
          <Link
            href={banner.redirectLink || "/blog"}
            aria-label={banner.title || "Explore our blog"}
          >
            <Image
              src={banner.image}
              alt={banner.title || "Blog banner"}
              fill
              priority
              sizes="(max-width: 575px) calc(100vw - 30px), (max-width: 1399px) calc(100vw - 48px), 1296px"
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogBanner;
