import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
function App() {
  return (
    <AuthProvider>
       <NavigationContainer>
        <AppNav />
      </NavigationContainer>
      <Toast/>
    </AuthProvider>
  );
}
export default App;