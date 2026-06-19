import Wrapper from "@/layout/wrapper";
import { Suspense } from "react";
import HeaderTwo from "@/layout/headers/header-2";
import BlogBreadcrumb from "@/components/breadcrumb/blog-breadcrumb";
import BlogPostboxArea from "@/components/blog/blog-postox/blog-postbox-area";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Supplefied - Wellness Blog",
};

export default function BlogPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <BlogBreadcrumb />
      <Suspense fallback={<div className="container pt-120 pb-120">Loading blogs...</div>}>
        <BlogPostboxArea />
      </Suspense>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
