import Image from "next/image";
import Link from "next/link";
import { ArrowRightLong } from "@/svg";
import { formatBlogDate, getBlogExcerpt, getBlogHref } from "@/utils/blog-format";

const BlogItem = ({ blog }) => {
  return (
    <div className="tp-blog-item mb-30">
      <div className="tp-blog-thumb p-relative fix">
        <Link href={getBlogHref(blog)}>
          <Image src={blog.primaryImage} alt={blog.title} width={420} height={280} style={{ width: "100%", height: "100%" }} />
        </Link>
        <div className="tp-blog-meta tp-blog-meta-date">
          <span>{formatBlogDate(blog.publishedAt || blog.createdAt)}</span>
        </div>
      </div>
      <div className="tp-blog-content">
        <h3 className="tp-blog-title">
          <Link href={getBlogHref(blog)}>{blog.title}</Link>
        </h3>

        <div className="tp-blog-tag">
          <span><i className="fa-light fa-tag"></i></span>
          <Link href={`/blog?category=${encodeURIComponent(blog.category)}`}>{blog.category}</Link>
        </div>

        <p>{getBlogExcerpt(blog)}</p>

        <div className="tp-blog-btn">
          <Link href={getBlogHref(blog)} className="tp-btn-2 tp-btn-border-2">
            Read More
            <span>
              <ArrowRightLong />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
