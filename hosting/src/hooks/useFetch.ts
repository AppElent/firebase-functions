//import 'idempotent-babel-polyfill' // so async await works ;)
import { useEffect, useState, useCallback } from 'react';
//import {auth} from '../helpers/Firebase';
import { useSession, useCache } from 'hooks';
import { useSnackbar } from 'notistack';

const isObject = (obj: any): boolean => Object.prototype.toString.call(obj) === '[object Object]';

const backend = process.env.REACT_APP_API_BASE_URL; //'https://appelent-api.herokuapp.com';

export function useFetch(arg1: any, arg2: any): any {
  const { user, log } = useSession();
  const cache = useCache();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let url: any = null;
  let options = {};
  let onMount = false;
  let baseUrl = '';
  let method = 'GET';
  let cacheKey = '';

  if (arg2.defaultData === undefined) arg2.defaultData = [];

  //console.log('useFetch is called with args ', arg1, arg2);
  const handleOptions = (opts: any): any => {
    if (true) {
      // take out all the things that are not normal `fetch` options
      // need to take this out of scope so can set the variables below correctly
      const { url, onMount, timeout, baseUrl, ...rest } = opts;
      options = rest;
    }
    if (opts.url) url = opts.url;
    if (opts.onMount) onMount = opts.onMount;
    if (opts.method) method = opts.method;
    if (opts.baseUrl) baseUrl = opts.baseUrl;
    if (opts.cacheKey) cacheKey = opts.cacheKey;
  };

  if (typeof arg1 === 'string') {
    url = backend + arg1;
    if (isObject(arg2)) handleOptions(arg2);
  } else if (isObject(arg1)) {
    handleOptions(arg1);
  }

  const initialData = arg2.initialData === undefined ? [] : arg2.initialData;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(onMount);
  const [methodLoading, setMethodLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    method => async (fArg1: any, fArg2: any): Promise<any> => {
      method = method.toLowerCase();
      let newUrl = url;

      const fetchOptions: any = {};
      if (method === 'post') {
        newUrl = typeof fArg1 === 'string' ? backend + fArg1 : newUrl;
        fetchOptions.body = typeof fArg1 === 'string' ? JSON.stringify(fArg2) : JSON.stringify(fArg1);
      } else if (method === 'put' || method === 'patch') {
        newUrl = Number.isInteger(fArg1) ? url + '/' + fArg1 : fArg1;
        fetchOptions.body = JSON.stringify(fArg2);
      } else if (method === 'delete') {
        newUrl = Number.isInteger(fArg1) ? url + '/' + fArg1 : fArg1;
      }

      let responsedata;
      try {
        setMethodLoading(true);
        const token = await user.getIdToken(true);
        log.info('Making ' + method + ' request to ' + newUrl);
        const response = await fetch(newUrl, {
          method,
          ...options,
          ...fetchOptions,
          headers: {
            Authorization: 'Firebase ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          responsedata = await response
            .clone()
            .json()
            .catch(() => response.text());
          throw new Error(response.status + ' - ' + response.statusText);
        } else {
          responsedata = await response
            .clone()
            .json()
            .catch(() => response.text());
          console.log('Response data', responsedata);
        }
      } catch (err) {
        const key = enqueueSnackbar(
          'Error with method ' + method + ': ' + JSON.stringify(err) + ' ---> ' + JSON.stringify(responsedata),
          {
            variant: 'error',
            onClick: () => {
              closeSnackbar(key);
            },
          },
        );
        throw err;
      } finally {
        setMethodLoading(false);
      }
      return responsedata;
    },
    [url],
  );

  const get = async (forceUpdate = false, options: any = {}): Promise<any> => {
    //
    let query = options.query || '';

    if (!forceUpdate) {
      const data = cache.get(cacheKey);
      if (data) {
        setData(data);
        if (error) setError(null);
        setLoading(false);
        return;
      }
    } else {
      query = options.query || '?forceUpdate=true';
    }

    const fetchOptions = {};

    let responsedata;
    let realdata = {};
    let fError = {};
    try {
      setLoading(true);
      const token = await user.getIdToken(true);
      log.info('Making GET request to ' + url + query);
      const response = await fetch(url + query, {
        method,
        ...options,
        ...fetchOptions,
        headers: {
          Authorization: 'Firebase ' + token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        responsedata = await response
          .clone()
          .json()
          .catch(() => response.text());
        throw new Error(response.status + ' - ' + response.statusText);
      } else {
        responsedata = await response
          .clone()
          .json()
          .catch(() => response.text());
        realdata = responsedata.data || responsedata;
        if (arg2.postProcess !== undefined) {
          realdata = await arg2.postProcess(realdata);
        }
        setData(realdata);
        cache.set(cacheKey, realdata);
      }
    } catch (err) {
      fError = err;
      const key = enqueueSnackbar(
        'Error with method ' + method + ': ' + JSON.stringify(err) + ' ---> ' + JSON.stringify(responsedata),
        {
          variant: 'error',
          onClick: () => {
            closeSnackbar(key);
          },
        },
      );
      setError({ error: err, responsedata });
    } finally {
      setLoading(false);
    }

    return { data: realdata, error: fError };
  };

  //const get = useCallback(fetchData('GET'))
  const post = useCallback(fetchData('POST'), []); //TODO added dep array, does it work?
  const patch = useCallback(fetchData('PATCH'), []);
  const put = useCallback(fetchData('PUT'), []);
  const destroy = useCallback(fetchData('DELETE'), []);

  const request: any = { get, post, patch, put, destroy };

  useEffect(() => {
    if (onMount) request[method.toLowerCase()]();
  }, []);

  return Object.assign([data, setData, loading, error, request, methodLoading], {
    data,
    setData,
    loading,
    error,
    request,
    ...request,
    methodLoading,
  });
}

export default useFetch;
