import { UserType, VerificationStatus } from "@/lib/utils";

export interface IProduct {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  rating: number | null;
  stock: number;
  leftImage: string | null;
  rightImage: string | null;
  mainImage: string | null;
  extraImage: string | null;
  createdAt: string;
  updatedAt: string;
  wishlistId?: string;
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}


export interface IAddProduct {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  description: string;
}


export interface IProductUser {
  id: string;
  category_id: string;
  name: string;
  unit_price: number;
  description: string;
  image_1: string;
  image_2: string | null;
  image_3: string | null;
  created_at: string;
  updated_at: string;
}

export interface IProductReview {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  rating: number | null;
  stock: number;
  leftImage: string | null;
  rightImage: string | null;
  mainImage: string | null;
  extraImage: string | null;
  createdAt: string;
  updatedAt: string;
  reviews: IReview[];
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: string | number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    pic: string | null;
    name: string;
    type: UserType;
    phone_number: string;
    email: string;
    email_verified_at: string;
    business_name: string;
    business_address: string;
    business_mail: string;
    gender: string | null;
    dob: string | null;
    id_type: string | null;
    id_number: string | null;
    id_doc: string | null;
    id_expiry_date: string | null;
    state: string | null;
    lga: string | null;
    address: string | null;
    building_number: string | null;
    landmark: string | null;
    verification_status: VerificationStatus;
    created_at: string;
    updated_at: string;
  };
}

