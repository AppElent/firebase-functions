import { useState } from 'react';

/*
const useStateExtended = (initialValue, initialLoading = false) => {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(initialLoading);

    return Object.assign([data, setData, loading, setLoading], { data, setData, loading, setLoading });
};
*/

type useStateExtendedPropsType<T> = {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStateExtended = <T>(initialValue: T, initialLoading = false): useStateExtendedPropsType<T> => {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(initialLoading);

  return {
    data,
    setData,
    loading,
    setLoading,
  };
};

export default useStateExtended;
