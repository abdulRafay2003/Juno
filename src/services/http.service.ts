import axios from 'axios';
import {BASE_URL, BASE_PATH, API_TIMEOUT} from './config';
import {dispatchToStore, store} from '@/redux/store';
import {setTokens, setUserDetail} from '@/redux/slice/UserSlice/userSlice'; // update path if needed
import Endpoints from './EndPoints';
import {
  loginSucces,
  setAuthPayload,
  setCategoryType,
} from '@/redux/slice/AuthSlice/authSlice';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const customAxios = (contentType: string = 'application/json') => {
  const instance = axios.create({
    baseURL: BASE_URL + BASE_PATH,
    headers: {'Content-Type': contentType, 'x-api-key': 'beyondsecretkey'},
    timeout: API_TIMEOUT,
  });

  // Add access token before every request
  instance.interceptors.request.use(async (config: any) => {
    var token = store.getState()?.user?.tokens?.accessToken;
    if (token) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${token}`,
      };
    } else {
      config.headers = {...config.headers};
    }
    return config;
  });

  // Handle 401 errors (expired token)
  instance.interceptors.response.use(
    response => {
      console.log('====================================');
      console.log('response', response);
      console.log('====================================');
      return response;
    },

    async error => {
      const originalRequest = error.config;
      const isAgent = store.getState()?.user?.agent;
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({resolve, reject});
          })
            .then(token => {
              originalRequest.headers['authorization'] = 'Bearer ' + token;
              return instance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = store.getState()?.user?.tokens?.refreshToken;
          if (!refreshToken) {
            // logout function
            dispatchToStore(setUserDetail({}));
            dispatchToStore(setTokens({}));
            dispatchToStore(setAuthPayload({}));
            dispatchToStore(setCategoryType(''));
            dispatchToStore(loginSucces(false));
            return Promise.reject(error);
          }
          const refreshResponse = await axios.post(
            BASE_URL + BASE_PATH + Endpoints.refreshToken, // <-- update path if backend uses different endpoint
            {},
            {
              headers: {
                'x-refresh-token': refreshToken,
                'x-api-key': 'beyondsecretkey',
              },
            },
          );
          const newAccessToken = refreshResponse.data?.data?.accessToken;
          const newRefreshToken = refreshResponse.data?.data?.refreshToken;

          if (newAccessToken) {
            dispatchToStore(
              setTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken || refreshToken,
              }),
            );

            instance.defaults.headers.common['authorization'] =
              'Bearer ' + newAccessToken;
            processQueue(null, newAccessToken);

            // retry failed request
            originalRequest.headers['authorization'] =
              'Bearer ' + newAccessToken;
            return instance(originalRequest);
          } else {
            // logout if the refresh token is expired
            dispatchToStore(setUserDetail({}));
            dispatchToStore(setTokens({}));
            dispatchToStore(setAuthPayload({}));
            dispatchToStore(setCategoryType(''));
            dispatchToStore(loginSucces(false));
          }
        } catch (err) {
          processQueue(err, null);
          // logout function
          dispatchToStore(setUserDetail({}));
          dispatchToStore(setTokens({}));
          dispatchToStore(setAuthPayload({}));
          dispatchToStore(setCategoryType(''));
          dispatchToStore(loginSucces(false));
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      // if agent is logged in and api call is forbidden
      else if (error.response?.status === 403 && isAgent) {
        // logout function
        dispatchToStore(setUserDetail({}));
        dispatchToStore(setTokens({}));
        dispatchToStore(setAuthPayload({}));
        dispatchToStore(setCategoryType(''));
        dispatchToStore(loginSucces(false));
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export default customAxios;
