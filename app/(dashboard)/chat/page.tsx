import { ChatLayout } from '@/features/chat/components/chat-layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mensajes | Fletix',
  description: 'Comunícate en tiempo real sobre tus viajes',
};

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-hidden">
      <ChatLayout />
    </div>
  );
}
