"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import BlogContentBlocks from "../blog/blog-content-blocks";
import { useGetBlogsQuery } from "@/redux/features/blogApi";
import { formatBlogDate, getBlogExcerpt, getBlogHref } from "@/utils/blog-format";

const RelatedBlog = ({ blog }) => (
  <div className="tp-blog-managed-related-item">
    <Link href={getBlogHref(blog)}>
      <Image src={blog.primaryImage} alt={blog.title} width={88} height={70} />
    </Link>
    <div>
      <span>{blog.category}</span>
      <h4>
        <Link href={getBlogHref(blog)}>{blog.title}</Link>
      </h4>
    </div>
  </div>
);

const BlogRichContent = ({ html }) => {
  if (!html) return null;

  return (
    <div
      className="tp-blog-rich-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const BlogDetailsArea = ({ blog, relatedBlogs = [] }) => {
  const { data } = useGetBlogsQuery({ limit: 30 });
  const categories = data?.meta?.categories || [];
  const fallbackRelated = useMemo(() => {
    return (data?.data || []).filter((item) => item._id !== blog?._id).slice(0, 4);
  }, [blog?._id, data]);
  const sidebarBlogs = relatedBlogs.length ? relatedBlogs : fallbackRelated;

  if (!blog) {
    return (
      <section className="tp-postbox-details-area pb-120 pt-95">
        <div className="container">
          <h2>Blog not found</h2>
          <p>This post may be unpublished or removed.</p>
          <Link href="/blog" className="tp-btn">Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="tp-postbox-details-area tp-blog-managed-details pb-120 pt-95">
      <div className="container">
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <article className="tp-postbox-details-main-wrapper">
              <div className="tp-blog-managed-details-head">
                <div className="tp-blog-managed-meta">
                  <span>{blog.category}</span>
                  <span>{blog.readTime}</span>
                  <span>{formatBlogDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <h1>{blog.title}</h1>
                {blog.subtitle && <p>{blog.subtitle}</p>}
              </div>

              <div className="tp-postbox-details-thumb tp-blog-managed-details-thumb">
                <Image src={blog.primaryImage} alt={blog.title} width={960} height={560} />
              </div>

              <div className="tp-postbox-details-content">
                {blog.excerpt && <p>{getBlogExcerpt(blog)}</p>}
                {blog.contentHtml ? (
                  <BlogRichContent html={blog.contentHtml} />
                ) : (
                  <BlogContentBlocks blocks={blog.contentBlocks} />
                )}

                {blog.secondaryImage && (
                  <div className="tp-postbox-details-desc-thumb text-center">
                    <Image src={blog.secondaryImage} alt={`${blog.title} supporting image`} width={760} height={440} />
                    <span className="tp-postbox-details-desc-thumb-caption">{blog.subtitle || blog.title}</span>
                  </div>
                )}

                {blog.tags?.length > 0 && (
                  <div className="tp-postbox-details-tags tagcloud">
                    <span>Tags:</span>
                    {blog.tags.map((tag) => (
                      <Link href={`/blog?tag=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className="col-xl-3 col-lg-4">
            <aside className="tp-blog-managed-sidebar">
              <div className="tp-sidebar-widget widget_categories mb-35">
                <h3 className="tp-sidebar-widget-title">Categories</h3>
                <div className="tp-sidebar-widget-content">
                  <ul>
                    <li><Link href="/blog">All Categories</Link></li>
                    {categories.map((item) => (
                      <li key={item.name}>
                        <Link href={`/blog?category=${encodeURIComponent(item.name)}`}>
                          {item.name} <span>({item.count})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="tp-sidebar-widget mb-35">
                <h3 className="tp-sidebar-widget-title">Related Blogs</h3>
                <div className="tp-sidebar-widget-content">
                  {sidebarBlogs.length === 0 && <p>No related blogs yet.</p>}
                  {sidebarBlogs.map((item) => (
                    <RelatedBlog blog={item} key={item._id} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;
