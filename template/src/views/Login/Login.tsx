import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface LoginProps {}

interface LoginState {
  email: string;
  password: string;
}

const initialLoginData = {
  email: '',
  password: '',
};

type ValidationErrorsType = Record<string, string>;

const Login: React.FC<LoginProps> = () => {
  const { isLoading, currentUser } = useAuth();
  const [loginData, setLoginData] = useState<LoginState>(initialLoginData);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrorsType>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser.userData) {
      if (location.state && location.state.from) {
        navigate(location.state.from);
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [currentUser]);

  const handleInputChange =
    (key: keyof LoginState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLoginData({
        ...loginData,
        [key]: value,
      });

      setValidationErrors({
        ...validationErrors,
        [key]: '',
      });
    };

  const handleLogin = async () => {
    const newValidationErrors: ValidationErrorsType = {};

    if (!loginData.email) {
      newValidationErrors.email = 'Email is required';
    }

    if (!loginData.password) {
      newValidationErrors.password = 'Password is required';
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    try {
      await login(loginData.email, loginData.password);
    } catch (error) {
      alert('Login error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center  bg-theme-gradient">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl  bg-gray-900 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={e => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none relative block w-full px-3 py-2 border border-transparent rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7647] focus:border-transparent sm:text-sm"
                placeholder="Email address"
                value={loginData.email}
                onChange={handleInputChange('email')}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none relative block w-full px-3 py-2 border border-transparent rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7647] focus:border-transparent sm:text-sm"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange('password')}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm">
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          <div className="text-sm text-center text-gray-300">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-[#ff7647] hover:text-[#ff967a]"
            >
              Register
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff7647] hover:bg-[#ff967a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff7647]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
