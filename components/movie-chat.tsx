'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { MovieCard } from '@/components/movie-card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';

interface User {
  id: string;
  username: string;
  email: string;
}

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

interface ChatHistory {
  id: string;
  timestamp: number;
  messages: Message[];
}

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export const MovieChat = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getUserChatKey = useCallback((chatId: string) => {
    return `chat_${user?.username || 'anonymous'}_${chatId}`;
  }, [user?.username]);

  const getAllChats = useCallback((): ChatHistory[] => {
    const chats: ChatHistory[] = [];
    const prefix = `chat_${user?.username || 'anonymous'}_`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const chat = JSON.parse(localStorage.getItem(key) || '');
        chats.push(chat);
      }
    }
    return chats;
  }, [user?.username]);

  // Cargar mensajes del localStorage al iniciar
  useEffect(() => {
    const loadMessages = () => {
      const currentChatId = localStorage.getItem(`currentChatId_${user?.username || 'anonymous'}`);
      if (currentChatId) {
        const chatHistory = localStorage.getItem(getUserChatKey(currentChatId));
        if (chatHistory) {
          const parsedHistory = JSON.parse(chatHistory);
          setMessages(parsedHistory.messages);
        }
      } else {
        const newChatId = new Date().getTime().toString();
        localStorage.setItem(`currentChatId_${user?.username || 'anonymous'}`, newChatId);
      }
    };

    loadMessages();
  }, [user?.username, getUserChatKey]);

  // Guardar mensajes en localStorage cuando se actualicen
  useEffect(() => {
    if (messages.length > 0) {
      const currentChatId = localStorage.getItem(`currentChatId_${user?.username || 'anonymous'}`);
      if (currentChatId) {
        const chatHistory: ChatHistory = {
          id: currentChatId,
          timestamp: new Date().getTime(),
          messages
        };
        localStorage.setItem(getUserChatKey(currentChatId), JSON.stringify(chatHistory));
        
        const allChats = getAllChats();
        if (allChats.length > 5) {
          const sortedChats = allChats.sort((a, b) => b.timestamp - a.timestamp);
          const oldestChat = sortedChats[sortedChats.length - 1];
          localStorage.removeItem(getUserChatKey(oldestChat.id));
        }
      }
    }
  }, [messages, user?.username, getUserChatKey, getAllChats]);

  const startNewChat = () => {
    const newChatId = new Date().getTime().toString();
    localStorage.setItem(`currentChatId_${user?.username || 'anonymous'}`, newChatId);
    setMessages([]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/dashboard/movie/${movieId}`);
  };

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
        // Enriquecemos los datos de las películas con información de TMDB
        const enrichedMessages = await Promise.all(
          data.messages.map(async (message: Message) => {
            if (message.movies) {
              const enrichedMovies = await Promise.all(
                message.movies.map(async (movie: Movie) => {
                  try {
                    const tmdbResponse = await fetch(
                      `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                    );
                    const tmdbData = await tmdbResponse.json();
                    return {
                      ...movie,
                      poster_path: tmdbData.poster_path,
                      overview: tmdbData.overview,
                      vote_average: tmdbData.vote_average,
                      release_date: tmdbData.release_date
                    };
                  } catch (error) {
                    console.error('Error fetching TMDB data:', error);
                    return movie;
                  }
                })
              );
              return { ...message, movies: enrichedMovies };
            }
            return message;
          })
        );
        setMessages(prev => [...prev, ...enrichedMessages]);
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

  const formatMessage = (content: string, movies?: Movie[]) => {
    const sections = content.split('PELÍCULA #');
    
    return sections.map((section, sectionIndex) => {
      if (sectionIndex === 0) {
        // Sección inicial (introducción)
        return (
          <div key="intro" className="mb-4">
            {section.split('\n').map((line, i) => (
              <p key={i} className="text-sm my-1">{line}</p>
            ))}
          </div>
        );
      }

      // Secciones de películas
      const [movieNumber, ...movieContent] = section.split('\n');
      const currentMovie = movies?.[sectionIndex - 1];

      return (
        <div key={sectionIndex} className="mb-6">
          <h3 className="font-bold text-sm mb-2">PELÍCULA #{movieNumber}</h3>
          
          {/* Información de la película */}
          <div className="space-y-2">
            {movieContent.map((line, i) => {
              if (line.match(/^[📽️🎭📖💫🎨⭐🏆]/)) {
                const [emoji, ...rest] = line.split(':');
                return (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className="flex-shrink-0">{emoji}</span>
                    <span className="flex-1">{rest.join(':')}</span>
                  </div>
                );
              }
              return line.trim() && <p key={i} className="text-xs">{line}</p>;
            })}
          </div>

          {/* Tarjeta de película después de cada descripción */}
          {currentMovie && (
            <div
              onClick={() => handleMovieClick(currentMovie.movie_id)}
              className="mt-3 cursor-pointer hover:opacity-80 transition-opacity bg-background/50 rounded-lg p-2"
            >
              <div className="flex gap-2">
                <div className="relative h-20 w-14 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={currentMovie.poster_path ? `${TMDB_IMAGE_URL}${currentMovie.poster_path}` : '/placeholder.png'}
                    alt={currentMovie.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {currentMovie.title}
                  </h3>
                  {currentMovie.release_date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(currentMovie.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const ChatSelector = ({ onSelect }: { onSelect: (chatId: string) => void }) => {
    const chats = getAllChats()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    return (
      <div className="border-t p-2">
        <p className="text-xs text-muted-foreground mb-2">Conversaciones anteriores</p>
        <div className="space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onSelect(chat.id)}
            >
              {new Date(chat.timestamp).toLocaleDateString()} - 
              {chat.messages[0]?.content.substring(0, 30)}...
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto bg-card rounded-lg shadow-lg">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Asistente de Películas</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={startNewChat}
          className="text-xs"
        >
          Nueva conversación
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
        <div className="p-3 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-8'
                      : 'bg-muted mr-8'
                  } ${message.movies ? 'w-[90%] sm:w-[85%]' : 'max-w-[75%]'}`}
                >
                  <div className="text-sm">
                    {typeof message.content === 'string' 
                      ? formatMessage(message.content, message.movies)
                      : message.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs">Pensando...</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 text-sm"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            size="icon"
            className="h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <ChatSelector 
        onSelect={(chatId) => {
          localStorage.setItem(`currentChatId_${user?.username || 'anonymous'}`, chatId);
          const chat = JSON.parse(localStorage.getItem(getUserChatKey(chatId)) || '');
          setMessages(chat.messages);
        }} 
      />
    </div>
  );
}; 