import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import './Register.scss';
import DragZone from '../../components/DragZone/DragZone';
import { useLocation, useNavigate } from 'react-router-dom';

interface RegisterProps {}

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

const Register: React.FC<RegisterProps> = () => {
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
      if (location.state && location.state.from) {
        navigate(location.state.from);
      } else {
        navigate('/app/dashboard');
      }
    } catch (error) {
      alert('Registration error');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-screen bg-theme-gradient flex justify-center items-center">
      <div className="max-w-xl p-8 bg-gray-900 rounded-lg shadow-lg space-y-6">
        <div className="steps steps-vertical custom-step-primary sm:steps-horizontal">
          <li
            className={`step ${
              step >= 1 ? 'step-primary text-[#ff7647]' : 'text-gray-500'
            }`}
          >
            Register
          </li>
          <li
            className={`step ${
              step >= 2 ? 'step-primary text-[#ff7647]' : 'text-gray-500'
            }`}
          >
            Choose Plan
          </li>
          <li
            className={`step ${
              step >= 3 ? 'step-primary text-[#ff7647]' : 'text-gray-500'
            }`}
          >
            Purchase
          </li>
          <li
            className={`step ${
              step >= 4 ? 'step-primary text-[#ff7647]' : 'text-gray-500'
            }`}
          >
            Upload Avatar
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
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7647]"
              />
              {validationErrors.email && (
                <p className="text-red-500 mt-2">{validationErrors.email}</p>
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7647]"
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 mt-2">
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7647]"
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 mt-2">
                    {validationErrors.lastName}
                  </p>
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7647]"
                />
                {validationErrors.username && (
                  <p className="text-red-500 mt-2">
                    {validationErrors.username}
                  </p>
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7647]"
                />
                {validationErrors.phoneNumber && (
                  <p className="text-red-500 mt-2">
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7647]"
                />
                {validationErrors.password && (
                  <p className="text-red-500 mt-2">
                    {validationErrors.password}
                  </p>
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7647]"
                />
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 mt-2">
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
                <p className="text-red-500 mt-2 text-center">
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
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrevClick}
                className={`py-2 px-4 rounded-lg ${
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
                className="py-2 px-4 bg-[#ff7647] hover:bg-[#ff967a] text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                className="py-2 px-4 bg-[#ff7647] hover:bg-[#ff967a] text-white rounded-lg"
              >
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
