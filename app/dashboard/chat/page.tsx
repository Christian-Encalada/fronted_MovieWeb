import { MovieChat } from '@/components/movie-chat';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Asistente de Recomendaciones</h1>
      <MovieChat />
    </div>
  );
} 