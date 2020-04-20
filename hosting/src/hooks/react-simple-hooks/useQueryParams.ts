import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type useQueryParamsType = {
  [key: string]: string;
};

const useQueryParams = (): useQueryParamsType => {
  const [params, setParams] = useState({});
  const location = useLocation();

  useEffect(() => {
    //If there is a query param named tab then set that tab
    const Qparams: URLSearchParams = new URLSearchParams(location.search);
    const newParams: any = {};
    Qparams.forEach(function(value, key) {
      newParams[key] = value;
    });
    setParams(newParams);
  }, [location.search]);

  return params;
};

export default useQueryParams;
