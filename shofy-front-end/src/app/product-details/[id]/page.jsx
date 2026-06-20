import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ProductDetailsArea from "@/components/product-details/product-details-area";
import Footer from "@/layout/footers/footer";
import { API_BASE_URL } from "@/config/api";

const getProduct = async (productKey) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/product/single-product/${productKey}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Supplefied - Supplement Details",
    };
  }

  const productUrl = `/product-details/${product.slug || params.id}`;
  const title = `${product.title} | Supplefied`;
  const description =
    product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    "View this supplement on Supplefied.";

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      type: "website",
      images: product.img
        ? [
            {
              url: product.img,
              alt: product.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.img ? [product.img] : [],
    },
  };
}

export default function ProductDetailsPage({ params }) {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ProductDetailsArea id={params.id} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
