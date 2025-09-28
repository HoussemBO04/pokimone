import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "./api/pokemonApi";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [pokemonApi.reducerPath],
};

import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: pokemonApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(pokemonApi.middleware),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);