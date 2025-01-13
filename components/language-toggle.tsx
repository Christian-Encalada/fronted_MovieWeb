'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export function LanguageToggle() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('es');
  const { toast } = useToast();

  const changeLang = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('preferredLanguage', lang);
    router.refresh();
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      setCurrentLang(savedLang);
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 px-0">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLang('es')}>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang('en')}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}