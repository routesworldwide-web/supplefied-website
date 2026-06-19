'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useSearchFormSubmit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearchText = searchParams.get("searchText") || "";
  const queryProductType = searchParams.get("productType") || "";
  const [searchText, setSearchText] = useState(querySearchText);
  const [category, setCategory] = useState(queryProductType);

  useEffect(() => {
    setSearchText(querySearchText);
    setCategory(queryProductType);
  }, [querySearchText, queryProductType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedSearchText = searchText.trim();

    if (trimmedSearchText) {
      const params = new URLSearchParams({
        searchText: trimmedSearchText,
      });

      if (category && category !== "Select Category") {
        params.set("productType", category);
      }

      router.push(`/search?${params.toString()}`);
    } else {
      router.push(`/`);
      setSearchText("");
      setCategory("");
    }
  };

  return {
    searchText,
    category,
    setSearchText,
    setCategory,
    handleSubmit,
  };
};

export default useSearchFormSubmit;
