import React, { useContext, useEffect } from 'react';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';
import CustomLoader from '../components/CustomLoader';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  // Render navigation stack based on userToken
  return (
    <>
      <NavigationContainer>
        {userToken !== null && userToken !== undefined ? <AppStack /> : <AuthStack />}
        {isLoading ? <CustomLoader /> : <></>}
        <Toast/>
      </NavigationContainer>
      
    </>
  );
};

export default AppNav;