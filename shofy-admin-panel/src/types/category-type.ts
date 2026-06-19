
export interface ICategoryItem {
  _id: string;
  img: string;
  parent: string;
  children: string[];
  productType: string;
  products?: string[];
  featured?: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  result: ICategoryItem[];
}

export interface IAddCategory {
  img?: string;
  parent: string;
  children?: string[];
  productType: string;
  description?: string;
  featured?: boolean;
  status?: string;
}

export interface IAddCategoryResponse {
  status: string;
  message: string;
  data: {
    parent: string;
    children?: string[];
    productType: string;
    products?: any[];
    featured?: boolean;
    status?: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ICategoryDeleteRes {
  success?: boolean;
  message?: string;
}


