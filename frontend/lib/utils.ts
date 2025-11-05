import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatTotalDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function calculatePosition(prevPosition?: number | null, nextPosition?: number | null): number {
  if (!prevPosition && !nextPosition) return 1.0;
  if (!prevPosition) return nextPosition! - 1;
  if (!nextPosition) return prevPosition + 1;
  return (prevPosition + nextPosition) / 2;
}

export function getTrackImage(track: any): string {
  return track.cover_url || `https://picsum.photos/seed/${track.id}/300/300`;
}

export function generateGradient(id: string): string {
  const gradients = [
    'from-neon-teal/20 to-neon-blue/20',
    'from-neon-purple/20 to-neon-pink/20',
    'from-neon-lime/20 to-neon-teal/20',
    'from-neon-pink/20 to-neon-purple/20',
    'from-neon-blue/20 to-neon-lime/20',
  ];
  
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}