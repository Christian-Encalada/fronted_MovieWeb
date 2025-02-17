'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { MovieCard } from '@/components/movie-card';

interface Movie {
  movie_id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  genres: string;
  release_date?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  movies?: Movie[];
}

export const MovieChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] })
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación');
      }

      const data = await response.json();
      if (data.messages) {
        setMessages(prev => [...prev, ...data.messages]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No pude procesar tu solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-card rounded-lg shadow-lg">
      <div className="p-4 border-b flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        <h2 className="font-semibold">Asistente de Películas</h2>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 mb-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar>
                  <Bot className="w-5 h-5" />
                </Avatar>
              )}
              <div
                className={`rounded-lg p-4 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.movies && message.movies.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {message.movies.map((movie) => (
                      <MovieCard
                        key={movie.movie_id}
                        movie={movie}
                        variant="compact"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Pensando...</span>
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: Recomiéndame películas de ciencia ficción con viajes en el tiempo..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}; 