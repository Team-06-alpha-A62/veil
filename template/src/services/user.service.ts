import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  set,
  Unsubscribe,
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
import { NotificationType } from '../enums/NotificationType';
import { ChannelType } from '../enums/ChannelType';
import { lockedThemes } from '../data/themeData.ts';
export const createUser = async (
  uid: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string | null,
  avatarUrl: string | null
): Promise<void> => {
  const lockedThemesObject = lockedThemes.reduce(
    (obj: { [key: string]: boolean }, theme: string) => {
      obj[theme] = true;
      return obj;
    },
    {} as { [key: string]: boolean }
  );

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
    lockedThemes: lockedThemesObject,
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
export const updateUserProfile = async (
  username: string,
  updatedProfile: Partial<UserData>
): Promise<void> => {
  try {
    const updateObject: Record<string, string> = {};

    if (updatedProfile.firstName) {
      updateObject[`users/${username}/firstName`] = updatedProfile.firstName;
    }
    if (updatedProfile.lastName) {
      updateObject[`users/${username}/lastName`] = updatedProfile.lastName;
    }
    if (updatedProfile.phoneNumber) {
      updateObject[`users/${username}/phoneNumber`] =
        updatedProfile.phoneNumber;
    }
    if (updatedProfile.avatarUrl) {
      updateObject[`users/${username}/avatarUrl`] = updatedProfile.avatarUrl;
    }
    if (updatedProfile.status) {
      updateObject[`users/${username}/status`] = updatedProfile.status;
    }

    await update(ref(db), updateObject);
  } catch {
    throw new Error('Failed to update user profile.');
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

export const listenToFriendsChange = (
  username: string,
  onFriendsChange: (friends: Friend[], pendingFriends: Friend[]) => void
): (() => void) => {
  const friendsRef = ref(db, `users/${username}/friends`);

  return onValue(friendsRef, async () => {
    try {
      const allFriends = await getUserFriends(username);
      const friends = allFriends.filter(
        friend => friend.friendshipStatus === FriendType.FRIEND
      );
      const pendingFriends = allFriends.filter(
        friend => friend.friendshipStatus === FriendType.PENDING
      );

      onFriendsChange(friends, pendingFriends);
    } catch (error) {
      console.error('Failed to fetch friends data:', error);
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

export const removeFriend = async (
  currentUsername: string,
  friendUsername: string
): Promise<void> => {
  try {
    const updates: Record<string, null> = {
      [`users/${currentUsername}/friends/${friendUsername}`]: null,
      [`users/${friendUsername}/friends/${currentUsername}`]: null,
    };

    await update(ref(db), updates);
  } catch {
    throw new Error(`Failed to remove friend`);
  }
};

export const sendFriendRequest = async (
  currentUsername: string,
  pendingFriendUsername: string
): Promise<void> => {
  try {
    const updates = {
      [`users/${pendingFriendUsername}/friends/${currentUsername}`]: 'pending',
    };
    await update(ref(db), updates);
  } catch {
    throw new Error(`Failed to send friend request`);
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
export const leaveChannel = async (
  channelHandle: string,
  userHandle: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelHandle}/participants/${userHandle}`]: null,
    [`users/${userHandle}/channels/${channelHandle}`]: null,
  };

  await update(ref(db), updateObject);
};

export const addUnreadNotification = async (
  username: string,
  notificationId: string | null,
  type: NotificationType,
  channelType?: ChannelType
) => {
  let updatedNotifications;
  if (type === NotificationType.MESSAGE) {
    const unreadMessagesRef = ref(
      db,
      `users/${username}/unreadNotifications/${type}/${notificationId}`
    );
    const unreadMessagesSnapshot = await get(unreadMessagesRef);
    const unreadMessagesData = unreadMessagesSnapshot.val();
    updatedNotifications = {
      [`users/${username}/unreadNotifications/${type}/${notificationId}`]:
        unreadMessagesData ? unreadMessagesData + 1 : 1,
    };
    if (channelType === ChannelType.DIRECT) {
      await incrementUnreadDirectNotifications(username);
    } else if (channelType === ChannelType.GROUP) {
      await incrementUnreadGroupNotifications(username);
    }
    if (channelType !== ChannelType.TEAM) {
      await incrementUnreadGlobalMessagesNotifications(username);
    }
  } else {
    updatedNotifications = {
      [`users/${username}/unreadNotifications/${type}/${notificationId}`]: true,
    };
  }

  await update(ref(db), updatedNotifications);
};

export const getUnreadNotificationsCount = async (
  username: string,
  type: NotificationType
) => {
  const notificationsRef = ref(
    db,
    `users/${username}/unreadNotifications/${type}`
  );
  const notificationsSnapshot = await get(notificationsRef);
  const notifications = notificationsSnapshot.val();

  return notifications.length || 0;
};

export const clearUnreadNotifications = async (
  username: string,
  type: NotificationType
) => {
  const updateObject = {
    [`users/${username}/unreadNotifications/${type}`]: null,
  };

  await update(ref(db), updateObject);
};

export const listenToUnreadNotifications = (
  username: string,
  type: NotificationType,
  callback: (count: number) => void
) => {
  const unreadNotificationsRef = ref(
    db,
    `users/${username}/unreadNotifications/${type}`
  );

  const unsubscribe = onValue(unreadNotificationsRef, snapshot => {
    if (snapshot.exists()) {
      const notifications = snapshot.val();
      callback(Object.keys(notifications).length);
    } else {
      callback(0);
    }
  });

  return unsubscribe;
};

export const getUnreadChannelMessagesCount = async (
  username: string,
  channelId: string
): Promise<number> => {
  const notificationsRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.MESSAGE}/${channelId}`
  );
  const notificationsSnapshot = await get(notificationsRef);
  const notifications = notificationsSnapshot.val();

  return notifications || 0;
};

export const listenToUnreadChannelMessages = (
  username: string,
  channelId: string,
  callback: (count: number) => void
): Unsubscribe => {
  const unreadNotificationsRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.MESSAGE}/${channelId}`
  );

  const unsubscribe = onValue(unreadNotificationsRef, snapshot => {
    if (snapshot.exists()) {
      const notifications = snapshot.val();
      callback(notifications);
    } else {
      callback(0);
    }
  });

  return unsubscribe;
};

export const clearUnreadChannelMessages = async (
  username: string,
  channelId: string,
  channelType: ChannelType | null
) => {
  const channelMessagesRed = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.MESSAGE}/${channelId}`
  );

  const unreadMessagesSnapshot = await get(channelMessagesRed);
  const unreadMessagesData = unreadMessagesSnapshot.val();
  if (channelType === ChannelType.DIRECT) {
    await decrementUnreadDirectNotifications(username, unreadMessagesData);
  } else if (channelType === ChannelType.GROUP) {
    await decrementUnreadGroupNotifications(username, unreadMessagesData);
  }
  await decrementUnreadGlobalMessagesNotifications(
    username,
    unreadMessagesData
  );
  const updateObject = {
    [`users/${username}/unreadNotifications/${NotificationType.MESSAGE}/${channelId}`]:
      null,
  };

  await update(ref(db), updateObject);
};

export const listenToUnreadDirectNotifications = (
  username: string,
  callback: (count: number) => void
): Unsubscribe => {
  const unreadNotificationsRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.DIRECT}`
  );

  const unsubscribe = onValue(unreadNotificationsRef, snapshot => {
    if (snapshot.exists()) {
      const notifications = snapshot.val();
      callback(notifications);
    } else {
      callback(0);
    }
  });

  return unsubscribe;
};

export const incrementUnreadDirectNotifications = async (username: string) => {
  const unreadDirectRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.DIRECT}`
  );
  const unreadMessagesSnapshot = await get(unreadDirectRef);
  const unreadMessagesData = unreadMessagesSnapshot.val();
  const updatedNotifications = {
    [`users/${username}/unreadNotifications/${NotificationType.DIRECT}`]:
      unreadMessagesData ? unreadMessagesData + 1 : 1,
  };

  await update(ref(db), updatedNotifications);
};
export const decrementUnreadDirectNotifications = async (
  username: string,
  notificationCount: number
) => {
  const unreadDirectRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.DIRECT}`
  );
  const unreadMessagesSnapshot = await get(unreadDirectRef);
  const unreadMessagesData = unreadMessagesSnapshot.val();
  const updatedNotifications = {
    [`users/${username}/unreadNotifications/${NotificationType.DIRECT}`]:
      unreadMessagesData ? unreadMessagesData - notificationCount : 0,
  };

  await update(ref(db), updatedNotifications);
};

export const listenToUnreadGroupNotifications = (
  username: string,
  callback: (count: number) => void
): Unsubscribe => {
  const unreadNotificationsRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.GROUP}`
  );

  const unsubscribe = onValue(unreadNotificationsRef, snapshot => {
    if (snapshot.exists()) {
      const notifications = snapshot.val();
      callback(notifications);
    } else {
      callback(0);
    }
  });

  return unsubscribe;
};

export const incrementUnreadGroupNotifications = async (username: string) => {
  const unreadDirectRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.GROUP}`
  );
  const unreadMessagesSnapshot = await get(unreadDirectRef);
  const unreadMessagesData = unreadMessagesSnapshot.val();
  const updatedNotifications = {
    [`users/${username}/unreadNotifications/${NotificationType.GROUP}`]:
      unreadMessagesData ? unreadMessagesData + 1 : 1,
  };

  await update(ref(db), updatedNotifications);
};

export const decrementUnreadGroupNotifications = async (
  username: string,
  notificationCount: number
) => {
  const unreadDirectRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.GROUP}`
  );
  const unreadMessagesSnapshot = await get(unreadDirectRef);
  const unreadMessagesData = unreadMessagesSnapshot.val();
  const updatedNotifications = {
    [`users/${username}/unreadNotifications/${NotificationType.GROUP}`]:
      unreadMessagesData ? unreadMessagesData - notificationCount : 0,
  };

  await update(ref(db), updatedNotifications);
};

