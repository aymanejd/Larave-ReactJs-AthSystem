import { useState } from "react";
import { AuthStore } from "../store/authstore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [Submitted, setSubmitted] = useState(false);

	const { isLoading, forgotPassword } = AuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email.trim() === '' ) {
			console.log('Validation failed: One or more fields are empty.');
			toast.error('email field is required');
			return ;
		  }
		await forgotPassword(email);
		setSubmitted(true);
	};

	return (
		<div
		style={{backgroundColor:"rgb(28 36 50)"}}

			className='max-w-md w-full  rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				
				<h2 style={{color:"rgb(97, 218, 251)"}} className='text-3xl font-bold mb-6 text-center  '>
					Forgot Password
				</h2>

				{!Submitted ? (
					<form onSubmit={handleSubmit}>
						<p className='text-gray-300 mb-6 text-center'>
							Enter your email address and we'll send you a link to reset your password.
						</p>
						<Input
							icon={Mail}
							type='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<button
							disabled={isLoading}
							style={{backgroundColor:"#328af1"}}

							className='w-full py-3 mt-4 px-4 bg-gradient-to-r 
							 text-white font-bold rounded-lg shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
						</button>
					</form>
				) : (
					<div className='text-center'>
						<div
							style={{backgroundColor:"rgb(50, 138, 241)"}}
							className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'
						>
							<Mail className='h-8 w-8 text-white' />
						</div>
						<p className='text-gray-300 mb-6'>
							If an account exists for {email}, you will receive a password reset link shortly.
						</p>
					</div>
				)}
			</div>

			<div className='px-8 py-4  bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/login"} style={{color:"rgb(97, 218, 251)"}} className='text-sm hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div>
		</div>
	);
};
export default ForgotPassword;