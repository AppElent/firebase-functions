//import { useMediaQuery } from 'react';
import { useTheme } from '@material-ui/styles';
import { useMediaQuery, Theme } from '@material-ui/core';

const useCustomMediaQuery = (): boolean => {
  const theme: Theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });
  return isDesktop;
};

export default useCustomMediaQuery;
