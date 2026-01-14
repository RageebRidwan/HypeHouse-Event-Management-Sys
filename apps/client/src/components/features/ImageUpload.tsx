"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export default function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WebP)");
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full h-64 rounded-2xl overflow-hidden group"
          >
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className={`
              relative w-full h-64 rounded-2xl border-2 border-dashed cursor-pointer
              backdrop-blur-xl bg-white/5 transition-all
              ${isDragging
                ? "border-purple-500 bg-purple-500/10 scale-105"
                : "border-white/20 hover:border-purple-500/50 hover:bg-white/10"
              }
            `}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className={`
                p-4 rounded-full transition-all
                ${isDragging ? "bg-purple-500/20 scale-110" : "bg-white/10"}
              `}>
                <Upload className={`
                  w-8 h-8 transition-colors
                  ${isDragging ? "text-purple-400" : "text-gray-400"}
                `} />
              </div>
              <div>
                <p className="text-lg font-medium text-white mb-1">
                  {isDragging ? "Drop your image here" : "Upload event image"}
                </p>
                <p className="text-sm text-gray-400">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, WebP up to {maxSize}MB
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
