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
    <div className="flex space-x-1 mt-1 absolute bottom-[10px] left-0 transform translate-y-full">
      {Object.entries(aggregatedReactions).map(([emojiId, count]) => (
        <div
          key={emojiId}
          className="flex items-center space-x-1 bg-gray-500 rounded-full px-1 py-0.5 text-xs"
        >
          <Emoji unified={emojiId} size={12} />
          <span>{count}</span>
        </div>
      ))}
    </div>
  );
};

export default ReactionsDisplay;
