import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if( form.username=="" || form.password=="" || form.confirmPassword=="" ) {
        alert("Please fill all fields!");
        return;
      }

      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const res = await axios.post("http://localhost:3000/api/users/register", { username: form.username, password: form.password });

        alert(res.data.message);
        setForm({
          username: '',
          password: '',
          confirmPassword: ''
        });

        navigate("/login");

    } catch (err) {
      if( err.response ) {
        alert(err.response.data.message);
        return;
      }

      console.error("Error occurred during registration:", err);
      alert("An error occurred. Please try again.");
    }

  };

  return (
    <div className='min-h-[68vh] flex flex-col items-center justify-center py-10'>

      <h2 className='text-2xl font-semibold mb-5'>User Registration</h2>

      <form onSubmit={handleSubmit} autoComplete='off' className='w-1/3 space-y-5 p-5 border-2 border-[#d4c9bed6] rounded-md' >

        <div className='relative'>
          <input
            type='text'
            name='username'
            placeholder='Username'
            value={form.username}
            onChange={handleChange}
            className='w-full py-3 px-4 border rounded-md focus:outline-none'
          />
        </div>


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


        <div className='relative'>
          <input
            type='text'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={form.confirmPassword}
            onChange={handleChange}
            className='w-full py-3 px-4 border rounded-md focus:outline-none'
          />
        </div>


        <button type='submit'
        className='w-full py-3 bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-white rounded-md hover:opacity-90 transition' >
          Register
        </button>

      </form>


    </div>
  );
};

export default RegisterPage;
