"use client";
import { use } from "react";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import { useGetBlogBySlugQuery } from "@/redux/features/blogApi";

const BlogDetails = ({ params }) => {
  const resolvedParams = use(params);
  const slug = resolvedParams?.id;
  const { data, isError, isLoading } = useGetBlogBySlugQuery(slug, { skip: !slug });

  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      {isLoading && (
        <section className="pt-120 pb-120">
          <div className="container">
            <p>Loading blog...</p>
          </div>
        </section>
      )}
      {isError && <BlogDetailsArea blog={null} />}
      {!isLoading && !isError && (
        <BlogDetailsArea blog={data?.data} relatedBlogs={data?.relatedBlogs || []} />
      )}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogDetails;
