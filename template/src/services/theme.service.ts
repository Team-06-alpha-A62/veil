import { get, ref, update } from 'firebase/database';
import { db } from '../config/firebase.config';

export const removeLockedThemeFromUser = async (
  username: string,
  theme: string
): Promise<void> => {
  const userRef = ref(db, `users/${username}/lockedThemes`);

  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const lockedThemes = snapshot.val();

    if (lockedThemes && lockedThemes[theme]) {
      delete lockedThemes[theme];

      await update(ref(db, `users/${username}`), { lockedThemes });
    }
  } else {
    throw new Error('User or lockedThemes not found.');
  }
};

export const getUserLockedThemes = async (
  username: string
): Promise<{ [key: string]: boolean } | null> => {
  const userRef = ref(db, `users/${username}/lockedThemes`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val() as { [key: string]: boolean };
    } else {
      console.error('Locked themes not found for this user.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving locked themes:', error);
    return null;
  }
};
