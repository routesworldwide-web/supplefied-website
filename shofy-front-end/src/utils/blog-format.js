export const getBlogHref = (blog) => `/blog-details/${blog?.slug || blog?._id || blog?.id}`;

export const formatBlogDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const getBlogExcerpt = (blog) => {
  return blog?.excerpt || blog?.subtitle || "";
};
