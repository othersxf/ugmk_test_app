import { combineReducers } from "redux";
import productReducers from "@app/store/reducers/products";
import userSettings from "@app/store/reducers/userSettings";
import storage from 'redux-persist/lib/storage'
import { persistReducer } from "redux-persist";

const userSettingsPersistConfig = {
  key: 'userSettings',
  storage: storage,
}

const reducers = combineReducers({
  products: productReducers,
  userSettings: persistReducer(userSettingsPersistConfig, userSettings)
})
export default reducers;
