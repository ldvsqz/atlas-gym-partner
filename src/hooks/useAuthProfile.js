import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/authFunctions';
import UserService from '../../Firebase/userService';

export function useAuthProfile() {
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

  const isAdmin = profile?.rol === 0;

  return {
    user,
    profile,
    isAdmin,
    loading: authLoading || profileLoading,
  };
}
