"use client";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  label?: string;
  error?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  min,
  label,
  error,
}: DateTimePickerProps) {
  // Format current datetime for input min value
  const getMinDateTime = () => {
    if (min) return min;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/90 mb-2">
          {label}
        </label>
      )}
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={getMinDateTime()}
        className={`
          w-full px-4 py-3 rounded-xl
          backdrop-blur-xl bg-white/10 border
          ${error ? "border-red-500/50" : "border-white/20"}
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
          transition-all
          [color-scheme:dark]
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
