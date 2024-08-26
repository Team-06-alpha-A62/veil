import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  set,
  update,
} from 'firebase/database';
import { db } from '../config/firebase.config';
import { UserData } from '../models/UserData';
import { UserStatus } from '../enums/UserStatus';
import {
  transformUserData,
  transformUserToFriend,
} from '../utils/TransformDataHelpers';
import { Friend } from '../models/Friend';
import { FriendType } from '../enums/FriendType';

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

export const getAllUsers = async (): Promise<UserData[]> => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) throw new Error('No users found!');

  const usersData = snapshot.val();
  const transformedUsers: UserData[] = Object.values(usersData).map(user =>
    transformUserData(user as UserData)
  );

  return transformedUsers;
};

export const updateUserStatus = async (
  username: string,
  newStatus: UserStatus
): Promise<void> => {
  try {
    const updateObject = {
      [`users/${username}/status/`]: newStatus,
    };
    await update(ref(db), updateObject);
  } catch {
    throw new Error('Failed to update user status.');
  }
};

export const userStatusListener = (
  username: string,
  onStatusChange: (newStatus: string) => void
): (() => void) => {
  const statusRef = ref(db, `users/${username}/status`);

  return onValue(statusRef, snapshot => {
    if (snapshot.exists()) {
      onStatusChange(snapshot.val());
    }
  });
};

export const acceptFriendRequest = async (
  currentUsername: string,
  pendingFriendUsername: string
): Promise<void> => {
  try {
    const updates = {
      [`users/${currentUsername}/friends/${pendingFriendUsername}`]: 'friend',
      [`users/${pendingFriendUsername}/friends/${currentUsername}`]: 'friend',
    };
    await update(ref(db), updates);
  } catch {
    throw new Error(`Failed to accept friend request`);
  }
};

export const declineFriendRequest = async (
  currentUsername: string,
  pendingFriendUsername: string
): Promise<void> => {
  try {
    const updates = {
      [`users/${currentUsername}/friends/${pendingFriendUsername}`]: null,
      [`users/${pendingFriendUsername}/friends/${currentUsername}`]: null,
    };
    await update(ref(db), updates);
  } catch {
    throw new Error('Failed to decline friend request.');
  }
};

export const getUserFriends = async (username: string): Promise<Friend[]> => {
  const snapshot = await get(ref(db, `users/${username}/friends`));
  if (!snapshot.exists()) return [];

  const friendsObject = snapshot.val() || {};
  const friends: Friend[] = (
    await Promise.all(
      Object.entries(friendsObject).map(
        async ([friendUsername, friendshipStatus]) => {
          const friendSnapshot = await get(ref(db, `users/${friendUsername}`));
          if (!friendSnapshot.exists()) return null;

          const friendData = friendSnapshot.val() as UserData;
          return transformUserToFriend(
            friendData,
            friendshipStatus as FriendType
          );
        }
      )
    )
  ).filter((friend): friend is Friend => friend !== null);

  return friends;
};
