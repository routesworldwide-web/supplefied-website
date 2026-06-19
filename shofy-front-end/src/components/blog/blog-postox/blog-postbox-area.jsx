"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetBlogsQuery } from "@/redux/features/blogApi";
import { ArrowRightLong } from "@/svg";
import { formatBlogDate, getBlogExcerpt, getBlogHref } from "@/utils/blog-format";

const BlogCard = ({ blog, isLarge = false }) => {
  return (
    <article className={`tp-blog-managed-card ${isLarge ? "is-large" : ""}`}>
      <Link href={getBlogHref(blog)} className="tp-blog-managed-thumb">
        <Image src={blog.primaryImage} alt={blog.title} width={isLarge ? 760 : 420} height={isLarge ? 470 : 280} />
      </Link>
      <div className="tp-blog-managed-content">
        <div className="tp-blog-managed-meta">
          <span>{blog.category}</span>
          <span>{blog.readTime}</span>
          <span>{formatBlogDate(blog.publishedAt || blog.createdAt)}</span>
        </div>
        <h3>
          <Link href={getBlogHref(blog)}>{blog.title}</Link>
        </h3>
        <p>{getBlogExcerpt(blog)}</p>
        <Link href={getBlogHref(blog)} className="tp-link-btn-3">
          Read More <ArrowRightLong />
        </Link>
      </div>
    </article>
  );
};

const BlogPostboxArea = () => {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(1);
  const { data, isError, isFetching, isLoading } = useGetBlogsQuery({ page, limit: 9, category });
  const blogs = useMemo(() => data?.data || [], [data]);
  const categories = data?.meta?.categories || [];
  const totalPages = data?.meta?.totalPages || 1;

  const leadBlog = blogs[0];
  const remainingBlogs = useMemo(() => blogs.slice(1), [blogs]);

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <section className="tp-blog-managed-area pt-100 pb-120">
      <div className="container">
        <div className="tp-blog-managed-top">
          <div>
            <span className="tp-blog-managed-eyebrow">Supplefied Journal</span>
            <h2>Wellness guides, supplement education, and product stories</h2>
          </div>
          <div className="tp-blog-managed-filter">
            <label htmlFor="blog-category">Category</label>
            <select id="blog-category" value={category} onChange={(event) => handleCategoryChange(event.target.value)}>
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} ({item.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && <p>Loading blogs...</p>}
        {isError && <p>Unable to load blogs right now.</p>}
        {!isLoading && !isError && blogs.length === 0 && (
          <div className="tp-blog-managed-empty">
            <h3>No blog posts found</h3>
            <p>Published posts from the admin panel will appear here.</p>
          </div>
        )}

        {leadBlog && (
          <div className={`tp-blog-managed-grid ${isFetching ? "is-loading" : ""}`}>
            <div className="tp-blog-managed-feature">
              <BlogCard blog={leadBlog} isLarge />
            </div>
            {remainingBlogs.map((blog) => (
              <BlogCard blog={blog} key={blog._id} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="tp-blog-managed-pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPostboxArea;
