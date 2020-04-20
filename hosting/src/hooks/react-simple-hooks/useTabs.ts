import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

type useTabsPropsType = {
  tab: string;
  handleTabChange: (e: any, newValue: string) => void;
  setTab: React.Dispatch<React.SetStateAction<string>>;
};

const useTabs = (initialTab = ''): useTabsPropsType => {
  const [tab, setTab] = useState<string>(initialTab);
  const location = useLocation();

  useEffect(() => {
    //If there is a query param named tab then set that tab
    const params = new URLSearchParams(location.search);
    const tabQuery = params.get('tab');
    if (tabQuery) {
      setTab(tabQuery);
    }
  }, [location.search]);

  const handleTabChange = useCallback((e, newValue) => {
    setTab(newValue);
  }, []);

  return { tab, handleTabChange, setTab };
};

export default useTabs;
