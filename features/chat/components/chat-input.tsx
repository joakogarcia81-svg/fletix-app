'use client';

import * as React from 'react';
import { Send, Paperclip, X, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, file?: File) => Promise<void>;
  onTyping: () => void;
}

export function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [content, setContent] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [isSending, setIsSending] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !file) return;

    setIsSending(true);
    try {
      await onSendMessage(content.trim(), file || undefined);
      setContent('');
      setFile(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else {
      onTyping();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const isImage = file?.type.startsWith('image/');

  return (
    <div className="flex flex-col bg-neutral-900 border-t border-neutral-800 p-3 lg:p-4">
      {/* File Preview Area */}
      {file && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-neutral-800 rounded-xl border border-neutral-700 relative w-max max-w-full">
          <button 
            onClick={() => setFile(null)}
            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md z-10"
          >
            <X className="h-3 w-3" />
          </button>
          
          <div className="h-10 w-10 rounded-lg bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0">
            {isImage ? (
              <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <FileText className="h-5 w-5 text-neutral-400" />
            )}
          </div>
          
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
            <p className="text-[10px] text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 rounded-xl transition-colors shrink-0"
          disabled={isSending}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,.pdf,.doc,.docx"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-neutral-800 text-white border-0 rounded-2xl p-3 max-h-32 min-h-[44px] resize-none focus:ring-1 focus:ring-emerald-500 text-sm leading-relaxed"
          rows={1}
          disabled={isSending}
        />

        <button
          type="submit"
          disabled={(!content.trim() && !file) || isSending}
          className={cn(
            "p-3 rounded-xl transition-all shrink-0 flex items-center justify-center",
            content.trim() || file
              ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
              : "bg-neutral-800 text-neutral-500"
          )}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
}
