import { Link } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import Animated from 'react-native-reanimated';
import { ListItem, ScrollView } from 'tamagui';

import { Favorite } from '@/interfaces/favorites';
import { Container, Main } from '@/tamagui.config';
import { generateImageWithBaseUrl } from '@/utils/baseUrl';

const Favorites = () => {
  const [favorites] = useMMKVObject<Favorite[]>('favorites');

  return (
    <Main>
      <Container>
        <ScrollView>
          {favorites?.map((fav) => (
            <Link key={fav.id} href={`/(drawer)/favorites/${fav.mediaType}/${fav.id}`} asChild>
              <ListItem
                title={fav.name}
                size="$2.5"
                icon={() => (
                  <Animated.Image
                    sharedTransitionTag={`${fav.mediaType === 'movie' ? 'movie' : 'tv'}-${fav.id}`}
                    source={{ uri: generateImageWithBaseUrl(fav.thumb as string) }}
                    style={{ height: 50, width: 50 }}
                  />
                )}
              />
            </Link>
          ))}
        </ScrollView>
      </Container>
    </Main>
  );
};

export default Favorites;
