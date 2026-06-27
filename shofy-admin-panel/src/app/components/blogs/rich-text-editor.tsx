"use client";

import { useEffect, useRef } from "react";
import type Quill from "quill";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/api";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  ["blockquote", "code-block"],
  ["link", "image"],
  ["clean"],
];

const getAdminAccessToken = () => {
  try {
    const userInfo = Cookies.get("admin");
    if (!userInfo) return "";

    const user = JSON.parse(userInfo);
    return user?.accessToken || "";
  } catch {
    return "";
  }
};

const selectImageFile = () =>
  new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.onchange = () => resolve(input.files?.[0] || null);
    input.click();
  });

const uploadEditorImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const token = getAdminAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/cloudinary/add-img`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const result = await response.json();

  if (!response.ok || !result?.data?.url) {
    throw new Error(result?.message || "Image upload failed");
  }

  return result.data.url as string;
};

const RichTextEditor = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Write your blog content...",
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const lastHtmlRef = useRef(value);
  const initialValueRef = useRef(value);
  const initialDisabledRef = useRef(disabled);
  const placeholderRef = useRef(placeholder);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let mounted = true;
    let mountedEditorElement: HTMLDivElement | null = null;

    const setupEditor = async () => {
      if (!editorRef.current || quillRef.current) return;

      const QuillConstructor = (await import("quill")).default;
      if (!mounted || !editorRef.current) return;

      const editorElement = editorRef.current;
      mountedEditorElement = editorElement;
      const quill = new QuillConstructor(editorElement, {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: async function imageHandler(this: { quill: Quill }) {
                try {
                  const file = await selectImageFile();
                  if (!file) return;

                  const imageUrl = await uploadEditorImage(file);
                  const range = this.quill.getSelection(true);
                  const index = range?.index || this.quill.getLength();
                  this.quill.insertEmbed(index, "image", imageUrl, "user");
                  this.quill.setSelection(index + 1, 0);
                } catch {
                  window.alert("Image upload failed. Please try again.");
                }
              },
            },
          },
          history: {
            delay: 600,
            maxStack: 100,
            userOnly: true,
          },
        },
        placeholder: placeholderRef.current,
        readOnly: initialDisabledRef.current,
        theme: "snow",
      });

      quill.clipboard.dangerouslyPasteHTML(initialValueRef.current || "");
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        lastHtmlRef.current = html;
        onChangeRef.current(html);
      });

      quillRef.current = quill;
    };

    setupEditor();

    return () => {
      mounted = false;
      quillRef.current = null;
      if (mountedEditorElement) mountedEditorElement.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || value === lastHtmlRef.current || quill.hasFocus()) return;

    quill.clipboard.dangerouslyPasteHTML(value || "");
    lastHtmlRef.current = value;
  }, [value]);

  useEffect(() => {
    quillRef.current?.enable(!disabled);
  }, [disabled]);

  return (
    <div className="rich-text-editor overflow-hidden rounded-md border border-gray6 bg-white focus-within:border-theme">
      <div ref={editorRef} className="min-h-[360px]" />
    </div>
  );
};

export default RichTextEditor;