export const listenToUnreadGlobalMessagesNotifications = (
  username: string,
  callback: (count: number) => void
): Unsubscribe => {
  const unreadNotificationsRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.GLOBAL_MESSAGES}`
  );

  const unsubscribe = onValue(unreadNotificationsRef, snapshot => {
    if (snapshot.exists()) {
      const notifications = snapshot.val();
      callback(notifications);
    } else {
      callback(0);
    }
  });

  return unsubscribe;
};

export const incrementUnreadGlobalMessagesNotifications = async (
  username: string
) => {
  const unreadDirectRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.GLOBAL_MESSAGES}`
  );
  const unreadMessagesSnapshot = await get(unreadDirectRef);
  const unreadMessagesData = unreadMessagesSnapshot.val();
  const updatedNotifications = {
    [`users/${username}/unreadNotifications/${NotificationType.GLOBAL_MESSAGES}`]:
      unreadMessagesData ? unreadMessagesData + 1 : 1,
  };

  await update(ref(db), updatedNotifications);
};

export const decrementUnreadGlobalMessagesNotifications = async (
  username: string,
  notificationCount: number
) => {
  const unreadDirectRef = ref(
    db,
    `users/${username}/unreadNotifications/${NotificationType.GLOBAL_MESSAGES}`
  );
  const unreadMessagesSnapshot = await get(unreadDirectRef);
  const unreadMessagesData = unreadMessagesSnapshot.val();
  const updatedNotifications = {
    [`users/${username}/unreadNotifications/${NotificationType.GLOBAL_MESSAGES}`]:
      unreadMessagesData ? unreadMessagesData - notificationCount : 0,
  };

  await update(ref(db), updatedNotifications);
};
