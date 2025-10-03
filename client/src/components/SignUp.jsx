import Reac, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SignUp() {

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const { username, email, password } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const { data } = await axios.post(
				'http://localhost:5000/api/auth/register',
				{ username, email, password },
				config
			);

			setSuccess('Registration successful! You can now log in.');
			console.log(data);
		}
		catch (err) {
			const message = err.response?.data?.message || err.message;
			setError(message || 'registration failed.');
		}
		finally {
			setLoading(false);
		}
	};
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg'>
				<h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Create Account</h2>
				{error && <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm' role='alert'>{error}</div>}
				{success && <div className='bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 text-sm' role='alert'>{success}</div>}

				<form className='space-y-4' onSubmit={onSubmit}>
					<div>
						<label htmlFor='username' className='block text-sm font-medium text-gray-700'>Username: </label>
						<input
							id='username'
							name='username'
							value={username}
							onChange={onChange}
							type="text"
							placeholder='Enter username'
							required
							className='w-full px-4 py-2 border-none bg-pink-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500'
						/>
					</div>

					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email: </label>
						<input
							id='email'
							type="email"
							name="email"
							value={email}
							onChange={onChange}
							placeholder='Enter email'
							required
							className='w-full px-4 py-2 border-none bg-pink-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500'
						/>
					</div>

					<div>
						<label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password: </label>
						<input
							id='password'
							type="password"
							name="password"
							value={password}
							onChange={onChange}
							placeholder='Enter password'
							required
							minLength="6"
							className='w-full px-4 py-2 border-none bg-pink-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className={`w-full mt-4 text-white py-2 px-4 rounded-lg transition 
                            ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-700'}`}>
						{loading ? 'Signing Up...' : 'Sign Up'}
					</button>

				</form>
				<p className='mt-4 text-center text-sm text-pink-300'>
					Already have an account?
					<Link to="/login" className='text-pink-400 font-medium hover:underline'>
						Login
					</Link>
				</p>
			</div>

		</div>
	)
}

export default SignUp
