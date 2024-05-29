import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import { requestUserPermission,getToken } from './src/utils/FirebaseMessagingService';
function App() {

  useEffect(() => {
    
    // requestUserPermission();
    // getToken();
  }, [])
  return (

    <AuthProvider>
      <AppNav />
    </AuthProvider>

  );
}

export default App;