"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  useAddBlogMutation,
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
  useUpdateBlogMutation,
} from "@/redux/blog/blogApi";
import { BlogStatus, IBlog, IBlogContentBlock } from "@/types/blog-type";
import { notifyError, notifySuccess } from "@/utils/toast";

const MAX_BLOG_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const emptyBlock = (): IBlogContentBlock => ({
  type: "paragraph",
  text: "",
  level: 2,
  items: [],
});

const isValidImage = (file: File) => {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
    return "Only JPG, PNG, or WEBP images are allowed";
  }

  if (file.size > MAX_BLOG_IMAGE_SIZE) {
    return "Blog image must be 4MB or smaller";
  }

  return "";
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const appendBlogFormData = (
  formData: FormData,
  form: BlogFormState,
  primaryImage: File | null,
  secondaryImage: File | null
) => {
  formData.append("title", form.title);
  formData.append("subtitle", form.subtitle);
  formData.append("slug", form.slug);
  formData.append("excerpt", form.excerpt);
  formData.append("category", form.category);
  formData.append("readTime", form.readTime);
  formData.append("author", form.author);
  formData.append("status", form.status);
  formData.append("featured", String(form.featured));
  formData.append("metaTitle", form.metaTitle);
  formData.append("metaDescription", form.metaDescription);
  formData.append("tags", JSON.stringify(form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)));
  formData.append("contentBlocks", JSON.stringify(form.contentBlocks));

  if (primaryImage) formData.append("primaryImage", primaryImage);
  if (secondaryImage) formData.append("secondaryImage", secondaryImage);
};

interface BlogFormState {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  status: BlogStatus;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  contentBlocks: IBlogContentBlock[];
}

const initialForm: BlogFormState = {
  title: "",
  subtitle: "",
  slug: "",
  excerpt: "",
  category: "Supplements",
  readTime: "4 min read",
  author: "Supplefied Team",
  status: "published",
  featured: false,
  metaTitle: "",
  metaDescription: "",
  tags: "",
  contentBlocks: [emptyBlock()],
};

