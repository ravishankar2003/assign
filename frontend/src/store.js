import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './userslice.js'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }



const rootReducer = combineReducers({
    ass_user : userReducer

})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store= configureStore({
  reducer: persistedReducer,
  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})

export const persistor = persistStore(store)