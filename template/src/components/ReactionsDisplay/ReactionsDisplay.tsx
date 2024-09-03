import React from 'react';
import { Emoji } from 'emoji-picker-react';

interface ReactionsDisplayProps {
  reactions: Record<string, string>;
}

const ReactionsDisplay: React.FC<ReactionsDisplayProps> = ({ reactions }) => {
  const aggregatedReactions = Object.values(reactions).reduce(
    (acc: Record<string, number>, emojiId) => {
      if (!acc[emojiId]) {
        acc[emojiId] = 0;
      }
      acc[emojiId]++;
      return acc;
    },
    {}
  );

  return (
    <div className="flex space-x-2 mt-2 absolute  -top-3 left-2 transform translate-y-full">
      {Object.entries(aggregatedReactions).map(([emojiId, count]) => (
        <div
          key={emojiId}
          className="flex items-center space-x-1 bg-gray-600 rounded-full px-2 py-1 text-sm"
        >
          <Emoji unified={emojiId} size={16} />
          <span>{count}</span>
        </div>
      ))}
    </div>
  );
};

export default ReactionsDisplay;
