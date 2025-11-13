// src/pages/ResetPassword.tsx
import { useState, useEffect,type SetStateAction } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { FiMoon, FiSun } from 'react-icons/fi';

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showMsg, setShowMsg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
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
  
    const showMessage = (message: SetStateAction<string>, type: 'success' | 'error' = 'success') => {
        setMessage(message);
        setMessageType(type);
        setShowMsg(true);
        };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(`http://localhost:${PORT}/api/auth/reset-password`, {
        token,
        newPassword: password,
      });

      //alert(res.data.message);
      
      showMessage('Password reset successfully. You can now log in with your new password.', 'success');
      setTimeout(() => {
        navigate('/login');
    }, 2000);
    } catch (err) {
      console.error(err);
      showMessage('Reset failed. Link may have expired.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-200">
        <DialogBox show={showMsg} message={message} type={messageType} onClose={() => setShowMsg(false)} />
      <Link to="/" style={{
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 2,
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none'
      }} aria-label="Go to homepage">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" stroke="#667eea" strokeWidth="2" strokeLinejoin="round" fill="none"/>
        </svg>
      </Link>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Set New Password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          {message && (
            <p className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {message}
            </p>
            )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Dark Mode Toggle Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={toggleDarkMode}
          className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: darkMode ? '#6D28D9' : '#C4B5FD',
            color: 'white',
            boxShadow: darkMode ? `0 4px 15px #6D28D960` : `0 4px 15px #C4B5FD60`,
            ['--tw-ring-color' as any]: darkMode ? '#6D28D970' : '#C4B5FD70'
          }}
        >
          {darkMode ? <FiMoon className="w-6 h-6" /> : <FiSun className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
