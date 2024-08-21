import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  set,
  update,
} from 'firebase/database';
import { db } from '../config/firebase.config';
import { UserData } from '../models/UserData';
import { UserStatus } from '../enums/UserStatus';
import { transformUserData } from '../utils/TransformDataHelpers';

export const createUser = async (
  uid: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  avatarUrl?: string
): Promise<void> => {
  const userData = {
    id: uid,
    username,
    firstName,
    lastName,
    email,
    status: UserStatus.ONLINE,
    teams: {},
    channels: {},
    friends: {},
    userSince: Date.now(),
    notes: {},
    photoAvatarUrl: avatarUrl || '',
  };

  await set(ref(db, `users/${username}`), userData);
  await update(ref(db), {
    [`users/${username}/username`]: username,
  });
};

export const getUserData = async (uid: string): Promise<UserData> => {
  const snapshot = await get(
    query(ref(db, 'users'), orderByChild('uid'), equalTo(uid))
  );

  if (!snapshot.exists()) throw new Error('User not found!');

  return transformUserData(snapshot.val());
};

export const getUserByHandle = async (handle: string): Promise<UserData> => {
  const snapshot = await get(ref(db, `users/${handle}`));
  if (!snapshot.exists()) throw new Error('User not found');

  return transformUserData(snapshot.val());
};
