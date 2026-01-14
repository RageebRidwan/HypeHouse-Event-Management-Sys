"use client";

import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { EventFilters as Filters, EventStatus } from "../../types/event";
import { EVENT_TYPES } from "../../lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface EventFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClear: () => void;
}

export default function EventFilters({
  filters,
  onFilterChange,
  onClear,
}: EventFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    location: true,
    date: true,
    price: true,
    status: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  };

  const handleTypeToggle = (type: string) => {
    onFilterChange({
      ...filters,
      eventType: filters.eventType === type ? undefined : type,
    });
  };

  const handleLocationChange = (value: string) => {
    onFilterChange({ ...filters, location: value || undefined });
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    onFilterChange({ ...filters, [field]: value || undefined });
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    onFilterChange({ ...filters, [field]: numValue });
  };

  const handleStatusChange = (status: EventStatus) => {
    onFilterChange({
      ...filters,
      status: filters.status === status ? undefined : status,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.eventType ||
    filters.location ||
    filters.startDate ||
    filters.endDate ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.status;

  return (
    <div className="w-full space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onClear}
          className="w-full px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </motion.button>
      )}

      {/* Event Type Filter */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between text-white font-medium mb-3"
        >
          <span>Event Type</span>
          {expandedSections.type ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.type && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2"
            >
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${
                      filters.eventType === type
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Filter */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => toggleSection("location")}
          className="w-full flex items-center justify-between text-white font-medium mb-3"
        >
          <span>Location</span>
          {expandedSections.location ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location || ""}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date Range Filter */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => toggleSection("date")}
          className="w-full flex items-center justify-between text-white font-medium mb-3"
        >
          <span>Date Range</span>
          {expandedSections.date ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.date && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) => handleDateChange("startDate", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Filter */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-white font-medium mb-3"
        >
          <span>Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1">Min Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={filters.minPrice ?? ""}
                  onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Any"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Filter */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => toggleSection("status")}
          className="w-full flex items-center justify-between text-white font-medium mb-3"
        >
          <span>Status</span>
          {expandedSections.status ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.status && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2"
            >
              {Object.values(EventStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${
                      filters.status === status
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }
                  `}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
