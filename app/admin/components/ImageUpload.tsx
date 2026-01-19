'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  currentImage, 
  onImageChange, 
  label = 'Image',
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onImageChange(response.url);
          setUploading(false);
          setProgress(100);
        } else {
          setError('Upload failed');
          setUploading(false);
        }
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed');
        setUploading(false);
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    } catch (err) {
      setError('Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <label className='text-white text-sm font-bold'>{label}</label>
      
      {/* Current Image Preview */}
      {currentImage && (
        <div className='relative w-full h-48 bg-neutral-800 rounded overflow-hidden'>
          <Image
            src={currentImage}
            alt={label}
            fill
            className='object-contain'
            unoptimized
          />
        </div>
      )}

      {/* Upload Button */}
      <div className='flex items-center gap-3'>
        <label className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition-colors'>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileSelect}
            disabled={uploading}
            className='hidden'
          />
          {uploading ? 'Uploading...' : 'Choose Image'}
        </label>
        
        {currentImage && (
          <span className='text-neutral-400 text-sm'>or select new image</span>
        )}
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className='w-full bg-neutral-800 rounded h-2 overflow-hidden'>
          <div
            className='bg-blue-600 h-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className='text-red-400 text-sm'>{error}</p>
      )}

      {/* File Info */}
      <p className='text-neutral-500 text-xs'>
        Max size: {maxSizeMB}MB. Supported: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
}
