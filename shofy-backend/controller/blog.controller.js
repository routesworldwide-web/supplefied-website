const fs = require("fs");
const path = require("path");
const { Blog, createSlug } = require("../model/Blog");

const BLOG_IMAGE_DIR = path.join(process.cwd(), "public", "images", "blogs");

const getBlogImageUrl = (req, filename) => {
  const protocol = req.protocol || "http";
  const host = req.get("host") || "localhost:7000";
  return `${protocol}://${host}/images/blogs/${filename}`;
};

const removeLocalBlogImage = (imageId) => {
  if (!imageId) return;

  const imagePath = path.join(BLOG_IMAGE_DIR, imageId);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

const parseJsonField = (value, fallback) => {
  if (typeof value === "undefined") return fallback;
  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const normalizeContentBlocks = (blocks = []) => {
  return blocks
    .map((block) => {
      const type = block?.type;

      if (type === "list") {
        return {
          type,
          items: Array.isArray(block.items)
            ? block.items.map((item) => String(item || "").trim()).filter(Boolean)
            : [],
        };
      }

      return {
        type,
        text: String(block?.text || "").trim(),
        level: Number(block?.level || 2),
      };
    })
    .filter((block) => {
      if (block.type === "list") return block.items.length > 0;
      return ["heading", "paragraph", "quote"].includes(block.type) && block.text;
    });
};

const buildBlogPayload = (req, existingBlog) => {
  const tags = parseJsonField(req.body.tags, existingBlog?.tags || []);
  const contentBlocks = normalizeContentBlocks(
    parseJsonField(req.body.contentBlocks, existingBlog?.contentBlocks || [])
  );

  const payload = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    slug: req.body.slug,
    excerpt: req.body.excerpt,
    category: req.body.category,
    readTime: req.body.readTime,
    author: req.body.author,
    status: req.body.status,
    featured: req.body.featured === "true" || req.body.featured === true,
    metaTitle: req.body.metaTitle,
    metaDescription: req.body.metaDescription,
    tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    contentBlocks,
  };

  Object.keys(payload).forEach((key) => {
    if (typeof payload[key] === "undefined") delete payload[key];
  });

  if (payload.slug) {
    payload.slug = createSlug(payload.slug);
  }

  return payload;
};

const ensureUniqueSlug = async (slug, currentId) => {
  const baseSlug = createSlug(slug);
  let nextSlug = baseSlug;
  let counter = 2;

  while (await Blog.findOne({ slug: nextSlug, _id: { $ne: currentId } })) {
    nextSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return nextSlug;
};

const getPublicBlogs = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 9), 1), 30);
    const skip = (page - 1) * limit;
    const query = { status: "published" };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.featured === "true") {
      query.featured = true;
    }

    const [blogs, total, categories] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(query),
      Blog.aggregate([
        { $match: { status: "published" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: blogs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        categories: categories.map((item) => ({ name: item._id, count: item.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPublicBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      status: "published",
      category: blog.category,
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(4);

    res.status(200).json({
      success: true,
      data: blog,
      relatedBlogs,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const primaryImage = req.files?.primaryImage?.[0];
    const secondaryImage = req.files?.secondaryImage?.[0];

    if (!primaryImage) {
      if (secondaryImage) {
        removeLocalBlogImage(secondaryImage.filename);
      }
      return res.status(400).json({ success: false, message: "Primary image is required" });
    }

    const payload = buildBlogPayload(req);
    payload.slug = await ensureUniqueSlug(payload.slug || payload.title);
    payload.primaryImage = getBlogImageUrl(req, primaryImage.filename);
    payload.primaryImageId = primaryImage.filename;

    if (secondaryImage) {
      payload.secondaryImage = getBlogImageUrl(req, secondaryImage.filename);
      payload.secondaryImageId = secondaryImage.filename;
    }

    const blog = await Blog.create(payload);

    res.status(201).json({
      success: true,
      message: "Blog added successfully",
      data: blog,
    });
  } catch (error) {
    req.files?.primaryImage?.forEach((file) => removeLocalBlogImage(file.filename));
    req.files?.secondaryImage?.forEach((file) => removeLocalBlogImage(file.filename));
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      req.files?.primaryImage?.forEach((file) => removeLocalBlogImage(file.filename));
      req.files?.secondaryImage?.forEach((file) => removeLocalBlogImage(file.filename));
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const payload = buildBlogPayload(req, blog);

    if (payload.slug || payload.title) {
      payload.slug = await ensureUniqueSlug(payload.slug || blog.slug || payload.title, blog._id);
    }

    Object.assign(blog, payload);

    const primaryImage = req.files?.primaryImage?.[0];
    const secondaryImage = req.files?.secondaryImage?.[0];

    if (primaryImage) {
      removeLocalBlogImage(blog.primaryImageId);
      blog.primaryImage = getBlogImageUrl(req, primaryImage.filename);
      blog.primaryImageId = primaryImage.filename;
    }

    if (secondaryImage) {
      removeLocalBlogImage(blog.secondaryImageId);
      blog.secondaryImage = getBlogImageUrl(req, secondaryImage.filename);
      blog.secondaryImageId = secondaryImage.filename;
    }

    if (blog.status === "published" && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    req.files?.primaryImage?.forEach((file) => removeLocalBlogImage(file.filename));
    req.files?.secondaryImage?.forEach((file) => removeLocalBlogImage(file.filename));
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    removeLocalBlogImage(blog.primaryImageId);
    removeLocalBlogImage(blog.secondaryImageId);
    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getPublicBlogBySlug,
  getPublicBlogs,
  updateBlog,
};
