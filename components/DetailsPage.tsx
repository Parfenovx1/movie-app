import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { ImageBackground } from 'react-native';
import { useMMKVBoolean, useMMKVObject } from 'react-native-mmkv';
import Animated from 'react-native-reanimated';
import { H1, ScrollView, YStack, Text, Paragraph, Spinner, Button, useTheme } from 'tamagui';

import { MediaType } from '@/interfaces/apiresult';
import { Favorite } from '@/interfaces/favorites';
import { getMovieDetails } from '@/services/api';
import { Main } from '@/tamagui.config';
import { generateImageWithBaseUrl } from '@/utils/baseUrl';
import { formatGenres } from '@/utils/formatGenres';

type DetailsPageProps = {
  id: string;
  mediaType: MediaType;
};

const DetailsPage = ({ id, mediaType = MediaType.Movie }: DetailsPageProps) => {
  const [isFavorite, setIsFavorite] = useMMKVBoolean(`${mediaType}-${id}`);
  const [favorites, setFavorites] = useMMKVObject<Favorite[]>('favorites');

  const theme = useTheme();

  const movieQuery = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(+id, mediaType),
  });

  const toggleFavorite = () => {
    const current = favorites || [];

    if (!isFavorite) {
      setFavorites([
        ...current,
        {
          id,
          mediaType,
          thumb: movieQuery.data?.poster_path,
          name: movieQuery.data?.title || movieQuery.data?.name,
        },
      ]);
    } else {
      setFavorites(current.filter((fav) => fav.id !== id || fav.mediaType !== mediaType));
    }
    setIsFavorite(!isFavorite);
  };
  return (
    <Main>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button unstyled onPress={toggleFavorite}>
              <Ionicons
                color={theme.yellow9.get()}
                size={26}
                name={isFavorite ? 'star' : 'star-outline'}
              />
            </Button>
          ),
        }}
      />
      <ScrollView>
        <ImageBackground
          source={{
            uri: generateImageWithBaseUrl(movieQuery?.data?.backdrop_path as string),
          }}>
          <Animated.Image
            borderRadius={6}
            source={{
              uri: generateImageWithBaseUrl(movieQuery?.data?.poster_path as string),
            }}
            style={{ width: 200, height: 300, margin: 10 }}
            sharedTransitionTag={`${mediaType === 'movie' ? 'movie' : 'tv'}-${id}`}
          />
        </ImageBackground>
        {movieQuery.isLoading ? (
          <Spinner size="large" color="$blue10" />
        ) : (
          <YStack p={10} enterStyle={{ opacity: 0, y: 70 }} animation="lazy">
            <H1 my={6} fontWeight={500} color="$blue7">
              {movieQuery.data?.title || movieQuery.data?.name}{' '}
              <Text fontSize={16}>
                (
                {new Date(
                  movieQuery.data?.release_date! || movieQuery.data?.first_air_date!
                ).getFullYear()}
                )
              </Text>
            </H1>
            <Paragraph fontSize={16} fontWeight={400} theme="alt2" color="$blue7">
              {movieQuery.data?.tagline}
            </Paragraph>
            <Paragraph mt={10} fontSize={16} fontWeight={400} theme="alt2">
              {`Runtime: ${mediaType === 'movie' ? movieQuery.data?.runtime : movieQuery.data?.episode_run_time[0]} minutes`}
            </Paragraph>
            {movieQuery.data?.genres && (
              <Paragraph mt={10} fontSize={16} fontWeight={400} theme="alt2">
                {`Genres: ${formatGenres(movieQuery.data?.genres)}`}
              </Paragraph>
            )}
            <Text mt={10} fontSize={16}>
              {movieQuery.data?.overview}
            </Text>
          </YStack>
        )}
      </ScrollView>
    </Main>
  );
};

export default DetailsPage;
