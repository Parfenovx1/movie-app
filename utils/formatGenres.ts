import { Genre } from '@/interfaces/apiresult';

export const formatGenres = (genres: Genre[]): string => {
  if (genres.length === 0) return '';

  const genreNames = genres.map((genre: Genre) => genre.name);

  if (genreNames.length === 1) {
    return genreNames[0];
  }

  const lastGenre = genreNames.pop();

  return `${genreNames.join(', ')} and ${lastGenre}`;
};
