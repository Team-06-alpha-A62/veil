import { useEffect, useState } from 'react';
import NoteComponent from '../NoteComponent/NoteComponent.tsx';
import { Note } from '../../models/Note.ts';
import NewNoteModal from '../NewNoteModal/NewNoteModal.tsx';
import { useAuth } from '../../providers/AuthProvider.tsx';
import {
  getUserNotes,
  subscribeToUserNotes,
} from '../../services/notes.service.ts';

const Notes: React.FC = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (currentUser.userData?.username) {
      const fetchNotes = async () => {
        const notesData = await getUserNotes(currentUser.userData!.username);
        setNotes(notesData);
      };

      fetchNotes();

      // Set up real-time subscription
      const unsubscribe = subscribeToUserNotes(
        currentUser.userData.username,
        setNotes
      );
      return () => unsubscribe();
    }
  }, [currentUser.userData!.username]);
  return (
    <div className="flex gap-10 rounded-3xl p-6 bg-opacity-50 h-full">
      <div className="flex flex-1 flex-col h-full">
        <header className="h-auto flex flex-shrink-0 flex-row-reverse justify-between pb-6">
          <NewNoteModal />
        </header>
        <main className="h-full flex flex-col gap-6">
          <div className="collapse  collapse-arrow bg-base-200">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              Pinned Notes
            </div>
            <div className="collapse-content">{/* <NoteComponent /> */}</div>
          </div>
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-medium">All Notes</div>
            <div className="collapse-content flex flex-wrap gap-6">
              {notes.map(note => (
                <NoteComponent key={note.id} note={note} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes;
