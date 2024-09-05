import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { subscribeToNote } from '../../services/notes.service.ts';
import { Note } from '../../models/Note.ts';
import { useNoteModal } from '../../providers/NoteModalProvider.tsx';

const NoteComponent: React.FC<{ note: Note }> = ({ note }) => {
  const { isOpen, openModal, closeModal } = useNoteModal();
  const [noteData, setNoteData] = useState<Note>({
    id: note.id,
    title: note.title,
    createdOn: note.createdOn,
    tags: note.tags,
    username: note.username,
    content: note.content || '',
    label: note.label,
  });

  useEffect(() => {
    return subscribeToNote(note.id, (updatedNote: Note) => {
      setNoteData({
        ...noteData,
        title: updatedNote.title,
        content: updatedNote.content || '', // Handle null content
        tags: updatedNote.tags,
        createdOn: updatedNote.createdOn,
        label: updatedNote.label,
      });
    });
  }, [note.id]);

  return (
    <div
      className={`w-96 h-96 ${note.label} rounded-3xl p-6 text-white hover:bg-opacity-90 active:bg-opacity-75 cursor-pointer`}
      onClick={() => openModal(note)}
    >
      <h2 className="text-xl font-bold">{note.title}</h2>
      <div>
        {note.tags.map(tag => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
      <div>
        {noteData.content!.length > 40
          ? `${note.content!.slice(0, 40)}...`
          : note.content}
      </div>
    </div>
  );
};

export default NoteComponent;
