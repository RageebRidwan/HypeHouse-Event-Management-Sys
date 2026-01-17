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

  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
  const toDatetimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      // Get local datetime string in ISO format then slice to datetime-local format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return isoString;
    }
  };

  // Convert datetime-local format to ISO string preserving the local time
  const toISOString = (datetimeLocal: string): string => {
    if (!datetimeLocal) return '';
    // Create a date object from the datetime-local value
    // datetime-local doesn't include timezone, so we need to be explicit
    // We want to preserve the user's selected time in their local timezone
    const date = new Date(datetimeLocal);
    return date.toISOString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const datetimeLocalValue = e.target.value;
    const isoValue = toISOString(datetimeLocalValue);
    onChange(isoValue);
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
        value={toDatetimeLocal(value)}
        onChange={handleChange}
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
