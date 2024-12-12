import { tesloApi } from "@/api/tesloApi";
import type { Product } from "../interfaces/product.interface";

export const createUpdateProductAction = async (product: Partial<Product>) => {
  const productId = product.id;

  const newImages = await uploadImages(product.images ?? []);
  product.images = newImages.map(image => typeof image === 'string' ? image : image.secureUrl);

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

const uploadImages = async (images: (File | string)[]) => {
  try {
    const filesToUpload = images.filter((image) => image instanceof File) as File[];
    const currentImages = images.filter((image) => typeof image === 'string') as string[];

    const uploadPromises = filesToUpload.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await tesloApi.post<{ secureUrl: string }>('/files/product');

      return data;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return [...currentImages, ...uploadedImages];
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading images");
  }
}
