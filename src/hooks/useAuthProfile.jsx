import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/authFunctions';
import UserService from '../../Firebase/userService';

const AuthProfileContext = createContext(null);

export function AuthProfileProvider({ children }) {
  const [user, authLoading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const userData = await UserService.get(user.uid);
        if (mounted) {
          setProfile(userData || null);
        }
      } catch {
        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const value = useMemo(() => ({
    user,
    profile,
    isAdmin: profile?.rol === 0,
    loading: authLoading || profileLoading,
  }), [authLoading, profile, profileLoading, user]);

  return (
    <AuthProfileContext.Provider value={value}>
      {children}
    </AuthProfileContext.Provider>
  );
}

export function useAuthProfile() {
  const context = useContext(AuthProfileContext);
  if (!context) {
    throw new Error('useAuthProfile must be used within AuthProfileProvider');
  }
  return context;
}
