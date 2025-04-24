import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import { useAuthStore } from '../stores/useAuthStore';

const LoginPage = () => {

  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try{
      e.preventDefault();

      if( form.username=="" || form.password=="" ){
        alert("Please fill all fields!");
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, { username: form.username, password: form.password });

      alert(res.data.message);

      setToken(res.data.token );
      setUser(res.data.data );

      setForm({
        username: '',
        password: ''
      });

      navigate("/");
    } catch(err){
      if( err.response ){
        alert(err.response.data.message);
        return;
      }

      alert(err.message);
    }


  };

  return (
    <div className='min-h-[68vh] flex flex-col items-center justify-center py-10'>
      <h2 className='text-2xl font-semibold mb-5'>User Login</h2>

      <form
        onSubmit={handleSubmit}
        autoComplete='off'
        className='w-1/3 space-y-5 p-5 border-2 border-[#d4c9bed6] rounded-md'
      >
        {/* Username Field */}
        <div className='relative'>
          <input
            type='text'
            name='username'
            placeholder='Username'
            value={form.username}
            onChange={handleChange}
            className='w-full py-3 px-4 pr-10 border rounded-md focus:outline-none'
          />
        </div>

        {/* Password Field */}
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            placeholder='Password'
            value={form.password}
            onChange={handleChange}
            className='w-full py-3 px-4 pr-10 border rounded-md focus:outline-none'
          />
          {showPassword ? (
            <EyeOff className='absolute right-3 top-3.5 cursor-pointer' onClick={() => setShowPassword(false)} />
          ) : (
            <Eye className='absolute right-3 top-3.5 cursor-pointer' onClick={() => setShowPassword(true)} />
          )}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full py-3 bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-white rounded-md hover:opacity-90 transition'
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
