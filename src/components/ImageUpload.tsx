import React, { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, X, Link, Cloud } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image',
  required = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'cloudinary' | 'local' | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, SVG, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Image upload failed');
      }

      onChange(data.url);
      setProvider(data.provider || 'local');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Ensure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label} {required && <span className="text-accent">*</span>}
        </label>
        <div className="flex items-center gap-1 text-[11px] bg-surface rounded-lg p-0.5 border border-border">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              inputMode === 'upload'
                ? 'bg-accent text-accent-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              inputMode === 'url'
                ? 'bg-accent text-accent-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {inputMode === 'upload' ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all text-center cursor-pointer ${
            dragActive
              ? 'border-accent bg-accent/5 scale-[1.01]'
              : 'border-border hover:border-accent/50 bg-surface/50'
          } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploading ? (
            <div className="py-5 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-7 h-7 text-accent animate-spin" />
              <p className="text-xs font-medium text-foreground">
                Uploading image to Cloudinary / storage...
              </p>
              <p className="text-[11px] text-muted-foreground">Please wait a few seconds</p>
            </div>
          ) : value ? (
            <div className="relative group flex items-center gap-3 text-left">
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border bg-black/20">
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback thumbnail if broken image
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-foreground truncate">
                    Image Attached
                  </span>
                  {provider === 'cloudinary' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                      <Cloud className="w-2.5 h-2.5" /> Cloudinary CDN
                    </span>
                  ) : provider === 'local' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium" title="Cloudinary cloud name mismatch. Using local storage fallback.">
                      Local Server Storage
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5 max-w-[260px]">
                  {value}
                </p>
                <p className="text-[10px] text-accent mt-1 hover:underline">
                  Click to replace image or drag new file here
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                  setProvider(null);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                Drop your image here, or <span className="text-accent underline">browse</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Supports PNG, JPG, WebP, SVG up to 10MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://images.unsplash.com/... or Cloudinary URL"
                className="w-full rounded-xl border border-border bg-surface pl-9 pr-3.5 py-2.5 text-xs text-foreground focus:border-accent focus:outline-hidden"
              />
            </div>
            {value && (
              <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden border border-border">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
