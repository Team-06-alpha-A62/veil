import {
  equalTo,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  update,
} from 'firebase/database';
import { db } from '../config/firebase.config.ts';
import { Note } from '../models/Note.ts';
import { transformNoteData } from '../utils/TransformDataHelpers.ts';

export const createNote = async (
  title: string,
  username: string,
  label: string
): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newNote: Record<string, any> = {
    title,
    username,
    label,
    createdOn: Date.now(),
  };

  const result = await push(ref(db, 'notes'), newNote);
  const newNoteId = result.key as string;

  const updateObject = {
    [`notes/${newNoteId}/id`]: newNoteId,
    [`users/${username}/notes/${newNoteId}`]: true,
  };

  await update(ref(db), updateObject);
  return newNoteId;
};

export const deleteNote = async (
  noteHandle: string,
  userHandle: string
): Promise<void> => {
  const updateObject = {
    [`notes/${noteHandle}`]: null,
    [`users/${userHandle}/notes/${noteHandle}`]: null,
  };

  await update(ref(db), updateObject);
};

export const getNoteByHandle = async (noteHandle: string): Promise<Note> => {
  const snapshot = await get(ref(db, `notes/${noteHandle}`));
  if (!snapshot.exists()) throw new Error('Could not find note.');

  const noteData = transformNoteData(snapshot.val());
  return noteData;
};

export const getUserNotes = async (username: string): Promise<Note[]> => {
  const snapshot = await get(
    query(ref(db, 'notes'), orderByChild('username'), equalTo(username))
  );
  if (!snapshot.exists()) return [];

  const notesData = snapshot.val();

  const transformedNotesData: Note[] = Object.values(notesData).map(note =>
    transformNoteData(note as Note)
  );

  return transformedNotesData;
};

export const updateNote = async (
  noteId: string,
  updatedFields: Partial<Note>
) => {
  await update(ref(db, `notes/${noteId}`), updatedFields);
};

export const subscribeToNote = (
  noteHandle: string,
  callback: (note: Note) => void
): (() => void) => {
  const noteRef = ref(db, `notes/${noteHandle}`);
  return onValue(noteRef, snapshot => {
    if (snapshot.exists()) {
      const noteData = transformNoteData(snapshot.val());
      callback(noteData);
    }
  });
};

export const subscribeToUserNotes = (
  username: string,
  callback: (notes: Note[]) => void
): (() => void) => {
  const userNotesRef = query(
    ref(db, 'notes'),
    orderByChild('username'),
    equalTo(username)
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSnapshot = (snapshot: any) => {
    if (snapshot.exists()) {
      const notesData = snapshot.val();
      const transformedNotesData: Note[] = Object.values(notesData).map(note =>
        transformNoteData(note as Note)
      );
      callback(transformedNotesData);
    } else {
      callback([]); // No notes found
    }
  };

  return onValue(userNotesRef, handleSnapshot);
};
