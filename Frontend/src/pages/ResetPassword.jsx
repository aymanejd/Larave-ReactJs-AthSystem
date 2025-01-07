import { useState } from "react";
import { AuthStore } from "../store/authstore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = AuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
        if (password.trim() === '' || confirmPassword.trim() === '') {
			console.log('Validation failed: One or more fields are empty.');
			toast.error('All fields are required');
			return ;
		  }
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<div
		style={{backgroundColor:"rgb(28 36 50)"}}

			className='max-w-md w-full  rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 style={{color:"rgb(97, 218, 251)"}} className='text-3xl font-bold mb-6 text-center bg-gradient-to-r '>
					Reset Password
				</h2>
				{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
				{message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

				<form onSubmit={handleSubmit}>
					<Input
						icon={Lock}
						type='password'
						placeholder='New Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Confirm New Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					<button
							style={{backgroundColor:"#328af1"}}

						className='w-full py-3 mt-4 px-4  text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? "Resetting..." : "Set New Password"}
					</button>
				</form>
			</div>
		</div>
	);
};
export default ResetPassword;