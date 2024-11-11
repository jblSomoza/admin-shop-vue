export const getProductImage = (imageName: string) => {

  const url = imageName.includes('http')
    ? imageName
    : `${import.meta.env.VITE_TESLO_API_URL}/files/product/${imageName}`;

  return url;
};
