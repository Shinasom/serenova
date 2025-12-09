import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-serenova-bg p-4 pt-8 md:pt-24 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-serenova-dark mb-6 text-center">
          Talk to Serene
        </h1>
        <ChatInterface />
      </div>
    </div>
  );
}