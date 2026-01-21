"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Camera, Save, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetUserProfileQuery, useUpdateUserProfileMutation, useUploadProfileImageMutation, useUpdateProfileExtendedMutation } from "../../../../store/api/usersApi";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { updateUser } from "../../../../store/slices/authSlice";

export default function ProfileEditPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current profile
  const { data, isLoading } = useGetUserProfileQuery(currentUser?.id || "", {
    skip: !currentUser?.id,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadProfileImageMutation();
  const [updateProfileExtended, { isLoading: isUpdatingExtended }] = useUpdateProfileExtendedMutation();

  const profile = data?.data;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    interests: [] as string[],
  });

  const [interestInput, setInterestInput] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [wantsToRemovePhoto, setWantsToRemovePhoto] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        bio: profile.bio || "",
        location: profile.location || "",
        interests: profile.interests || [],
      });
      if (profile.avatar) {
        setImagePreview(profile.avatar);
      }
    }
  }, [profile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setWantsToRemovePhoto(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(profile?.avatar || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (!trimmed) return;

    if (formData.interests.length >= 10) {
      toast.error("Maximum 10 interests allowed");
      return;
    }

    if (formData.interests.includes(trimmed)) {
      toast.error("Interest already added");
      return;
    }

    setFormData({
      ...formData,
      interests: [...formData.interests, trimmed],
    });
    setInterestInput("");
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.id) return;

    try {
      let avatarToUpdate: string | null | undefined = undefined;

      // Upload image first if selected
      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile).unwrap();
        avatarToUpdate = uploadResult.data.imageUrl;
        toast.success("Profile image uploaded successfully");
      } else if (avatarUrl.trim()) {
        // Use the provided URL
        avatarToUpdate = avatarUrl.trim();
      } else if (wantsToRemovePhoto) {
        // User wants to remove the avatar
        avatarToUpdate = null;
      }

      // Update profile with extended data
      const updateData: Record<string, unknown> = {
        name: formData.name,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        interests: formData.interests.length > 0 ? formData.interests : undefined,
      };

      // Only include avatar if it's being changed
      if (avatarToUpdate !== undefined) {
        updateData.avatar = avatarToUpdate;
      }

      await updateProfileExtended(updateData as any).unwrap();

      // Update auth state with new profile data
      const newAvatar = avatarToUpdate !== undefined ? avatarToUpdate : profile?.avatar;
      dispatch(updateUser({
        name: formData.name,
        avatar: newAvatar || undefined,
        bio: formData.bio,
      }));

      toast.success("Profile updated successfully");
      router.push(`/profile/${currentUser.id}`);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const bioCharCount = formData.bio.length;
  const bioMaxChars = 500;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Header */}
      <div className="backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-gray-300 mt-1">Update your profile information</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Profile Picture</h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Image Preview */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-1">
                  {imagePreview ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {getInitials(formData.name || profile.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Remove button */}
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Change Photo
                      </>
                    )}
                  </button>

                  {(imagePreview || (profile?.avatar && !wantsToRemovePhoto)) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        setAvatarUrl("");
                        setWantsToRemovePhoto(true);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition-all disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                      Remove Photo
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-400 mt-3">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
                <p className="text-sm text-gray-400">
                  Recommended: Square image, at least 400x400px
                </p>

                {/* Or use URL */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-300 mb-2">Or paste image URL:</p>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => {
                      setAvatarUrl(e.target.value);
                      if (e.target.value.trim()) {
                        setImagePreview(e.target.value.trim());
                        setSelectedFile(null);
                        setWantsToRemovePhoto(false);
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={2}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
                {formData.name.length > 0 && formData.name.length < 2 && (
                  <p className="text-sm text-red-400 mt-1">Name must be at least 2 characters</p>
                )}
              </div>

              {/* Email (disabled) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => {
                    if (e.target.value.length <= bioMaxChars) {
                      setFormData({ ...formData, bio: e.target.value });
                    }
                  }}
                  rows={4}
                  maxLength={bioMaxChars}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">Optional</p>
                  <p
                    className={`text-xs ${
                      bioCharCount >= bioMaxChars
                        ? "text-red-400"
                        : bioCharCount >= bioMaxChars * 0.9
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  >
                    {bioCharCount} / {bioMaxChars}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Location <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Dhaka, Bangladesh"
                />
                <p className="text-xs text-gray-500 mt-1">Required for hosting events</p>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Interests <span className="text-yellow-400">* (minimum 3)</span>
                </label>

                {/* Interest Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Type an interest and press Enter..."
                    maxLength={30}
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Interests List */}
                {formData.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 text-purple-200"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  {formData.interests.length} / 10 interests ({Math.max(0, 3 - formData.interests.length)} more needed)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdatingExtended || isUploading}
              className="px-6 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingExtended || isUploading || formData.name.length < 2}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
            >
              {isUpdatingExtended || isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
