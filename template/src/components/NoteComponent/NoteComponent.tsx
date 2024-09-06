import React, { useEffect, useState, MouseEvent } from 'react';
import { deleteNote, subscribeToNote } from '../../services/notes.service.ts';
import { Note } from '../../models/Note.ts';
import { useNoteModal } from '../../providers/NoteModalProvider.tsx';
import { TiPin, TiPinOutline } from 'react-icons/ti';
import { FaTrashAlt } from 'react-icons/fa';

const NoteComponent: React.FC<{
  note: Note;
  pinnedNotes: Note[];
  setPinnedNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}> = ({ note, pinnedNotes, setPinnedNotes }) => {
  const { isOpen, openModal, closeModal } = useNoteModal();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [noteData, setNoteData] = useState<Note>({
    id: note.id,
    title: note.title,
    createdOn: note.createdOn,
    username: note.username,
    content: note.content || '',
    label: note.label,
  });

  useEffect(() => {
    return subscribeToNote(note.id, (updatedNote: Note) => {
      setNoteData({
        ...updatedNote,
      });
    });
  }, [note.id]);

  useEffect(() => {
    localStorage.setItem('pinnedNotes', JSON.stringify(pinnedNotes));
  }, [pinnedNotes]);

  const handlePinClick = (event: MouseEvent, note: Note): void => {
    event.stopPropagation();
    setPinnedNotes(prevNotes => [...prevNotes, note]);
  };

  const handleUnpinClick = (event: MouseEvent, note: Note): void => {
    event.stopPropagation();
    setPinnedNotes(prevNotes => prevNotes.filter(n => n.id !== note.id));
  };

  const handleDeleteClick = async (
    event: MouseEvent,
    note: Note
  ): Promise<void> => {
    event.stopPropagation();
    if (pinnedNotes?.find(n => n.id === note.id)) {
      const updatedPinnedNotes = pinnedNotes.filter(n => n.id !== note.id);
      setPinnedNotes(updatedPinnedNotes);
      localStorage.setItem('pinnedNotes', JSON.stringify(updatedPinnedNotes));
    }
    if (isOpen) {
      closeModal();
    }
    await deleteNote(note.id, note.username);
  };

  return (
    <div
      className={`relative w-80 h-80 ${note.label} rounded-3xl p-6 text-white hover:bg-opacity-90 active:bg-opacity-75 cursor-pointer`}
      onClick={() => openModal(note)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-xl font-bold">{note.title}</h2>
      <div>
        {noteData.content!.length > 150
          ? `${note.content!.slice(0, 150)}...`
          : note.content}
      </div>
      {isHovered && (
        <div className="absolute bottom-5 right-5 flex gap-4 items-center">
          {pinnedNotes?.find(n => n.id === note.id) ? (
            <TiPin
              size={25}
              className="cursor-pointer"
              onClick={event => handleUnpinClick(event, note)}
            />
          ) : (
            <TiPinOutline
              size={25}
              className="cursor-pointer"
              onClick={event => handlePinClick(event, note)}
            />
          )}
          <FaTrashAlt
            className="cursor-pointer"
            onClick={event => handleDeleteClick(event, note)}
          />
        </div>
      )}
    </div>
  );
};

export default NoteComponent;
