import { tesloApi } from "@/api/tesloApi";
import type { Product } from "../interfaces/product.interface";
import { getProductImage } from "./get-product-image";


export const getProducts = async (page: number = 1, limit: number = 10) => {
  try {
    const { data } = await tesloApi.get<Product[]>(`/products?limit=${limit}&offset=${page}`);

    const products = data.map((product) => ({
      ...product,
      images: product.images.map(getProductImage),
    }));


    return products;

  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
