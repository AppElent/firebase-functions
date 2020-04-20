import React, { useState, useEffect, FunctionComponent } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';
import { I18nextProvider } from 'react-i18next';
import * as firebase from 'firebase';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { SnackbarProvider } from 'notistack';

import i18n from './modules/I18NEXT';
import theme from './theme';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import Log from 'modules/Log';

import FirebaseContext from './context/FirebaseContext';
import { CacheContext, getCache, setCache, clearCache, clearKey } from './context/CacheContext';

// Create logger
localStorage.setItem('debug', 'administratie-app:*');
const log = new Log(process.env.NODE_ENV !== 'production');
log.info('Starting application');

const browserHistory = createBrowserHistory();

validate.validators = {
  ...validate.validators,
  ...validators,
};

/**
 * Firebase configuration.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyCCyQmkLU5UFKg7C4mqEvTw0QaVZ5ZWKyU',
  authDomain: 'administratie-app.firebaseapp.com',
  databaseURL: 'https://administratie-app.firebaseio.com',
  projectId: 'administratie-app',
  storageBucket: 'administratie-app.appspot.com',
  messagingSenderId: '909589468874',
  appId: '1:909589468874:web:25a83d1464dd94f0',
};
firebase.initializeApp(firebaseConfig);

type AuthDataType = {
  user?: firebase.User | null | undefined;
  firebase?: typeof firebase | null;
  isInitializing?: boolean;
  ref?: firebase.firestore.DocumentReference | null;
  userInfo?: any;
  userDataRef?: firebase.firestore.CollectionReference | null;
  log: InstanceType<typeof Log>;
};

const App: FunctionComponent = () => {
  if (window.location.protocol !== 'https:' && process.env.NODE_ENV !== 'development') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
  }

  //const firebase: any = new Firebase();
  const [authData, setAuthData] = useState<AuthDataType>({
    firebase,
    user: undefined,
    isInitializing: true,
    ref: null,
    userDataRef: null,
    userInfo: {},
    log,
  });
  const [cacheData, setCacheData] = useState({});

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(async returnedUser => {
      clearCache(setCacheData);
      let ref = null;
      let userDataRef = null;
      if (returnedUser) {
        ref = firebase
          .firestore()
          .doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + returnedUser.uid);
        userDataRef = ref.collection('config');
      }
      log.log('User auth wijziging', returnedUser);
      setAuthData({ ...authData, user: returnedUser, isInitializing: false, ref, userDataRef });
    });
    // unsubscribe to the listener when unmounting
    return (): void => unsubscribe();
    }, []); // eslint-disable-line

  //TODO  del   const [userInfo, setUserInfo] = useState<{} | undefined>(undefined);

  useEffect(() => {
    if (authData.isInitializing || authData.user === null || authData.user === undefined) return;
    const ref = firebase
      .firestore()
      .doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + authData.user.uid);
    return ref.onSnapshot(async doc => {
      let userInfoData = doc.data();
      let changed = false;
      if (!userInfoData) {
        userInfoData = {};
        changed = true;
      }
      if (!userInfoData.bunq) {
        changed = true;
        userInfoData.bunq = { success: false };
      }
      if (!userInfoData.enelogic) {
        changed = true;
        userInfoData.enelogic = { success: false };
      }
      if (!userInfoData.solaredge) {
        changed = true;
        userInfoData.solaredge = { success: false };
      }
      if (!userInfoData.tado) {
        changed = true;
        userInfoData.tado = { success: false };
      }
      if (changed) ref.set(userInfoData);
      log.log('UserInfo wijziging', userInfoData);
      setAuthData({ ...authData, userInfo: userInfoData });
    });
    }, [authData.isInitializing, authData.user]); //eslint-disable-line

  if (authData.isInitializing || (authData.user !== null && !authData.userInfo?.enelogic)) {
    return <div>Loading</div>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <FirebaseContext.Provider value={authData}>
        <CacheContext.Provider
          value={{
            data: cacheData,
            get: getCache(cacheData),
            set: setCache(setCacheData),
            clear: clearCache(setCacheData),
            clearKey: clearKey(setCacheData),
          }}
        >
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <Router history={browserHistory}>
                <Routes />
              </Router>
            </SnackbarProvider>
          </ThemeProvider>
        </CacheContext.Provider>
      </FirebaseContext.Provider>
    </I18nextProvider>
  );
};

export default App;
