// src/pages/OtpScreen.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

export default function OtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name ,email, password, role} = location.state || {};
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  

  const handleVerify = async () => {
    try {
      console.log('Verifying OTP with:', { email, otp });
      console.log('Registering with:', {
          name,
          email,
          password,
          role
        });
      const otpRes = await axios.post(`http://localhost:${PORT}/api/auth/verify`, {
        email,
        otp,
      });

      if (otpRes.data.verified) {
        const registerRes = await axios.post(`http://localhost:${PORT}/api/auth/register`, {
          name,
          email,
          password,
          role,
        }, {
          withCredentials: true,
        });
        
        const { token, role: userRole } = registerRes.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);

        // Navigate to role-specific page
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'teacher') navigate('/teacher');
        else if (userRole === 'ta') navigate('/ta');
        else navigate('/dashboard');
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Verification or registration failed');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center animate-fadeIn">
        <button
        onClick={() => navigate('/register')}
        className="mb-4 text-purple-600 hover:underline text-sm flex items-center"
        >
        ← Back to Register
        </button>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">OTP Verification</h2>
        <p className="text-gray-500 mb-6">Enter the OTP sent to <strong>{email}</strong></p>
        
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full text-center tracking-widest text-xl px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
        />

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        <button
          onClick={handleVerify}
          className="mt-6 w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition shadow-md transform hover:scale-105"
        >
          Verify OTP
        </button>

        <p className="mt-4 text-gray-600 text-sm">
          Didn’t receive the code? <span className="text-purple-600 font-medium cursor-pointer hover:underline">Resend</span>
        </p>
      </div>
    </div>
  );
}
