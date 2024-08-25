import {
  DetailsResultItem,
  MediaType,
  TrendingResult,
  UpcomingResult,
} from '@/interfaces/apiresult';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';

export const getTrending = async (): Promise<TrendingResult> => {
  const response = await fetch(
    `${BASE_URL}/trending/all/day?language=en-US&api_key=${API_KEY}&page=1`
  );
  const json = await response.json();
  return json;
};

export const getUpcoming = async (): Promise<UpcomingResult> => {
  const response = await fetch(
    `${BASE_URL}/movie/upcoming?language=en-US&page=1&api_key=${API_KEY}`
  );
  const json = await response.json();
  return json;
};

export const getSearchResults = async (query: string): Promise<TrendingResult> => {
  const response = await fetch(
    `${BASE_URL}/search/multi?language=en-US&api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data;
};

export const getMovieDetails = async (id: number, type: MediaType): Promise<DetailsResultItem> => {
  const response = await fetch(`${BASE_URL}/${type}/${id}?language=en-US&api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};
