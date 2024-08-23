import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ImageBackground } from 'react-native';
import { Input, Main, ScrollView, Spinner, YStack } from 'tamagui';

import MovieCard from '@/components/MovieCard';
import { getSearchResults, getTrending } from '@/services/api';
import { Container, Subtitle, Title } from '@/tamagui.config';
import useDebounce from '@/utils/useDebounce';

const Home = () => {
  const [searchString, setSearchString] = useState<string>('');

  const debouncedString = useDebounce(searchString, 300);

  const trendingQuery = useQuery({ queryKey: ['trending'], queryFn: getTrending });

  const searchQuery = useQuery({
    queryKey: ['search', debouncedString],
    queryFn: () => getSearchResults(debouncedString),
    enabled: debouncedString.length > 0,
  });
  return (
    <Main>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1515100122522-6efd24d7d218?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }}
        style={{ width: '100%', height: 200 }}>
        <Container>
          <YStack>
            <Title
              enterStyle={{ opacity: 0, scale: 1.5, y: -10 }}
              animation="quick"
              color="white"
              fontWeight={800}>
              Trending
            </Title>
            <Input
              placeholder="Search for a movie, tv show, person..."
              placeholderTextColor="white"
              borderWidth={1}
              style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}
              size="$4"
              value={searchString}
              onChangeText={(value) => setSearchString(value)}
            />
          </YStack>
        </Container>
      </ImageBackground>
      <Subtitle p={10} enterStyle={{ opacity: 0 }} animation="lazy">
        {searchQuery.isSuccess ? 'Search Results' : 'Trending'}
      </Subtitle>
      {(trendingQuery.isLoading || searchQuery.isLoading) && (
        <Spinner size="large" color="$blue10" />
      )}
      <ScrollView
        // style={{ backgroundColor: '#fcfcfc' }}
        py={40}
        contentContainerStyle={{ gap: 14, paddingLeft: 14 }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {searchQuery.isSuccess ? (
          <>{searchQuery?.data?.results?.map((item) => <MovieCard key={item.id} movie={item} />)}</>
        ) : (
          trendingQuery.isSuccess && (
            <>
              {trendingQuery?.data?.results?.map((item) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </>
          )
        )}
      </ScrollView>
    </Main>
  );
};

export default Home;
