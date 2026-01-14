"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Mail, Calendar, X, Star, Gift } from "lucide-react";
import { toast } from "sonner";

interface NotificationPreferences {
  emailNotifications: {
    bookingConfirmation: boolean;
    eventReminders: boolean;
    eventCancellation: boolean;
    newReviews: boolean;
    promotionalEmails: boolean;
  };
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: {
      bookingConfirmation: true,
      eventReminders: true,
      eventCancellation: true,
      newReviews: true,
      promotionalEmails: false,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPreferences = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/notification-preferences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.data);
      }
    } catch (error) {
      // Silently fail - preferences will use defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleToggle = (key: keyof NotificationPreferences["emailNotifications"]) => {
    setPreferences({
      ...preferences,
      emailNotifications: {
        ...preferences.emailNotifications,
        [key]: !preferences.emailNotifications[key],
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/notification-preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(preferences),
        }
      );

      if (response.ok) {
        toast.success("Notification preferences saved successfully!");
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      toast.error("Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const notificationOptions = [
    {
      key: "bookingConfirmation" as const,
      icon: Calendar,
      title: "Booking Confirmations",
      description: "Receive confirmation emails when you book an event",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      key: "eventReminders" as const,
      icon: Bell,
      title: "Event Reminders",
      description: "Get reminded 24 hours before your upcoming events",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      key: "eventCancellation" as const,
      icon: X,
      title: "Event Cancellations",
      description: "Notifications when an event you're attending is cancelled",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    {
      key: "newReviews" as const,
      icon: Star,
      title: "New Reviews",
      description: "Get notified when someone reviews your event (hosts only)",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      key: "promotionalEmails" as const,
      icon: Gift,
      title: "Promotional Emails",
      description: "Receive updates about new features, events, and special offers",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Notification Settings</h1>
          <p className="text-gray-300">
            Manage how and when you receive notifications from Hypehouse
          </p>
        </div>

        {/* Email Notifications Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Email Notifications</h2>
              <p className="text-gray-300 text-sm">Choose which emails you'd like to receive</p>
            </div>
          </div>

          <div className="space-y-4">
            {notificationOptions.map((option) => {
              const Icon = option.icon;
              const isEnabled = preferences.emailNotifications[option.key];

              return (
                <div
                  key={option.key}
                  className="flex items-start justify-between p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${option.bgColor}`}>
                      <Icon className={`w-5 h-5 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(option.key)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      isEnabled
                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                        : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        isEnabled ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
          <p className="text-blue-200 text-sm">
            <strong>Note:</strong> Some critical notifications (like event cancellations)
            may still be sent even if you opt out, to ensure you don't miss important
            updates about events you've already booked.
          </p>
        </div>
      </div>
    </div>
  );
}
