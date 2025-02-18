'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string;
}

export function TrailerModal({ isOpen, onClose, videoKey }: TrailerModalProps) {
  if (!videoKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 