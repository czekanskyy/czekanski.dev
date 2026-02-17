'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
  acceptVideo?: boolean;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export default function ImageUpload({ currentImage, onImageChange, label = 'Image', maxSizeMB, acceptVideo = false }: ImageUploadProps) {
  const effectiveMaxSize = maxSizeMB ?? (acceptVideo ? 50 : 5);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > effectiveMaxSize * 1024 * 1024) {
      setError(`File size must be less than ${effectiveMaxSize}MB`);
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !(acceptVideo && isVideo)) {
      setError(acceptVideo ? 'File must be an image or video' : 'File must be an image');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

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
    <div className='space-y-3'>
      <Label>{label}</Label>

      {/* Current Preview */}
      {currentImage && (
        <div className='relative w-full h-48 bg-muted rounded-md overflow-hidden'>
          {isVideoUrl(currentImage) ? (
            <video src={currentImage} controls muted className='w-full h-full object-contain' />
          ) : (
            <Image src={currentImage} alt={label} fill className='object-contain' unoptimized />
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className='flex items-center gap-3'>
        <Button variant='outline' size='sm' asChild className='cursor-pointer'>
          <label>
            <input
              type='file'
              accept={acceptVideo ? 'image/*,video/mp4,video/webm,video/ogg' : 'image/*'}
              onChange={handleFileSelect}
              disabled={uploading}
              className='hidden'
            />
            <Upload className='h-4 w-4 mr-2' />
            {uploading ? 'Uploading...' : acceptVideo ? 'Choose File' : 'Choose Image'}
          </label>
        </Button>
        {currentImage && <span className='text-sm text-muted-foreground'>or select a new file</span>}
      </div>

      {/* Progress Bar */}
      {uploading && <Progress value={progress} className='h-2' />}

      {/* Error */}
      {error && (
        <div className='flex items-center gap-2 text-destructive text-sm'>
          <AlertCircle className='h-4 w-4' />
          {error}
        </div>
      )}

      {/* Info */}
      <p className='text-xs text-muted-foreground'>
        Max size: {effectiveMaxSize}MB. Supported: JPG, PNG, GIF, WebP{acceptVideo ? ', MP4, WebM, OGG' : ''}
      </p>
    </div>
  );
}