const BlogArea = () => {
  const { data, isError, isLoading } = useGetAllBlogsQuery();
  const [addBlog, { isLoading: isAdding }] = useAddBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);
  const [form, setForm] = useState<BlogFormState>(initialForm);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);

  const publishedCount = useMemo(
    () => data?.data.filter((blog) => blog.status === "published").length || 0,
    [data]
  );

  const updateFormField = (field: keyof BlogFormState, value: string | boolean | IBlogContentBlock[]) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      slug: field === "title" && !editingBlog ? slugify(String(value)) : current.slug,
    }));
  };

  const resetForm = () => {
    setEditingBlog(null);
    setForm(initialForm);
    setPrimaryImage(null);
    setSecondaryImage(null);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const error = isValidImage(file);

    if (error) {
      notifyError(error);
      event.target.value = "";
      return;
    }

    setter(file);
  };

  const updateBlock = (index: number, block: IBlogContentBlock) => {
    const nextBlocks = [...form.contentBlocks];
    nextBlocks[index] = block;
    updateFormField("contentBlocks", nextBlocks);
  };

  const removeBlock = (index: number) => {
    const nextBlocks = form.contentBlocks.filter((_, blockIndex) => blockIndex !== index);
    updateFormField("contentBlocks", nextBlocks.length ? nextBlocks : [emptyBlock()]);
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.readTime.trim()) return "Read time is required";
    if (!editingBlog && !primaryImage) return "Primary image is required";
    if (!form.contentBlocks.some((block) => block.text?.trim() || block.items?.some(Boolean))) {
      return "Add at least one content block";
    }
    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateForm();
    if (error) return notifyError(error);

    const formData = new FormData();
    appendBlogFormData(formData, form, primaryImage, secondaryImage);

    const result = editingBlog
      ? await updateBlog({ id: editingBlog._id, data: formData })
      : await addBlog(formData);

    if ("error" in result) {
      const errorData = result.error as { data?: { message?: string } };
      return notifyError(errorData.data?.message || "Blog could not be saved");
    }

    notifySuccess(result.data.message);
    resetForm();
  };

  const handleEdit = (blog: IBlog) => {
    setEditingBlog(blog);
    setPrimaryImage(null);
    setSecondaryImage(null);
    setForm({
      title: blog.title,
      subtitle: blog.subtitle || "",
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      category: blog.category,
      readTime: blog.readTime,
      author: blog.author || "Supplefied Team",
      status: blog.status,
      featured: blog.featured,
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      tags: blog.tags?.join(", ") || "",
      contentBlocks: blog.contentBlocks?.length ? blog.contentBlocks : [emptyBlock()],
    });
  };

  const handleDelete = (blog: IBlog) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this blog post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const response = await deleteBlog(blog._id);

      if ("error" in response) {
        const errorData = response.error as { data?: { message?: string } };
        return notifyError(errorData.data?.message || "Blog could not be deleted");
      }

      notifySuccess(response.data.message);
      if (editingBlog?._id === blog._id) resetForm();
    });
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xl">{editingBlog ? "Edit Blog" : "Add Blog"}</h4>
            {editingBlog && (
              <button type="button" className="text-tiny text-danger" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="mb-1 text-base text-black">Title</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.title} onChange={(e) => updateFormField("title", e.target.value)} maxLength={180} required />
            </div>
            <div className="col-span-2">
              <p className="mb-1 text-base text-black">Subtitle</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.subtitle} onChange={(e) => updateFormField("subtitle", e.target.value)} maxLength={260} />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Slug</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.slug} onChange={(e) => updateFormField("slug", slugify(e.target.value))} />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Category</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.category} onChange={(e) => updateFormField("category", e.target.value)} required />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Read Time</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.readTime} onChange={(e) => updateFormField("readTime", e.target.value)} placeholder="4 min read" required />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Author</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.author} onChange={(e) => updateFormField("author", e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Status</p>
              <select className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.status} onChange={(e) => updateFormField("status", e.target.value as BlogStatus)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <p className="text-tiny mt-1 mb-0">Only published blogs are visible on the website.</p>
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-base text-black">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateFormField("featured", e.target.checked)} />
                Featured on home
              </label>
            </div>
            <div className="col-span-2">
              <p className="mb-1 text-base text-black">Excerpt</p>
              <textarea className="input w-full rounded-md border border-gray6 p-4" rows={3} value={form.excerpt} onChange={(e) => updateFormField("excerpt", e.target.value)} maxLength={320} />
            </div>
            <div className="col-span-2">
              <p className="mb-1 text-base text-black">Tags</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.tags} onChange={(e) => updateFormField("tags", e.target.value)} placeholder="Protein, Wellness, Recovery" />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Primary Image</p>
              <input className="input w-full rounded-md border border-gray6 p-3" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(e) => handleImageChange(e, setPrimaryImage)} />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Secondary Image</p>
              <input className="input w-full rounded-md border border-gray6 p-3" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(e) => handleImageChange(e, setSecondaryImage)} />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-base text-black">Content Blocks</h5>
              <button type="button" className="h-9 px-3 text-tiny bg-theme text-white rounded-md" onClick={() => updateFormField("contentBlocks", [...form.contentBlocks, emptyBlock()])}>
                Add Block
              </button>
            </div>
            <p className="text-tiny mb-3">Use **bold** and *italic* inside paragraph or quote text.</p>
            <div className="space-y-4">
              {form.contentBlocks.map((block, index) => (
                <div className="border border-gray6 rounded-md p-4" key={index}>
                  <div className="grid grid-cols-12 gap-3 mb-3">
                    <select className="col-span-7 input h-[40px] rounded-md border border-gray6 px-3" value={block.type} onChange={(e) => updateBlock(index, { ...emptyBlock(), type: e.target.value as IBlogContentBlock["type"] })}>
                      <option value="paragraph">Paragraph</option>
                      <option value="heading">Heading</option>
                      <option value="quote">Quote</option>
                      <option value="list">List</option>
                    </select>
                    {block.type === "heading" && (
                      <select className="col-span-3 input h-[40px] rounded-md border border-gray6 px-3" value={block.level || 2} onChange={(e) => updateBlock(index, { ...block, level: Number(e.target.value) })}>
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                      </select>
                    )}
                    <button type="button" className="col-span-2 text-danger text-tiny" onClick={() => removeBlock(index)}>
                      Remove
                    </button>
                  </div>
                  {block.type === "list" ? (
                    <textarea className="input w-full rounded-md border border-gray6 p-3" rows={4} value={(block.items || []).join("\n")} onChange={(e) => updateBlock(index, { ...block, items: e.target.value.split("\n") })} placeholder="One list item per line" />
                  ) : (
                    <textarea className="input w-full rounded-md border border-gray6 p-3" rows={block.type === "paragraph" ? 5 : 2} value={block.text || ""} onChange={(e) => updateBlock(index, { ...block, text: e.target.value })} placeholder="Write content..." />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <p className="mb-1 text-base text-black">Meta Title</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.metaTitle} onChange={(e) => updateFormField("metaTitle", e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Meta Description</p>
              <input className="input w-full h-[44px] rounded-md border border-gray6 px-4" value={form.metaDescription} onChange={(e) => updateFormField("metaDescription", e.target.value)} />
            </div>
          </div>

          <button disabled={isAdding || isUpdating} className="tp-btn h-[44px] justify-center w-full mt-6" type="submit">
            {isAdding || isUpdating ? "Saving..." : editingBlog ? "Update Blog" : "Add Blog"}
          </button>
        </form>
      </div>

      <div className="col-span-12 xl:col-span-7">
        <div className="bg-white rounded-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xl">Blogs</h4>
            <span className="text-tiny">{publishedCount} published</span>
          </div>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Unable to load blogs.</p>}
          {!isLoading && !isError && data?.data.length === 0 && <p>No blog posts added yet.</p>}
          <div className="space-y-4">
            {data?.data.map((blog) => (
              <div key={blog._id} className="border border-gray6 rounded-md p-4 flex gap-4 items-center">
                <Image src={blog.primaryImage} alt={blog.title} width={140} height={90} className="rounded-md object-cover" />
                <div className="flex-1">
                  <h5 className="text-base text-black mb-1">{blog.title}</h5>
                  <p className="mb-1 text-tiny">{blog.category} - {blog.readTime}</p>
                  <p className="mb-0 text-tiny">/{blog.slug} - {blog.status}{blog.featured ? " - featured" : ""}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEdit(blog)} className="h-10 px-3 text-tiny bg-warning text-white rounded-md">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(blog)} className="h-10 px-3 text-tiny bg-danger text-white rounded-md">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArea;
