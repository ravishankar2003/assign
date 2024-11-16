import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout, setloading } from '../userslice';
import Home from './Home';

const Admin = () => {
  const { currentuser, loading } = useSelector((state) => state.ass_user);
  const [country, setCountry] = useState(currentuser.country);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUserState] = useState({});
  const [newData, setNewData] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accesstoken');
      try {
        dispatch(setloading(true));
        const response = await fetch(`https://assign-j9zq.onrender.com/api/user/getuser`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const result = await response.json();
        if (response.ok) {
          const { token: newToken, ...rest } = result;
          dispatch(setUser(rest));
          localStorage.setItem('accesstoken', newToken);
          setUserState(rest);
          setCountry(rest.country);
          fetchDataForCountry();
        } else {
          throw new Error(result.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        dispatch(setloading(false));
      }
    };

    fetchUserData();
  }, [dispatch, currentuser.country]);

  const fetchDataForCountry = async () => {
    try {
      const token = localStorage.getItem('accesstoken');
      const response = await fetch(`https://assign-j9zq.onrender.com/api/user/data`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCountry = async () => {
    const token = localStorage.getItem('accesstoken');
    try {
      const response = await fetch(`https://assign-j9zq.onrender.com/api/user/country`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok) {
        setUserState((prev) => ({ ...prev, country }));
        dispatch(setUser({ ...currentuser, country }));
        fetchDataForCountry();
      } else {
        throw new Error(result.message || 'Failed to update country');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accesstoken');
    try {
      const response = await fetch(`https://assign-j9zq.onrender.com/api/data/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updatedContent) => {
    const token = localStorage.getItem('accesstoken');
    try {
      const response = await fetch(`https://assign-j9zq.onrender.com/api/data/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
        credentials: 'include',
      });
      if (response.ok) {
        setData((prev) =>
          prev.map((item) => (item._id === id ? { ...item, content: updatedContent } : item))
        );
      } else {
        throw new Error('Failed to update data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNewData = async () => {
    const token = localStorage.getItem('accesstoken');
    try {
      const response = await fetch(`https://assign-j9zq.onrender.com/api/data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newData, country }),
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok) {
        setData((prev) => [...prev, result]);
        setNewData('');
      } else {
        throw new Error('Failed to add new data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Adjust height based on content
  const handleContentChange = (id, e) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, content: e.target.value, height: 'auto' } : item
      )
    );
  };


  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    dispatch(logout()); // Assuming `logout` action resets user state in Redux
    navigate('/login'); // Redirect to login page after logout
  };

  if(currentuser.isadmin === false){
    return <Home />;
    }

  return (

    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Left Section - Profile */}
      <div className="lg:w-1/3 min-w-[300px] bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Admin</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={user.username || 'Loading...'}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
          </select>
        </div>
        <button
          onClick={handleUpdateCountry}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
        >
          Update Profile
        </button>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 mt-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
  
      {/* Right Section - Data */}
      <div className="lg:w-2/3 md:min-w-[500px] bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Data for {currentuser.country}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
          {data.length === 0 ? (
            <p className="text-center text-gray-500">No data available for this country.</p>
          ) : (
            data.map((item) => (
              <div
                key={item._id}
                className="relative flex flex-col gap-1 border-b pb-3 mb-4"
              >
                {/* Content with Auto-resize */}
                <div className="w-full">
                  <textarea
                    value={item.content}
                    onChange={(e) => handleContentChange(item._id, e)}
                    className="w-[calc(100%-8px)] overflow-y-auto border rounded-md p-2 mr-2 mb-4 bg-gray-100"
                    style={{
                      height: item.content.length > 0 
                        ? `${Math.min(item.content.split('\n').length * 70,100 )}px`
                        : 'auto',
                      overflowY: item.content.length > 100 ? 'scroll' : 'hidden',
                    }}
                    placeholder="Edit data"
                  />
                </div>
  
                {/* Update and Delete buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleUpdate(item._id, item.content)}
                    className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
  
        <div className="mt-4">
          <textarea
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            className="w-full h-20 resize-none border rounded-md p-2 mb-4"
            placeholder="Add new data"
          />
          <button
            onClick={handleAddNewData}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
          >
            Add Data
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Admin;
