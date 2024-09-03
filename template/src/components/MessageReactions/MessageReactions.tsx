import React from 'react';
import ReactionDisplay from '../ReactionsDisplay/ReactionsDisplay';

interface MessageReactionsProps {
  reactions: Record<string, string>;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions }) => {
  return (
    <div className="flex space-x-2 mt-2">
      {Object.entries(reactions).map(([username, unified]) => (
        <div key={username} className="flex items-center space-x-1">
          <ReactionDisplay unified={unified} />
          <span className="text-xs text-gray-400">{username}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageReactions;
