import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase.config.js';

export const registerUser = (
  email: string,
  password: string
): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (
  email: string,
  password: string
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const updateUserEmail = async (newEmail: string) => {
  const user = auth.currentUser;
  if (!user)
    throw new Error(
      'There was an error updating the email. Please try again later.'
    );
  try {
    await updateEmail(user, newEmail);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert(error);
    }
  }
};
