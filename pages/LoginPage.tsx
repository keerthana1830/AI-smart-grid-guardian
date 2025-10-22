import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
          AI Smart Grid Guardian
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Enter your name to begin</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Operator Name"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-600 transition-colors duration-300"
          >
            Start Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
