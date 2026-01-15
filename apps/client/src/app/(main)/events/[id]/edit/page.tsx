"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Users,
  DollarSign,
  Tag,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "../../../../../components/features/ImageUpload";
import DateTimePicker from "../../../../../components/ui/DateTimePicker";
import { FormInput } from "../../../../../components/features/FormInput";
import { SubmitButton } from "../../../../../components/features/SubmitButton";
import { useGetEventByIdQuery, useUpdateEventMutation } from "../../../../../store/api/eventsApi";
import type { UpdateEventInput } from "../../../../../types/event";
import { EVENT_TYPES } from "../../../../../lib/constants";
import { EventStatus } from "../../../../../types/event";

const STEPS = [
  { id: 1, title: "Basic Info", description: "Event essentials" },
  { id: 2, title: "Details", description: "Additional information" },
  { id: 3, title: "Media & Review", description: "Finalize your event" },
];

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: eventId } = use(params);
  const { data: eventData, isLoading: isLoadingEvent } = useGetEventByIdQuery(eventId);
  const [updateEvent, { isLoading }] = useUpdateEventMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UpdateEventInput>>({
    title: "",
    eventType: "",
    date: "",
    location: "",
    description: "",
    maxParticipants: 10,
    price: 0,
    latitude: undefined,
    longitude: undefined,
    tags: [],
    image: undefined,
    status: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");

  // Load existing event data
  useEffect(() => {
    if (eventData?.data) {
      const event = eventData.data;
      setFormData({
        title: event.title,
        eventType: event.eventType,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        description: event.description,
        maxParticipants: event.maxParticipants,
        price: event.price,
        latitude: event.latitude || undefined,
        longitude: event.longitude || undefined,
        tags: event.tags || [],
        image: undefined, // Don't set existing image, only new uploads
        status: event.status as EventStatus,
      });
    }
  }, [eventData]);

  const handleChange = (field: keyof UpdateEventInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title || formData.title.trim().length < 3) {
        newErrors.title = "Title must be at least 3 characters";
      }
      if (!formData.eventType) {
        newErrors.eventType = "Please select an event type";
      }
      if (!formData.date) {
        newErrors.date = "Please select a date and time";
      } else {
        const eventDate = new Date(formData.date);
        if (eventDate <= new Date()) {
          newErrors.date = "Event date must be in the future";
        }
      }
    }

    if (step === 2) {
      if (!formData.location || formData.location.trim().length < 3) {
        newErrors.location = "Location must be at least 3 characters";
      }
      if (!formData.description || formData.description.trim().length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
      if (!formData.maxParticipants || formData.maxParticipants < 1) {
        newErrors.maxParticipants = "Must have at least 1 participant";
      }
      if (formData.price !== undefined && formData.price < 0) {
        newErrors.price = "Price cannot be negative";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    try {
      await updateEvent({ id: eventId, data: formData as UpdateEventInput }).unwrap();
      toast.success("Event updated successfully!");
      router.push(`/events/${eventId}`);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update event");
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!eventData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-gray-300 mb-6">The event you're trying to edit doesn't exist</p>
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Edit Event</h1>
          <p className="text-gray-300">Update your event details</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all
                      ${
                        currentStep > step.id
                          ? "bg-green-500 text-white"
                          : currentStep === step.id
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-gray-400"
                      }
                    `}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p
                      className={`
                        text-sm font-medium
                        ${currentStep >= step.id ? "text-white" : "text-gray-400"}
                      `}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-4 rounded-full transition-all
                      ${currentStep > step.id ? "bg-green-500" : "bg-white/10"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                      <p className="text-gray-400 text-sm">Update the essentials</p>
                    </div>
                  </div>

                  <FormInput
                    label="Event Title"
                    icon={<FileText className="w-5 h-5" />}
                    type="text"
                    placeholder="Summer Beach Party 2025"
                    value={formData.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    error={errors.title}
                  />

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Event Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {EVENT_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleChange("eventType", type)}
                          className={`
                            px-4 py-2 rounded-xl font-medium transition-all
                            ${
                              formData.eventType === type
                                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }
                          `}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {errors.eventType && (
                      <p className="mt-2 text-sm text-red-400">{errors.eventType}</p>
                    )}
                  </div>

                  <DateTimePicker
                    label="Date & Time"
                    value={formData.date || ""}
                    onChange={(value) => handleChange("date", value)}
                    error={errors.date}
                  />
                </motion.div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-pink-500/20">
                      <FileText className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Event Details</h2>
                      <p className="text-gray-400 text-sm">Update event information</p>
                    </div>
                  </div>

                  <FormInput
                    label="Location"
                    icon={<MapPin className="w-5 h-5" />}
                    type="text"
                    placeholder="Miami Beach, FL"
                    value={formData.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    error={errors.location}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Latitude (Optional)"
                      type="number"
                      step="0.000001"
                      placeholder="25.7617"
                      value={formData.latitude || ""}
                      onChange={(e) =>
                        handleChange("latitude", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                    />
                    <FormInput
                      label="Longitude (Optional)"
                      type="number"
                      step="0.000001"
                      placeholder="-80.1918"
                      value={formData.longitude || ""}
                      onChange={(e) =>
                        handleChange("longitude", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your event in detail..."
                      value={formData.description || ""}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={4}
                      className={`
                        w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border
                        ${errors.description ? "border-red-500/50" : "border-white/20"}
                        text-white placeholder-gray-400 resize-none
                        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                        transition-all
                      `}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Max Participants"
                      icon={<Users className="w-5 h-5" />}
                      type="number"
                      min="1"
                      placeholder="50"
                      value={formData.maxParticipants || ""}
                      onChange={(e) =>
                        handleChange("maxParticipants", parseInt(e.target.value, 10))
                      }
                      error={errors.maxParticipants}
                    />
                    <FormInput
                      label="Price (USD)"
                      icon={<DollarSign className="w-5 h-5" />}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleChange("price", e.target.value ? parseFloat(e.target.value) : 0)
                      }
                      error={errors.price}
                    />
                  </div>

                  {formData.price && formData.price > 0 && (
                    <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <p className="text-sm text-purple-300">
                        <strong>Paid Event:</strong> Participants will be required to pay ${formData.price.toFixed(2)} via Stripe to join this event.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Event Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleChange("status", EventStatus.OPEN)}
                        className={`
                          px-4 py-2 rounded-xl font-medium transition-all
                          ${
                            formData.status === EventStatus.OPEN
                              ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }
                        `}
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("status", EventStatus.FULL)}
                        className={`
                          px-4 py-2 rounded-xl font-medium transition-all
                          ${
                            formData.status === EventStatus.FULL
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }
                        `}
                      >
                        Full
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("status", EventStatus.CANCELLED)}
                        className={`
                          px-4 py-2 rounded-xl font-medium transition-all
                          ${
                            formData.status === EventStatus.CANCELLED
                              ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }
                        `}
                      >
                        Cancelled
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("status", EventStatus.COMPLETED)}
                        className={`
                          px-4 py-2 rounded-xl font-medium transition-all
                          ${
                            formData.status === EventStatus.COMPLETED
                              ? "bg-gray-500 text-white shadow-lg shadow-gray-500/50"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }
                        `}
                      >
                        Completed
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Current: <span className="text-white font-medium">{formData.status}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Tags (Optional)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-lg bg-white/10 text-white border border-white/20 flex items-center gap-2"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Media & Review */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <Check className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Almost There!</h2>
                      <p className="text-gray-400 text-sm">Update image and review changes</p>
                    </div>
                  </div>

                  <ImageUpload
                    value={formData.image || null}
                    onChange={(file) => handleChange("image", file)}
                  />

                  {/* Event Preview */}
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Event Preview</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Title:</span>
                        <span className="text-white font-medium">{formData.title || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white font-medium">{formData.eventType || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white font-medium">{formData.location || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white font-medium">
                          {formData.date
                            ? new Date(formData.date).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-white font-medium">
                          {formData.maxParticipants || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white font-medium">
                          {formData.price === 0 ? "Free" : `$${formData.price}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <SubmitButton isLoading={isLoading}>
                  Update Event
                </SubmitButton>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
