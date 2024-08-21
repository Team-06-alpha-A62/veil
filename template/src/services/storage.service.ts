import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../config/firebase.config.js';
import { v4 as uuidv4 } from 'uuid';

const extractFilenameFromURL = (url: string): string => {
  const parts = url.split('/o/');
  if (parts.length > 1) {
    const pathPart = decodeURIComponent(parts[1].split('?')[0]);
    const filename = pathPart.substring(pathPart.lastIndexOf('/') + 1);
    return filename;
  }
  throw new Error('Invalid URL format');
};

/**
 * Uploads an image in Firebase Storage.
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (!file) throw new Error('No file selected');

  const fileRef = storageRef(storage, `images/${uuidv4()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
};

/**
 * Uploads an avatar in Firebase Storage.
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  if (!file) throw new Error('No File selected');

  const fileRef = storageRef(storage, `avatars/${uuidv4()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const url = getDownloadURL(fileRef);
  return url;
};

/**
 * Deletes an image from Firebase Storage.
 */
export const deleteImage = async (url: string): Promise<void> => {
  const fileName = extractFilenameFromURL(url);
  const desertRef = storageRef(storage, `images/${fileName}`);
  await deleteObject(desertRef);
};

/**
 * Deletes an avatar from Firebase Storage.
 */
export const deleteAvatar = async (url: string): Promise<void> => {
  const fileName = extractFilenameFromURL(url);
  const desertRef = storageRef(storage, `avatars/${fileName}`);
  await deleteObject(desertRef);
};
