import axios from 'axios'
// import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';

const cachedAxiosInstance = axios.create({
  baseURL: '/',
  headers: { 'Cache-Control': 'no-cache' },
  //adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});

export { cachedAxiosInstance }
