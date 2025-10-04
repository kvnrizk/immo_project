const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/placeholder-property.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
}
