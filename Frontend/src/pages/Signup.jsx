import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { AuthStore } from "../store/authstore";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { signup, error, isLoading } = AuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();
		if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
			console.log('Validation failed: One or more fields are empty.');
			toast.error('All fields are required');
			return ;
		  }
		try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div
		style={{backgroundColor:"rgb(28 36 50)"}}
			className='max-w-md w-full  rounded-2xl shadow-xl 
			overflow-hidden'
		>

			<div className='p-8'>
				<h2 style={{color:"rgb(97, 218, 251)"}} className='text-3xl font-bold mb-6 text-center  '>
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					<Input
						icon={User}
						type='text'
						placeholder='Full Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					{error?.name && error.name.length > 0 && (
						<p className='text-red-500 font-semibold mt-1'>{error.name[0]}</p>
					)}
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
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
					<PasswordStrengthMeter password={password} />


					<button
					style={{backgroundColor:"#328af1"}}
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r  text-white 
						font-bold rounded-lg shadow-lg 
focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900						  transition duration-200'
						disabled={isLoading}
						type='submit'
					>
						{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
					</button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p style={{color:"rgb(97, 218, 251)"}} className='text-sm text-gray-400'>
					Already have an account?{" "}
					<Link to={"/login"} className=' hover:underline'>
						Login
					</Link>

				</p>
			</div>
		</div>
	);
};
export default SignUpPage;