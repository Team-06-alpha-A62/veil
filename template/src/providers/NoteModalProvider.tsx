import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Note } from '../models/Note';
import { getNoteByHandle } from '../services/notes.service.ts';

interface NoteModalContextType {
  note: Note | null;
  isOpen: boolean;
  openModal: (note: Note) => void;
  closeModal: () => void;
  modalPosition: { x: number; y: number };
  setModalPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}

const NoteModalContext = createContext<NoteModalContextType | undefined>(
  undefined
);

export const NoteModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [note, setNote] = useState<Note | null>(null);
  const [openedNoteId, setOpenedNoteId] = useState<string>(
    localStorage.getItem('openedModalId') || ''
  );
  const [isOpen, setIsOpen] = useState<boolean>(
    JSON.parse(localStorage.getItem('isNoteOpen') || '')
  );
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>(
    JSON.parse(localStorage.getItem('modalPosition') || '')
  );
  useEffect(() => {
    const fetchNote = async () => {
      const note = await getNoteByHandle(openedNoteId);
      setNote(note);
    };
    fetchNote();
  }, [openedNoteId]);

  useEffect(() => {
    if (isOpen && note) {
      localStorage.setItem('openedModalId', note.id);
      localStorage.setItem('isNoteOpen', JSON.stringify(true));
    }
  }, [note, isOpen]);

  const openModal = (note: Note) => {
    setNote(note);
    setIsOpen(true);
    setOpenedNoteId(note!.id);
  };

  const closeModal = () => {
    localStorage.setItem('isNoteOpen', JSON.stringify(false));
    localStorage.removeItem('openedModalId');

    setNote(null);
    setIsOpen(false);
  };

  return (
    <NoteModalContext.Provider
      value={{
        note,
        isOpen,
        openModal,
        closeModal,
        modalPosition,
        setModalPosition,
      }}
    >
      {children}
    </NoteModalContext.Provider>
  );
};

export const useNoteModal = () => {
  const context = useContext(NoteModalContext);
  if (context === undefined) {
    throw new Error('useNoteModal must be used within a NoteModalProvider');
  }
  return context;
};
