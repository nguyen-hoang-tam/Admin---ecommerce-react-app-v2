import { collection, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const addProductAPI = async (productData) => {
  const payload = {
    name: productData?.name || '',
    brand: productData?.brand || '',
    category: productData?.category || 'Khác',
    price: Number(productData?.price) || 0,
    originalPrice: productData?.originalPrice ? Number(productData.originalPrice) : null,
    image: productData?.image || '',
    stock: productData?.stock !== undefined && productData?.stock !== null ? Number(productData.stock) : 0,
    sold: productData?.sold !== undefined && productData?.sold !== null ? Number(productData.sold) : 0,
    status: productData?.status || (Number(productData?.stock) > 0 ? 'active' : 'inactive'),
    isNew: productData?.isNew !== undefined ? Boolean(productData.isNew) : true,
    isBestSeller: Boolean(productData?.isBestSeller),
    description: productData?.description || '',
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'products'), payload);
  return docRef.id;
};

export const deleteProductAPI = async (productId) => {
  await deleteDoc(doc(db, 'products', productId));
  return productId;
};

export const updateProductAPI = async (productId, updateData) => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
  return productId;
};

export const createProductAPI = addProductAPI;
export const createOrderAPI = addProductAPI;
