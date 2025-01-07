import { useState, useEffect } from "react";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { AuthStore } from "../store/authstore";
import toast from "react-hot-toast";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, isLoading, error,credentialserror ,verfyerror} = AuthStore();
useEffect(()=>{
	console.log("verfyerror in useEffect: ", verfyerror);

	if(verfyerror){
		toast.error(verfyerror);
		}
},[verfyerror])
	const handleLogin = async (e) => {
		e.preventDefault();
		if (email.trim() === '' || password.trim() === '') {
			console.log('Validation failed: One or more fields are empty.');
			toast.error('All fields are required');
			return ;
		  }
		await login(email, password);
	};

	return (
		<div
		style={{backgroundColor:"rgb(28 36 50)"}}
			className='max-w-md w-full  rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 style={{color:"rgb(97, 218, 251)"}} className='text-3xl font-bold mb-6 text-center '>
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					{credentialserror&&(<p className='text-red-500 font-semibold mt-1'>{credentialserror}</p>
)}
					{error?.email && error.email.length > 0 && (
						<p className='text-red-500 font-semibold mt-1'>{error.email[0]}</p>
					)}
					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error?.password && error.password.length > 0 && (
						<p className='text-red-500 font-semibold mt-1'>{error.password[0]}</p>
					)}
					<div style={{color:"rgb(97, 218, 251)"}} className='flex items-center mb-6 mt-4'>
						<Link to='/forgot-password' className='text-sm hover:underline'>
							Forgot password?
						</Link>
					</div>

					<button
					style={{backgroundColor:"#328af1"}}
						className='w-full py-3 px-4  text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Login"}
					</button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link style={{color:"rgb(97, 218, 251)"}} to='/signup' className=' hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
};
export default Login;