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
  phoneNumber: string | null,
  avatarUrl: string | null
): Promise<void> => {
  const userData = {
    id: uid,
    username,
    firstName,
    lastName,
    email,
    phoneNumber: phoneNumber || '',
    status: UserStatus.ONLINE,
    teams: {},
    channels: {},
    friends: {},
    userSince: Date.now(),
    notes: {},
    avatarUrl: avatarUrl || '',
  };

  await set(ref(db, `users/${username}`), userData);
  await update(ref(db), {
    [`users/${username}/username`]: username,
  });
};

export const getUserData = async (id: string): Promise<UserData> => {
  const snapshot = await get(
    query(ref(db, 'users'), orderByChild('id'), equalTo(id))
  );
  console.log(snapshot.val());
  if (!snapshot.exists()) throw new Error('User not found!');

  const userData = Object.values(snapshot.val())[0] as UserData;

  const changedData = transformUserData(userData);

  return changedData;
};

export const getUserByHandle = async (handle: string): Promise<UserData> => {
  const snapshot = await get(ref(db, `users/${handle}`));
  if (!snapshot.exists()) throw new Error('User not found');

  return transformUserData(snapshot.val());
};
