import Image from 'next/image';

interface MoviePosterProps {
  posterPath: string;
  title: string;
}

export function MoviePoster({ posterPath, title }: MoviePosterProps) {
  return (
    <div className="relative aspect-[2/3] w-full">
      <Image
        src={`https://image.tmdb.org/t/p/original${posterPath}`}
        alt={title}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
} 