import { User } from 'firebase/auth';
import { UserData } from '../models/UserData';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase.config';
import { loginUser, logoutUser, registerUser } from '../services/auth.service';
import { createUser, getUserData } from '../services/user.service';
import { uploadAvatar } from '../services/storage.service';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  user: User | null;
  userData: UserData | null;
}

interface AuthContextType {
  currentUser: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string | null,
    avatarFile: File | null
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  userData: null,
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthState>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }
    if (!user) {
      setCurrentUser(initialState);
      setIsLoading(false);
      return;
    }
    const fetchUserData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const data = await getUserData(user.uid);
        const userData = data || null;
        setCurrentUser({ user, userData });
        navigate('/app/dashboard');
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error fetching the user data ${error.message}`);
          setErrorState(`Error fetching the user data ${error.message}`);
        } else {
          alert(`unknown instance of error`);
          setErrorState('unknown instance of error');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [user, loading]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const credentials = await loginUser(email, password);
      setCurrentUser({ user: credentials.user, userData: null });
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error trying to login user ${error.message}`);
        setErrorState(`Error trying to login user ${error.message}`);
      } else {
        alert('unknown instance of error');
        setErrorState('unknown instance of error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string | null,
    avatarFile: File | null
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const credentials = await registerUser(email, password);
      const userId = credentials.user.uid;

      let avatarUrl: string = '';
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      await createUser(
        userId,
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        avatarUrl
      );

      setCurrentUser({ user: credentials.user, userData: null });
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error trying to register user: ${error.message}`);
        setErrorState(`Error trying to register user: ${error.message}`);
      } else {
        alert('Unknown instance of error');
        setErrorState('Unknown instance of error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logoutUser();
      setCurrentUser(initialState);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error trying to logout user ${error.message}`);
        setErrorState(`Error trying to logout user ${error.message}`);
      } else {
        alert('unknown instance of error');
        setErrorState('unknown instance of error');
      }
    }
  };

  const values = {
    currentUser,
    login,
    logout,
    register,
    isLoading,
    errorState,
    setErrorState,
  };

  return (
    <AuthContext.Provider value={values}>
      {isLoading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function LoadingSpinner() {
  return <div>Loading...</div>;
}
