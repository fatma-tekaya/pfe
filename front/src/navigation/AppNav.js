import React, { useContext, useEffect } from 'react';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';
import CustomLoader from '../components/CustomLoader';
const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  // Render navigation stack based on userToken
  return (
    <>
        {userToken !== null && userToken !== undefined ? <AppStack /> : <AuthStack />}
        {isLoading ? <CustomLoader /> : <></>}
    </>
  );
};

export default AppNav;