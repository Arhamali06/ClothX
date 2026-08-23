import type { ImageSourcePropType } from 'react-native';

export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: ImageSourcePropType;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  ProductDetails: { product: Product };
};

export type BottomTabParamList = {
  Home: undefined;
  Explore: undefined;
  Cart: undefined;
  Profile: undefined;
};
