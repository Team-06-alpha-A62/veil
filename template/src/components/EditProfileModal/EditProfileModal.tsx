import React, { useState, useEffect } from 'react';
import { UserStatus } from '../../enums/UserStatus';
import DragZone from '../DragZone/DragZone';
import {
  updateUserProfile,
  getUserByHandle,
} from '../../services/user.service';
import { FaPencilAlt, FaLock } from 'react-icons/fa';
import { UserData } from '../../models/UserData';
import { uploadImage } from '../../services/storage.service';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';
import { useTheme } from '../../providers/ThemeProvider';
import { themeOptions } from '../../data/themeData.ts';
import { FaCheck } from 'react-icons/fa6';

interface EditProfileModalProps {
  username: string;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserData>) => void;
}

const statusOptions = [
  {
    label: 'Online',
    value: UserStatus.ONLINE,
    color: 'bg-green-500',
    description: 'You are online.',
  },
  {
    label: 'Away',
    value: UserStatus.AWAY,
    color: 'bg-yellow-500',
    description: 'You are idle.',
  },
  {
    label: 'Do Not Disturb',
    value: UserStatus.BUSY,
    color: 'bg-red-500',
    description: 'You will not receive any notifications.',
  },
  {
    label: 'Offline',
    value: UserStatus.OFFLINE,
    color: 'bg-gray-500',
    description: 'You appear offline.',
  },
];

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  username,
  onClose,
  onSave,
}) => {
  const { theme, changeTheme } = useTheme();
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserByHandle(username);
        setUserData(data);
        setNewAvatarUrl(data.avatarUrl || null);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchData();
  }, [username]);

  const handleSaveChanges = async () => {
    try {
      let updatedAvatarUrl = newAvatarUrl;

      if (imageFile) {
        updatedAvatarUrl = await uploadImage(imageFile);
        setNewAvatarUrl(updatedAvatarUrl);
      }

      const updatedProfile: Partial<UserData> = {
        avatarUrl: updatedAvatarUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        status: userData.status,
      };

      await updateUserProfile(username, updatedProfile);
      onSave(updatedProfile);
      onClose();
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setNewAvatarUrl(previewUrl);
  };
  const sortedThemeOptions = themeOptions.sort((a, b) => {
    const aLocked = userData.lockedThemes?.includes(a.value);
    const bLocked = userData.lockedThemes?.includes(b.value);
    return (aLocked ? 1 : 0) - (bLocked ? 1 : 0);
  });
  return (
    <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-300 bg-opacity-75 z-10">
      <div className="relative bg-base-100 flex flex-col gap-5 rounded-3xl p-6 shadow-lg  max-w-4xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          &times;
        </button>

        <div className="flex p-4">
          <div className="flex border-r pr-5 border-opacity-40 flex-col space-y-4 w-1/2">
            <div className="relative mb-4 flex flex-col items-start">
              {!isEditingAvatar ? (
                <div className="relative">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt="User Avatar"
                      className="w-36 h-36 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-neutral-content bg-neutral flex items-center justify-center w-36 h-36 rounded-full  text-2xl">
                      {userData.username?.[0].toUpperCase()}
                    </span>
                  )}
                  <button
                    onClick={() => setIsEditingAvatar(true)}
                    className="absolute bottom-2 right-2 bg-base-300 p-2 rounded-full"
                  >
                    <FaPencilAlt className="text-primary" />
                  </button>
                </div>
              ) : (
                <div className="relative flex flex-col items-center">
                  <DragZone
                    handleFileChange={handleFileChange}
                    width={144}
                    height={144}
                    imageUrl={newAvatarUrl || userData.avatarUrl || ''}
                    round={true}
                  />
                  <button
                    className="absolute -bottom-6 text-error text-sm"
                    onClick={() => {
                      setIsEditingAvatar(false);
                      setImageFile(null);
                      setNewAvatarUrl(userData.avatarUrl || null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              className="input input-bordered bg-base-200 rounded-full w-full"
              value={userData.firstName || ''}
              onChange={e =>
                setUserData(prev => ({ ...prev, firstName: e.target.value }))
              }
              placeholder="First Name"
            />
            <input
              type="text"
              className="input input-bordered  bg-base-200 rounded-full w-full"
              value={userData.lastName || ''}
              onChange={e =>
                setUserData(prev => ({ ...prev, lastName: e.target.value }))
              }
              placeholder="Last Name"
            />
            <input
              type="text"
              className="input input-bordered  bg-base-200 rounded-full w-full"
              value={userData.phoneNumber || ''}
              onChange={e =>
                setUserData(prev => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              placeholder="Phone Number"
            />
          </div>

          <div className="flex flex-col pl-5 space-y-4 w-1/3">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Change Status</h3>
              <div className="space-y-3">
                {statusOptions.map(option => (
                  <div
                    key={option.value}
                    className="relative flex w-48 items-center justify-between p-3 bg-base-200 rounded-full cursor-pointer"
                    onClick={() =>
                      setUserData(prev => ({ ...prev, status: option.value }))
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <UserStatusIndicator
                        status={option.value}
                        absolute={false}
                      />
                      <span>{option.label}</span>
                    </div>
                    {userData.status === option.value && (
                      <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn rounded-full ">
                Theme
                <svg
                  width="12px"
                  height="12px"
                  className="inline-block h-2 w-2 fill-current opacity-60"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2048 2048"
                >
                  <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content bg-base-300 overflow-y-scroll h-64 rounded-box z-[1] w-52 p-2 shadow-2xl"
              >
                {sortedThemeOptions.map(option => (
                  <li
                    key={option.value}
                    className={`flex items-center px-2 py-1 bg-base-300 text-base-content rounded-lg ${
                      userData.lockedThemes?.includes(option.value)
                        ? 'cursor-not-allowed  justify-between'
                        : 'cursor-pointer justify-between'
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller btn btn-sm btn-block disabled:bg-base-300 btn-ghost justify-start"
                      aria-label={option.label}
                      value={option.value}
                      checked={theme === option.value}
                      onChange={() =>
                        !userData.lockedThemes?.includes(option.value) &&
                        changeTheme(option.value)
                      }
                      disabled={userData.lockedThemes?.includes(option.value)}
                    />

                    {userData.lockedThemes?.includes(option.value) && (
                      <FaLock className="ml-2 text-gray-500" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            className="text-sm bg-error text-white px-4 py-2 rounded-full"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="text-sm bg-success text-white px-4 py-2 rounded-full"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
