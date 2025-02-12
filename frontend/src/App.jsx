import NavBar from './components/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';  
import SettingsPage from './pages/SettingsPage.jsx';

import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser  ) return (
    <div className="flex items-center justify-center h-screen"> 
      <Loader className='size-10 animate-spin' />    
    </div>
  );

  console.log(authUser);
  return (

    <div>

      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <LoginPage />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <HomePage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <HomePage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster/>
    </div>
  );
};

export default App;