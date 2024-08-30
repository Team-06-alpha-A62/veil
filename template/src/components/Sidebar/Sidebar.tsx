import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import {
  acceptFriendRequest,
  declineFriendRequest,
  userStatusListener,
  listenToFriendsChange,
} from '../../services/user.service';
import { UserStatus } from '../../enums/UserStatus';
import PendingFriendCard from '../PendingFriendCard/PendingFriendCard';
import FriendCard from '../FriendCard/FriendCard';
import { Friend } from '../../models/Friend';
import AddFriendModal from '../AddFriendModal/AddFriendModal';
import { Channel } from '../../models/Channel';
import {
  createChannel,
  listenToChannelChange,
} from '../../services/channel.service';
import { ChannelType } from '../../enums/ChannelType';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('Online');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [friendsData, setFriendsData] = useState<Friend[]>([]);
  const [pendingFriendsData, setPendingFriendsData] = useState<Friend[]>([]);
  const [listeners, setListeners] = useState<Array<() => void>>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userDirectChannels, setUserDirectChannels] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();

  useEffect(() => {
    return listenToChannelChange(
      currentUser.userData!.username,
      (channels: Channel[]) => {
        setUserDirectChannels(
          channels
            .filter(channel => channel.type === ChannelType.DIRECT)
            .reduce((acc, channel) => {
              const friendUsername = Object.keys(channel.participants).find(
                participant => participant !== currentUser.userData!.username
              );
              if (friendUsername) {
                acc[friendUsername] = channel.id;
              }

              return acc;
            }, {} as Record<string, string>)
        );
      }
    );
  }, [currentUser]);

  const handleOpenChannelClick = async (friendUsername: string) => {
    if (userDirectChannels[friendUsername]) {
      navigate(`/app/chats/${userDirectChannels[friendUsername]}`);
    } else {
      const myUsername = currentUser.userData!.username;

      const channelId = await createChannel(
        null,
        myUsername,
        [friendUsername, myUsername],
        ChannelType.DIRECT,
        true
      );
      navigate(`/app/chats/${channelId}`);
    }
  };

  useEffect(() => {
    const handleFriendsChange = (
      friends: Friend[],
      pendingFriends: Friend[]
    ) => {
      setFriendsData(friends);
      setPendingFriendsData(pendingFriends);

      const newListeners: Array<() => void> = friends.map(friend => {
        const cleanupListener = userStatusListener(
          friend.username,
          newStatus => {
            setFriendsData(prevFriends =>
              prevFriends.map(f =>
                f.username === friend.username
                  ? { ...f, status: newStatus as UserStatus }
                  : f
              )
            );
          }
        );
        return cleanupListener;
      });

      setListeners(newListeners);
    };

    const cleanupFriendsListener = listenToFriendsChange(
      currentUser.userData!.username,
      handleFriendsChange
    );

    return () => {
      cleanupFriendsListener();
      listeners.forEach(cleanup => cleanup());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleAccept = async (username: string) => {
    try {
      await acceptFriendRequest(currentUser.userData!.username, username);

      const acceptedFriend = pendingFriendsData.find(
        friend => friend.username === username
      );

      if (acceptedFriend) {
        setFriendsData(prevFriends => [...prevFriends, acceptedFriend]);
        setPendingFriendsData(prevPending =>
          prevPending.filter(friend => friend.username !== username)
        );
      }
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleDecline = async (username: string) => {
    try {
      await declineFriendRequest(currentUser.userData!.username, username);

      setPendingFriendsData(prevPending =>
        prevPending.filter(friend => friend.username !== username)
      );
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredFriends = useMemo(() => {
    return selectedCategory === 'Pending'
      ? pendingFriendsData.filter(friend =>
          friend.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : friendsData.filter(friend => {
          const matchesCategory =
            selectedCategory === 'All' ||
            friend.status.toUpperCase() === selectedCategory.toUpperCase();
          const matchesSearch = friend.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });
  }, [selectedCategory, pendingFriendsData, friendsData, searchQuery]);
  // if (isLoading) {
  //   return <div className="text-center text-white">Loading...</div>;
  // }

  return (
    <div className="basis-1/5 rounded-3xl p-6 bg-base-300 bg-opacity-50 flex-shrink-0 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {['Online', 'All', 'Pending'].map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                selectedCategory === category
                  ? 'bg-primary'
                  : 'bg-gray-700 bg-opacity-50'
              } hover:bg-gray-600 transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          className="text-sm font-semibold px-3 py-1 rounded-full bg-success hover:bg-accent-focus transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          Add Friend
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary text-white"
        />
      </div>

      <div className="max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
        {filteredFriends.length ? (
          filteredFriends.map(friend =>
            selectedCategory === 'Pending' ? (
              <PendingFriendCard
                key={friend.id}
                pendingFriend={friend}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ) : (
              <FriendCard
                key={friend.id}
                friend={friend}
                handleOpenChannelClick={handleOpenChannelClick}
              />
            )
          )
        ) : (
          <div className="text-center text-gray-400">No friends found.</div>
        )}
      </div>

      {isModalOpen && <AddFriendModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Sidebar;
