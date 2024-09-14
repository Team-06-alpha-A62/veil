import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import './Register.scss';
import DragZone from '../../components/DragZone/DragZone';
import { useLocation, useNavigate } from 'react-router-dom';

interface RegisterState {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  avatarFile: File | null;
  avatarUrl: string | null;
}

type ValidationErrorsType = Record<string, string>;

const registrationInitialData: RegisterState = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarFile: null,
  avatarUrl: null,
};

const Register: React.FC = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [registrationData, setRegistrationData] = useState<RegisterState>(
    registrationInitialData
  );
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrorsType>({});

  const { register } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    avatarFile,
    avatarUrl,
  } = registrationData;

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  useEffect(() => {
    if (currentUser.userData) {
      if (location.state && location.state.from) {
        navigate(location.state.from);
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [currentUser]);

  const handlePrevClick = () => {
    if (step === 1) return;
    setStep(s => s - 1);
  };

  const handleNextClick = () => {
    const newValidationErrors: ValidationErrorsType = {};

    if (step === 1) {
      if (!email) {
        newValidationErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newValidationErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      if (!firstName || firstName.length < 4 || firstName.length > 32) {
        newValidationErrors.firstName =
          'First name must be between 4 and 32 characters';
      }
      if (!lastName || lastName.length < 4 || lastName.length > 32) {
        newValidationErrors.lastName =
          'Last name must be between 4 and 32 characters';
      }
      if (!username) {
        newValidationErrors.username = 'Username is required';
      }
    }

    if (step === 3) {
      if (!password) {
        newValidationErrors.password = 'Password is required';
      }
      if (password !== confirmPassword) {
        newValidationErrors.confirmPassword =
          'Confirm password does not match the password';
      }
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    setStep(s => s + 1);
  };

  const handleInputChange =
    (key: keyof RegisterState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setRegistrationData(prevData => ({
        ...prevData,
        [key]: value,
      }));

      setValidationErrors(prevErrors => ({
        ...prevErrors,
        [key]: '',
      }));
    };

  const handleFileChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setRegistrationData(prevData => ({
      ...prevData,
      avatarFile: file,
      avatarUrl: previewUrl,
    }));
  };

  const handleRegister = async () => {
    try {
      await register(
        username,
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        avatarFile
      );
    } catch {
      alert('Registration error');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-screen bg-theme-gradient flex justify-center items-center">
      <div className="max-w-xl p-8 bg-gray-900 rounded-3xl shadow-lg space-y-6">
        <div className="steps steps-vertical sm:steps-horizontal">
          <li
            className={`step ${
              step >= 1 ? 'step-primary text-primary' : 'text-gray-500'
            }`}
          >
            Email
          </li>
          <li
            className={`step ${
              step >= 2 ? 'step-primary text-primary' : 'text-gray-500'
            }`}
          >
            Profile Information
          </li>
          <li
            className={`step ${
              step >= 3 ? 'step-primary text-primary' : 'text-gray-500'
            }`}
          >
            Password
          </li>
          <li
            className={`step ${
              step >= 4 ? 'step-primary text-primary' : 'text-gray-500'
            }`}
          >
            Avatar
          </li>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          {step === 1 && (
            <div>
              <label htmlFor="email" className="block text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChange('email')}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.email && (
                <p className="text-error mt-2">{validationErrors.email}</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-white mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={handleInputChange('firstName')}
                  className="w-full p-3 bg-gray-800 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.firstName && (
                  <p className="text-error mt-2">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-white mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={handleInputChange('lastName')}
                  className="w-full p-3 bg-gray-800 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.lastName && (
                  <p className="text-error mt-2">{validationErrors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleInputChange('username')}
                  className="w-full p-3 bg-gray-800 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.username && (
                  <p className="text-error mt-2">{validationErrors.username}</p>
                )}
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  className="w-full p-3 bg-gray-800 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.phoneNumber && (
                  <p className="text-error mt-2">
                    {validationErrors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handleInputChange('password')}
                  className="w-full p-3 bg-gray-800 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.password && (
                  <p className="text-error mt-2">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-white mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className="w-full p-3 bg-gray-800 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.confirmPassword && (
                  <p className="text-error mt-2">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center space-y-6">
              <h3 className="text-white text-2xl font-semibold mb-4">
                Upload Your Avatar
              </h3>
              <DragZone
                handleFileChange={handleFileChange}
                width={150}
                height={150}
                round={true}
                imageUrl={avatarUrl || ''}
              />
              {avatarUrl && (
                <p className="text-gray-400 mt-2 text-center">
                  Avatar Preview:
                </p>
              )}
              {validationErrors.avatarFile && (
                <p className="text-error mt-2 text-center">
                  {validationErrors.avatarFile}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm border border-white hover:bg-error hover:border-error text-white px-4 py-2 rounded-full"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrevClick}
                className={`py-2 px-4 rounded-3xl ${
                  step === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                disabled={step === 1}
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextClick}
                className="text-sm bg-primary hover:bg-accent text-white px-4 py-2 rounded-full"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                className="py-2 px-4 bg-success hover:bg-accent text-white rounded-3xl"
              >
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
