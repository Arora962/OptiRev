import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  //const [reducedMotion, setReducedMotion] = useState(false);

  // Palette can come from theme or hardcoded
  const currentPalette = {
    'accent-purple': '#7c3aed', // Example purple
    'accent-lilac': '#c4b5fd'   // Example lilac
  };

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

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden font-[Poppins] transition-colors duration-500 ${darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-teal-100 to-blue-200'}`}>
      {/* Animated Background Blobs */}
      <div className="absolute w-72 h-72 bg-teal-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob -top-20 -left-20 dark:bg-teal-800"></div>
      <div className="absolute w-72 h-72 bg-blue-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000 -bottom-20 -right-10 dark:bg-blue-800"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 shadow-xl rounded-3xl p-10 w-[95%] max-w-2xl text-center backdrop-blur-lg border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Peer Evaluation System</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-sm">Welcome! Please login or register to continue.</p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          {[
            { color: 'indigo', title: 'Track Progress', desc: 'Monitor your evaluation status and feedback in real time.' },
            { color: 'green', title: 'Easy Evaluation', desc: 'Submit and review peer evaluations with a simple interface.' },
            { color: 'pink', title: 'Secure & Private', desc: 'Your data is encrypted and privacy is our top priority.' },
          ].map((f, i) => (
            <div key={i} className={`bg-${f.color}-50 dark:bg-${f.color}-900 p-5 rounded-xl shadow-md hover:scale-[1.03] transition`}>
              <p className={`font-semibold text-${f.color}-800 dark:text-${f.color}-200 text-sm mb-1`}>{f.title}</p>
              <p className={`text-xs text-${f.color}-600 dark:text-${f.color}-300`}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex justify-center gap-10">
          <Link to="/login" className="flex flex-col items-center group">
            <div className="h-14 w-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
              🔐
            </div>
            <span className="mt-2 text-gray-700 dark:text-gray-200 text-sm font-medium">Login</span>
          </Link>
          <Link to="/register" className="flex flex-col items-center group">
            <div className="h-14 w-14 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
              📝
            </div>
            <span className="mt-2 text-gray-700 dark:text-gray-200 text-sm font-medium">Register</span>
          </Link>
        </div>
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
          } as React.CSSProperties & Record<string, any>}
        >
          {darkMode ? (
            <FiMoon className="w-6 h-6" />
          ) : (
            <FiSun className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Keyframes for blobs */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}