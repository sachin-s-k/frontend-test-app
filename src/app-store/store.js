// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import registerSlice from "./registerSlice";
//import itemReducer from "./itemSlice";

// 1. Configure the persist config for your reducers
const persistConfig = {
  key: "root",
  storage, // The storage engine to use (localStorage, sessionStorage, etc.)
  whitelist: ["registration"], // Optionally specify which reducers to persist
};

// 2. Combine your reducers if you have more than one
const rootReducer = combineReducers({
  registration: registerSlice,
});

// 3. Create a persisted reducer using `persistReducer`
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// 5. Create a persistor that will be used to persist the store
export const persistor = persistStore(store);
