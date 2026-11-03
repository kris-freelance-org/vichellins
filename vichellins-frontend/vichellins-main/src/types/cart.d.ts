export interface ICart {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product: {
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
  };
}
