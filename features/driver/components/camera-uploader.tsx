'use client';

import * as React from 'react';
import { Camera, Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface CameraUploaderProps {
  label?: string;
  onUploadSuccess?: (url: string) => void;
  className?: string;
}

export function CameraUploader({ label = 'Subir Remito / Foto', onUploadSuccess, className }: CameraUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const { showToast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview locally
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      // Mock upload delay (In the future: replace with Supabase Storage upload)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('Documento subido con éxito', 'success');
      // Mock URL return
      if (onUploadSuccess) {
        onUploadSuccess(`mock-url-${Date.now()}`);
      }
    } catch (error) {
      showToast('Error al subir la imagen', 'error');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Forces mobile devices to open the rear camera
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview ? (
        <button
          type="button"
          onClick={handleCaptureClick}
          className="w-full flex items-center justify-center gap-3 bg-neutral-900 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl p-6 transition-all"
        >
          <div className="p-3 bg-neutral-800 rounded-full">
            <Camera className="h-6 w-6 text-neutral-300" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-neutral-200">{label}</span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wide">Toca para abrir cámara</span>
          </div>
        </button>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
          <img src={preview} alt="Document Preview" className="w-full h-48 object-cover opacity-60" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
                <span className="text-sm font-bold text-white">Subiendo documento...</span>
              </>
            ) : (
              <>
                <div className="bg-emerald-500/20 p-2 rounded-full mb-2">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <span className="text-sm font-bold text-white">¡Remito Confirmado!</span>
              </>
            )}
          </div>

          {!isUploading && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
