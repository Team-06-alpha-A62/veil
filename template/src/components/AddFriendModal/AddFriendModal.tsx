import React, { useState, useRef, useEffect } from 'react';
import { sendFriendRequest } from '../../services/user.service';
import { useAuth } from '../../providers/AuthProvider';
interface AddFriendModalProps {
  onClose: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const handleSubmit = async () => {
    if (currentUser.userData!.username && username) {
      try {
        await sendFriendRequest(currentUser.userData!.username, username);
        alert('Friend request sent successfully!');
      } catch {
        alert('Failed to send friend request.');
      }
    }
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-200 bg-opacity-75 z-10">
      <div
        ref={modalRef}
        className="relative bg-base-300 p-6 rounded-3xl w-[600px] h-[200px]"
      >
        <button className="absolute top-5 right-5" onClick={onClose}>
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Add Friend</h2>
        <p className="text-gray-400 mb-4">
          You can add friends with their username.
        </p>
        <div className="flex items-center space-x-4 p-2 rounded-3xl bg-base-200 bg-opacity-50">
          <div className="flex w-full items-center rounded-lg">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="flex-1 px-4 py-2 rounded-3xl input-sm bg-transparent focus:border-transparent focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-primary btn-sm text-center text-white rounded-3xl hover:bg-primary-focus"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
