import { tesloApi } from "@/api/tesloApi";
import type { Product } from "../interfaces/product.interface";
import { getProductImage } from "./get-product-image";

export const getProductById = async (productId: string): Promise<Product> => {

  if (productId === "create") {
    return {
      id: "",
      title: "",
      description: "",
      price: 0,
      stock: 0,
      slug: "",
      sizes: [],
      gender: "",
      tags: [],
      images: [],
      user: {
        id: "",
        fullName: "",
        email: "",
        isActive: false,
        roles: [],
      },
    }
  }

  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);
    console.log(data);

    return {
      ...data,
      images: data.images.map(getProductImage),
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by id");
  }
};
