import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, type SetStateAction } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiMoon, FiSun } from 'react-icons/fi';
import axios from 'axios';

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

const currentPalette = {
  'accent-purple': '#7c3aed',
  'accent-lilac': '#c4b5fd'
};

// DialogBox component
type DialogBoxProps = {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
  children?: React.ReactNode;
  onClose: () => void;
};

const DialogBox = ({
  show,
  message,
  type = 'success',
  children,
  onClose,
}: DialogBoxProps) => {
  if (!show) return null;

  const icon =
    type === 'success' ? (
      <svg width={56} height={56} fill="none" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="28" fill="#6ddf99" />
        <path d="M18 30l7 7 13-13" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg width={56} height={56} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#f87171" />
        <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center min-w-[320px] relative animate-fadein">
        <div className="mb-2">{icon}</div>
        <div className={`text-lg font-semibold text-center mb-1 ${type === 'success' ? 'text-[#235d3a]' : 'text-red-600'}`}>{message}</div>
        {children}
        <button onClick={onClose} className="bg-purple-700 text-white px-4 py-2 rounded-3xl w-full mt-4">OK</button>
      </div>
    </div>
  );
};

export default function Register() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [matchStatus, setMatchStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getPasswordStrengthValue = (pwd: string) => {
    if (pwd.length === 0) return { level: '', width: '0%', color: 'bg-gray-300' };
    if (pwd.length < 6) return { level: 'Weak', width: '33%', color: 'bg-red-500' };
    if (pwd.match(/[A-Z]/) && pwd.match(/[a-z]/) && pwd.match(/[0-9]/) && pwd.length >= 8) {
      return { level: 'Strong', width: '100%', color: 'bg-green-500' };
    }
    return { level: 'Medium', width: '66%', color: 'bg-yellow-400' };
  };

  const strength = getPasswordStrengthValue(password);

  const checkMatch = (val: SetStateAction<string>) => {
    setConfirmPassword(val);
    if (password && val) {
      setMatchStatus(password === val ? 'Matched' : 'Not matched');
    } else {
      setMatchStatus('');
    }
  };

  const showMessage = (message: SetStateAction<string>, type: 'success' | 'error' = 'success') => {
    setMsgContent(message);
    setMsgType(type);
    setShowMsg(true);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) return showMessage('Passwords do not match', 'error');

    try {
      setIsSubmitting(true);
      showMessage('Sending OTP...');
      await axios.post(`http://localhost:${PORT}/api/auth/send`, { email });
      navigate('/otp', { state: { email, password, role, name } });
    } catch (err: any) {
      showMessage(err?.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 font-[Poppins] ${darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-pink-100 to-purple-200'}`}>
      <DialogBox show={showMsg} message={msgContent} type={msgType} onClose={() => setShowMsg(false)} />

      {/* Decorative blobs */}
      <div className="absolute w-72 h-72 bg-pink-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob -top-20 -left-20 dark:bg-pink-800"></div>
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000 -bottom-20 -right-10 dark:bg-purple-800"></div>

      {/* Home Icon */}
      <Link to="/" className="absolute top-6 left-6 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md h-10 w-10 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Register Box */}
      <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md transition hover:scale-105 duration-300 ease-in-out backdrop-blur-md border dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-500 text-white text-4xl rounded-full h-16 w-16 flex items-center justify-center shadow-lg">👤</div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">Create Account</h2>

        <form className="space-y-6" onSubmit={handleRegister}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />

          {/* Password Field */}
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" required />
            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>

          {password && (
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Password Strength: <strong>{strength.level}</strong></p>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"><div className={`h-2 rounded ${strength.color}`} style={{ width: strength.width }} /></div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => checkMatch(e.target.value)} className="input-field pr-12" required />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>
          {matchStatus && <p className={`text-sm ${matchStatus === 'Matched' ? 'text-green-600' : 'text-red-600'}`}>{matchStatus}</p>}

          {/* Role Dropdown */}
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
            <option value="student">Student</option>
            <option value="teacher">Professor</option>
            {/*<option value="ta">TA</option>*/}
            {/*<option value="admin">Admin</option>*/}
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full !bg-purple-500 text-black py-3 rounded-lg hover:bg-purple-600 transition shadow-md transform hover:scale-105 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account? <Link to="/login" className="text-purple-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>

      {/* Dark Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={toggleDarkMode}
          className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: darkMode ? currentPalette['accent-purple'] : currentPalette['accent-lilac'],
            color: 'white',
            boxShadow: darkMode
              ? `0 4px 15px ${currentPalette['accent-purple']}60`
              : `0 4px 15px ${currentPalette['accent-lilac']}60`,
            // @ts-ignore
            ['--tw-ring-color' as any]: darkMode
              ? currentPalette['accent-purple'] + '70'
              : currentPalette['accent-lilac'] + '70',
          }}
        >
          {darkMode ? <FiMoon className="w-6 h-6" /> : <FiSun className="w-6 h-6" />}
        </button>
      </div>

      <style>{`
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          border: 1px solid #ccc;
          background: white;
          transition: 0.3s ease;
        }
        .dark .input-field {
          background-color: #1f2937;
          color: white;
          border-color: #374151;
        }
        .eye-icon {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}