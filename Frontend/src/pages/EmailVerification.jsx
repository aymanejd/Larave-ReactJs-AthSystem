import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthStore } from "../store/authstore";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";

const EmailVerification = () => {
	const navigate = useNavigate();
	const [otp, setOtp] = useState("");
	const [verifydisable, setVerifyDisable] = useState(true);
	const [email, setEmail] = useState("");
	const { error, isLoading, verifyEmail,ResendverifyEmail } = AuthStore();
	const [Submitted, setSubmitted] = useState(false);

	


	

	const handleChange = (otpValue) => {
		const numericValue = otpValue.replace(/[^0-9]/g, "");
		setOtp(numericValue);
		if (numericValue.length === 6) {
			setVerifyDisable(false);
		}
		else {
			setVerifyDisable(true);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await verifyEmail(otp);
			navigate("/");
			toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
	};
	const handleresend = async (e) => {
		e.preventDefault();
		if (email.trim() === '') {
			toast.error('email field is required');
			return;
		}
		await ResendverifyEmail(email);
		setSubmitted(false);
			
	};
	useEffect(() => {
		if (otp.length == 6) {
			handleSubmit(new Event("submit"));
		}
	}, [otp]);

	return (
		<div style={{ backgroundColor: "rgb(28, 36, 50)" }} className='max-w-md w-full  rounded-2xl shadow-xl overflow-hidden'>
			{!Submitted ?
				(<div

					className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
				>
					<h2 style={{ color: "rgb(97, 218, 251)" }} className='text-3xl font-bold mb-6 text-center  '>
						Verify Your Email
					</h2>
					<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='flex justify-center'>
							<OTPInput
								value={otp}
								onChange={handleChange}
								numInputs={6}
								separator={<span>-</span>}
								renderInput={(props) => <input
									{...props}
									className="focus:outline-none " 
									inputMode="numeric"
									pattern="[0-9]*"
									type="tel" />
								}

								inputStyle={{
									width: "2.5rem",
									height: "2.5rem",
									margin: "0.5rem",
									fontSize: "1.5rem",
									textAlign: "center",
									border: "2px solid #4A5568", 
									backgroundColor: "#4A5568", 
									color: "white", 
									fontWeight: "bold", 
									borderRadius: "0.3rem", 
									transition: "border-color 0.3s ease", 
								}}
							/>
						</div>
						<button

							type='submit'
							style={{ backgroundColor: "rgb(50, 138, 241)" }}
							disabled={verifydisable}
							className='w-full bg-gradient-to-r  text-white font-bold py-3 px-4 rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-opacity-50 disabled:opacity-50'
						>
							{isLoading ? "Verifying..." : "Verify Email"}

						</button>
					</form>
				</div>) :
				(<div className='p-8 w-full max-w-md'
				>
					<form onSubmit={handleresend}>
						<p className='text-gray-300 mb-6 text-center'>
							Enter your email address to receive a new verification code.						</p>
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
							style={{ backgroundColor: "#328af1" }}

							className='w-full py-3 mt-4 px-4 bg-gradient-to-r 
							 text-white font-bold rounded-lg shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Resend verfication Code"}
						</button>
					</form>
				</div>
				)
			}

			{Submitted || (<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className="text-sm text-gray-400">
					Haven't received the verification code? Click{" "}
					<a
						style={{ color: "rgb(97, 218, 251)" }}
						onClick={() => setSubmitted(true)}
						className="cursor-pointer hover:underline"
					>
						Resend
					</a>{" "}
					to get a new one.
				</p>

			</div>)}
		</div>
	);
};
export default EmailVerification;