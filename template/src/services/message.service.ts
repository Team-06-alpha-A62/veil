import { get, ref, update } from 'firebase/database';
import { Message } from '../models/Message.ts';
import { db } from '../config/firebase.config.ts';
import { v4 as uuidv4 } from 'uuid';
import { transformMessageData } from '../utils/TransformDataHelpers.ts';

export const createMessage = async (
  sender: string,
  channelId: string,
  content: string,
  media: string | undefined = ''
): Promise<Message> => {
  const messageId = uuidv4();

  const newMessage = {
    id: messageId,
    sender,
    channelId,
    content,
    media,
    sentAt: Date.now(),
  };

  const updateObject = {
    [`channels/${channelId}/messages/${messageId}`]: newMessage,
  };

  await update(ref(db), updateObject);

  return transformMessageData(newMessage);
};

export const getMessageByHandle = async (
  channelHandle: string,
  messageHandle: string
): Promise<Message> => {
  const messageSnapshot = await get(
    ref(db, `channels/${channelHandle}/messages/${messageHandle}`)
  );

  if (!messageSnapshot.exists()) throw new Error('Could not find messages.');

  const messageData = transformMessageData(messageSnapshot.val());
  return messageData;
};

export const getAllMessages = async (
  channelHandle: string
): Promise<Message[]> => {
  const snapshot = await get(ref(db, `channels/${channelHandle}/messages`));
  if (!snapshot.exists()) throw new Error('No messages found');

  const MessagesData = snapshot.val();
  const transformedMessagesData: Message[] = Object.values(MessagesData).map(
    message => transformMessageData(message as Message)
  );

  return transformedMessagesData;
};

export const deleteMessage = async (
  channelHandle: string,
  messageHandle: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelHandle}/messages/${messageHandle}`]: null,
  };

  await update(ref(db), updateObject);
};

export const editMessage = async (
  channelHandle: string,
  messageHandle: string,
  newContent: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelHandle}/messages/${messageHandle}/content`]: newContent,
    [`channels/${channelHandle}/messages/${messageHandle}/editedAt`]:
      Date.now(),
  };

  await update(ref(db), updateObject);
};

export const updateMessageReactions = async (
  channelId: string,
  messageId: string,
  username: string,
  emojiId: string
): Promise<void> => {
  const messageReactionsRef = ref(
    db,
    `channels/${channelId}/messages/${messageId}/reactions/${username}`
  );

  const snapshot = await get(messageReactionsRef);
  const currentReaction: string | null = snapshot.val() || null;

  let updateObject;

  if (currentReaction === emojiId) {
    updateObject = {
      [`channels/${channelId}/messages/${messageId}/reactions/${username}`]:
        null,
    };
  } else {
    updateObject = {
      [`channels/${channelId}/messages/${messageId}/reactions/${username}`]:
        emojiId,
    };
  }

  await update(ref(db), updateObject);
};
