import React, { useState } from 'react';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

const BRAND_COLOR = '#0056b3';
const LOGO_URL = 'https://raw.githubusercontent.com/F-F-Mart-Official/F-F-Mart/main/images/fish%20mart%20logo.png';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Note: Pure frontend auth is for demonstration. In production, use a backend/JWT.
    if (username === 'admin' && password === 'FnFAdmin2024!') {
      onLogin(true);
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border-t-4" style={{ borderColor: BRAND_COLOR }}>
        <div className="flex flex-col items-center mb-6">
          <img 
            src={LOGO_URL} 
            alt="F&F Mart Logo" 
            className="w-20 h-20 mb-4 object-contain"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-2xl font-bold text-center" style={{ color: BRAND_COLOR }}>F&F Mart Portal</h2>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input 
            type="text" placeholder="Username" required
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full text-white p-2 rounded font-semibold hover:bg-blue-700 transition" style={{ backgroundColor: BRAND_COLOR }}>
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};
