import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const API = "http://localhost:8000";

function App() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const [loginUser, setLoginUser] = useState({ username: '', password: '' });
  const [registerUser, setRegisterUser] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);  // Track registration status
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login status

  // Register function
  const register = async () => {
    setMessage('');  // Clear any previous messages
    try {
      const res = await axios.post(API + "/register", registerUser);
      setMessage("Registration successful!");
      setIsRegistered(true);  // After registration, show login
    } catch (error) {
      setMessage("Error: " + error.response.data.detail);
    }
  };

  // Login function
  const login = async () => {
    setMessage('');  // Clear any previous messages
    try {
      const res = await axios.post(API + "/login", new URLSearchParams(loginUser));
      setToken(res.data.access_token);
      setMessage("Login successful!");
      setIsLoggedIn(true);  // After login, allow data fetching
    } catch (error) {
      setMessage("Error: Invalid credentials");
    }
  };

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const res = await axios.get(API + "/energy", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      setMessage("Error: Unable to fetch data");
    }
  };

  // Chart data
  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Consumption',
        data: data.map(d => d.consumption),
        borderColor: 'red',
        fill: false
      },
      {
        label: 'Generation',
        data: data.map(d => d.generation),
        borderColor: 'green',
        fill: false
      }
    ]
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Energy Dashboard</h1>

      {/* Registration Section (Show only if not registered and not logged in) */}
      {!isLoggedIn && !isRegistered && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          <div className="space-y-4">
            <input 
              className="w-full p-3 border border-gray-300 rounded" 
              placeholder="Username" 
              onChange={e => setRegisterUser({...registerUser, username: e.target.value})} 
            />
            <input 
              className="w-full p-3 border border-gray-300 rounded" 
              placeholder="Password" 
              type="password" 
              onChange={e => setRegisterUser({...registerUser, password: e.target.value})} 
            />
            <button 
              onClick={register} 
              className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Login Section (Show only after registration) */}
      {isRegistered && !isLoggedIn && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <div className="space-y-4">
            <input 
              className="w-full p-3 border border-gray-300 rounded" 
              placeholder="Username" 
              onChange={e => setLoginUser({...loginUser, username: e.target.value})} 
            />
            <input 
              className="w-full p-3 border border-gray-300 rounded" 
              placeholder="Password" 
              type="password" 
              onChange={e => setLoginUser({...loginUser, password: e.target.value})} 
            />
            <button 
              onClick={login} 
              className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {message}
        </div>
      )}

      {/* Fetch Data Button */}
      {isLoggedIn && (
        <button 
          onClick={fetchData} 
          className="mb-4 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 w-full"
        >
          Fetch Data
        </button>
      )}

      {/* Display Chart if data is available */}
      {data.length > 0 && <Line data={chartData} />}
    </div>
  );
}

export default App;
