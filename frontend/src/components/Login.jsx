import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout, setloading } from '../userslice';
import { useNavigate } from 'react-router-dom';


const LoginSignupBox = () => {
  const { currentuser, loading } = useSelector((state) => state.ass_user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup
        ? `${import.meta.env.VITE_RENDER_ID}/api/auth/signup`
        : `${import.meta.env.VITE_RENDER_ID}/api/auth/signin`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      // Assuming API returns { token: "JWT_TOKEN", user: { ...userDetails } }
      const { token, ...user } = data;

      dispatch(setUser(user)); // Save user details in Redux state
      localStorage.setItem('accesstoken', token); // Save token in localStorage
      setError(null); // Clear previous errors
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.message); // Display error message
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isSignup ? 'Sign Up' : 'Log In'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

          <div className="flex justify-between items-center mb-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignup((prev) => !prev)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupBox;
