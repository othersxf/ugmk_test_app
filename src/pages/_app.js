import '@app/styles/globals.css'
import 'react-vis/dist/style.css';
import { Provider } from "react-redux";
import {store, persistor} from "@app/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }) {
  return  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Component {...pageProps} />
    </PersistGate>
  </Provider>
}
