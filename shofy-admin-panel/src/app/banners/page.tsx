import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import BannerArea from "../components/banners/banner-area";

const BannersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Website Banners" subtitle="Manage homepage and product section banners" />
        <BannerArea />
      </div>
    </Wrapper>
  );
};

export default BannersPage;
