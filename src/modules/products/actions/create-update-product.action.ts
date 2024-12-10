import { tesloApi } from "@/api/tesloApi";
import type { Product } from "../interfaces/product.interface";

export const createUpdateProductAction = async (product: Partial<Product>) => {
  const productId = product.id;

  product = cleanProductForCreateUpdate(product);

  if (product.id && product.id !== '') {
    return await updateProduct(productId!, product);
  }

  // Create product
  return await createProduct(product);
};

const updateProduct = async (productId: string, product: Partial<Product>) => {
  try {
    const { data } = await tesloApi.patch<Product>(`/products/${productId}`, product);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating product");
  }
}

const createProduct = async (product: Partial<Product>) => {
  try {
    const { data } = await tesloApi.post<Product>('/products', product);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating product");
  }
};

const cleanProductForCreateUpdate = (product: Partial<Product>) => {
  const images: string[] = product.images?.map((image) => {
    if (image.startsWith("http")) {
      const imageName = image.split("/").pop() ?? "";

      return imageName;
    }

    return image;
  }) ?? [];

  delete product.id;
  delete product.user;
  product.images = images;

  return product;
}
