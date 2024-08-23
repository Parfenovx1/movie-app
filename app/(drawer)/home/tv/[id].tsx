import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import DetailsPage from '@/components/DetailsPage';
import { MediaType } from '@/interfaces/apiresult';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DetailsPage id={id} mediaType={MediaType.Tv} />;
};

export default Page;
