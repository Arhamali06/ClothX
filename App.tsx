import React, { useState } from 'react';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';

import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import BottomNav from './src/components/BottomNav';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('home');

  //SPLASH SCREEN
  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  //LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }


  // MAIN APP
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen />;

      case 'explore':
        return <ExploreScreen />;

      case 'cart':
        return <CartScreen />;

      case 'profile':
        return <ProfileScreen onLogout={()=> setIsLoggedIn(false)} />;

      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      {renderScreen()}

      <BottomNav
        activeScreen={activeScreen}
        onChangeScreen={setActiveScreen}
      />
    </>
  );
}