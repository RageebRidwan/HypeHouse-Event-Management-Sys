"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ParticipantUser } from "../../types/participant";

interface ParticipantAvatarsProps {
  participants: ParticipantUser[];
  maxDisplay?: number;
  onClick?: () => void;
}

export function ParticipantAvatars({
  participants,
  maxDisplay = 5,
  onClick,
}: ParticipantAvatarsProps) {
  const displayParticipants = participants.slice(0, maxDisplay);
  const remainingCount = Math.max(0, participants.length - maxDisplay);

  if (participants.length === 0) {
    return null;
  }

  return (
    <div
      className="flex items-center cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="flex -space-x-2">
        {displayParticipants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            {participant.avatar ? (
              <Image
                src={participant.avatar}
                alt={participant.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-purple-500 transition-transform group-hover:scale-110"
                title={participant.name}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full border-2 border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium transition-transform group-hover:scale-110"
                title={participant.name}
              >
                {participant.name.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>
        ))}

        {remainingCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: displayParticipants.length * 0.05 }}
            className="w-8 h-8 rounded-full border-2 border-purple-500 bg-purple-600/50 flex items-center justify-center text-white text-xs font-medium transition-transform group-hover:scale-110"
            title={`+${remainingCount} more`}
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>

      {onClick && (
        <span className="ml-3 text-sm text-gray-300 group-hover:text-purple-400 transition-colors">
          {participants.length === 1
            ? "1 participant"
            : `${participants.length} participants`}
        </span>
      )}
    </div>
  );
}
