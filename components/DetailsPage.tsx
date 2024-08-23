import { useQuery } from '@tanstack/react-query';
import { ImageBackground } from 'react-native';
import Animated from 'react-native-reanimated';
import { H1, ScrollView, YStack, Text, Paragraph } from 'tamagui';

import { MediaType } from '@/interfaces/apiresult';
import { getMovieDetails } from '@/services/api';
import { Main } from '@/tamagui.config';
import { generateImageWithBaseUrl } from '@/utils/baseUrl';

type DetailsPageProps = {
  id: string;
  mediaType: MediaType;
};

const DetailsPage = ({ id, mediaType }: DetailsPageProps) => {
  const movieQuery = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(+id, mediaType),
  });
  return (
    <Main>
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
        <YStack p={10} enterStyle={{ opacity: 0, y: 70 }} animation="lazy">
          <H1 my={6} fontWeight={500} color="$blue7">
            {movieQuery.data?.title}{' '}
            <Text fontSize={16}>({new Date(movieQuery.data?.release_date!).getFullYear()})</Text>
          </H1>
          <Paragraph fontSize={16} fontWeight={400} theme="alt2">
            {movieQuery.data?.tagline}
          </Paragraph>
          <Text mt={10} fontSize={16}>
            {movieQuery.data?.overview}
          </Text>
        </YStack>
      </ScrollView>
    </Main>
  );
};

export default DetailsPage;
