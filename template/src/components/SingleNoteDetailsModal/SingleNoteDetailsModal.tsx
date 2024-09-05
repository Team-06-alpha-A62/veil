import React, { useState, useEffect } from 'react';
import { useNoteModal } from '../../providers/NoteModalProvider.tsx';
import Draggable from 'react-draggable';
import { updateNote } from '../../services/notes.service.ts';
import { debounce } from 'lodash';
import dayjs from 'dayjs';

const SingleNoteDetailsModal: React.FC = () => {
  const { isOpen, note, closeModal } = useNoteModal();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagsInput, setTagsInput] = useState<string>('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setTags(note.tags);
    }
  }, [note]);

  const debouncedSave = debounce(() => {
    if (note) {
      updateNote(note.id, { title, content, tags });
    }
  }, 500);

  useEffect(() => {
    if (note) {
      debouncedSave();
    }
    // Cancel debounce on cleanup
    return () => {
      debouncedSave.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleRemoveTag = (tagIndex: number): void => {
    const updatedTags = tags.filter((_, index) => index !== tagIndex);
    setTags(updatedTags);
  };

  if (!isOpen || !note) return null;

  return (
    <Draggable handle=".handle">
      <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center z-10 pointer-events-none">
        <div className="relative w-1/5 h-auto bg-base-100 text-white rounded-3xl flex flex-col gap-5 pointer-events-auto shadow-lg">
          <div>
            <div
              className={`flex justify-end h-10 rounded-t-3xl ${note.label} handle`}
            >
              <button onClick={closeModal} className="px-4">
                &times;
              </button>
            </div>
            <div className="p-4">
              <input
                className="text-lg font-semibold bg-transparent focus:outline-none"
                type="text"
                name="title"
                id="title"
                autoFocus
                value={title}
                onChange={handleTitleChange}
                required
              />
              <p className="font-light text-sm opacity-50">
                Created:{' '}
                {dayjs(note.createdOn).format('D MMMM YYYY [at] HH:mm')}
              </p>
              <div className="mt-3">
                {tags.map((tag, index) => (
                  <div key={tag} className="mr-2 badge badge-primary">
                    <span>{tag}</span>
                    <span
                      className="ml-1 cursor-pointer"
                      onClick={() => handleRemoveTag(index)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="input bg-transparent input-sm flex-grow rounded-3xl border-none focus:outline-none"
                />
              </div>
            </div>

            <textarea
              autoFocus
              className="w-full bg-transparent focus:outline-none resize-none p-4"
              name="content"
              id="content"
              rows={8}
              value={content}
              onChange={handleContentChange}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default SingleNoteDetailsModal;
