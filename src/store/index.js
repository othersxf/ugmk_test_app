import reducers from "@app/store/reducers";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: reducers,
})

export const persistor = persistStore(store)

