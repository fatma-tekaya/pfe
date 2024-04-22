import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {AuthContext} from '../context/AuthContext';
import CustomLoader from '../components/CustomLoader';

const AppNav = () => {
  const {isLoading, userToken} = useContext(AuthContext);
  console.log('isLoading',isLoading)
  return (
    <>
      <NavigationContainer>
        {userToken !== null ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
      {isLoading ? <CustomLoader /> : <></>}
    </>
  );
};

export default AppNav;
