'use client';

import * as React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';
import { FileText, Download } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
  showAvatar?: boolean;
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
}

export function ChatMessage({ message, isOwn, showAvatar = true }: ChatMessageProps) {
  const isImage = message.attachment_type === 'image';
  const isDoc = message.attachment_type === 'document';

  return (
    <div className={cn("flex w-full mb-4", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && showAvatar && (
        <div className="h-8 w-8 rounded-full bg-neutral-800 flex-shrink-0 mr-2 flex items-center justify-center text-xs font-bold text-neutral-400 mt-auto">
          {message.sender?.first_name?.[0] || 'U'}
        </div>
      )}
      {!isOwn && !showAvatar && <div className="w-10 flex-shrink-0" />}

      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm flex flex-col",
        isOwn 
          ? "bg-emerald-600 text-white rounded-br-none" 
          : "bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700"
      )}>
        {!isOwn && showAvatar && (
          <span className="text-[10px] font-bold text-emerald-400 mb-1">
            {message.sender?.first_name} {message.sender?.last_name}
          </span>
        )}

        {/* Attachment rendering */}
        {isImage && message.attachment_url && (
          <a href={message.attachment_url} target="_blank" rel="noreferrer" className="mb-2 block rounded-xl overflow-hidden">
            <img src={message.attachment_url} alt="Attachment" className="max-w-full h-auto max-h-64 object-cover hover:opacity-90 transition-opacity" />
          </a>
        )}

        {isDoc && message.attachment_url && (
          <a href={message.attachment_url} target="_blank" rel="noreferrer" className={cn(
            "flex items-center gap-3 p-3 rounded-xl mb-2",
            isOwn ? "bg-emerald-700/50 hover:bg-emerald-700" : "bg-neutral-900 hover:bg-neutral-950"
          )}>
            <div className={cn("p-2 rounded-lg", isOwn ? "bg-emerald-600" : "bg-neutral-800")}>
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Documento adjunto</p>
              <p className="text-[10px] opacity-70">Haz clic para descargar</p>
            </div>
            <Download className="h-4 w-4 opacity-50" />
          </a>
        )}

        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        <div className={cn(
          "text-[9px] mt-1 flex justify-end items-center gap-1 opacity-70",
          isOwn ? "text-emerald-100" : "text-neutral-400"
        )}>
          {formatTime(message.created_at)}
          {/* Read receipts could go here */}
        </div>
      </div>
    </div>
  );
}
