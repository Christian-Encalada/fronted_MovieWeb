import { MovieChat } from '@/components/movie-chat';

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen pt-16 px-4">
      <h1 className="text-xl font-bold px-2 py-3">Asistente de Recomendaciones</h1>
      <div className="flex-1">
        <MovieChat />
      </div>
    </div>
  );
} 