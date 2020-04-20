// @flow
import React, { useContext } from 'react';

export const FirebaseContext = React.createContext({});

export const useSession = (): any => useContext(FirebaseContext); // eslint-disable-line

export default FirebaseContext;
