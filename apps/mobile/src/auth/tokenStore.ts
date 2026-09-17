import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'khetha-access-token';

export const tokenStore = {
  get: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  clear: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
};

