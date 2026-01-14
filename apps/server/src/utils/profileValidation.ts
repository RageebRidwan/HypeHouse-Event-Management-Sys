export interface ProfileCompletionResult {
  isComplete: boolean;
  missing: string[];
  completionPercentage: number;
}

interface UserProfile {
  avatar: string | null;
  bio: string | null;
  location: string | null;
  interests: string[];
}

/**
 * Check if user profile meets hosting requirements
 * Requirements:
 * - Profile picture (avatar)
 * - Bio (at least 100 characters)
 * - Location
 * - At least 3 interests
 */
export function checkProfileCompletion(
  user: UserProfile
): ProfileCompletionResult {
  const missing: string[] = [];
  let completedFields = 0;
  const totalFields = 4;

  // Check avatar
  if (!user.avatar) {
    missing.push("Profile Picture");
  } else {
    completedFields++;
  }

  // Check bio (minimum 100 characters)
  if (!user.bio || user.bio.length < 100) {
    missing.push(
      user.bio
        ? `Bio (${user.bio.length}/100 characters)`
        : "Bio (minimum 100 characters)"
    );
  } else {
    completedFields++;
  }

  // Check location
  if (!user.location) {
    missing.push("Location");
  } else {
    completedFields++;
  }

  // Check interests (minimum 3)
  if (!user.interests || user.interests.length < 3) {
    missing.push(
      user.interests
        ? `Interests (${user.interests.length}/3 minimum)`
        : "Interests (3 minimum)"
    );
  } else {
    completedFields++;
  }

  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100
  );

  return {
    isComplete: missing.length === 0,
    missing,
    completionPercentage,
  };
}
