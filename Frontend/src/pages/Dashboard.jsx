import { AuthStore } from "../store/authstore";
const formatDate = (dateString) => {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}

	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};
const DashboardPage = () => {
	const { user, logout } = AuthStore();

	const handleLogout = () => {
		logout();
	};
	return (
		<div
			style={{ backgroundColor: "rgb(28 36 50)" }}

			className='max-w-md w-full mx-auto mt-10 p-8   rounded-xl shadow-2xl border border-gray-800'
		>
			<h2
				style={{ color: "rgb(97, 218, 251)" }}
				className='text-3xl font-bold mb-6 text-center '>
				Dashboard
			</h2>

			<div className='space-y-6'>
				<div
					style={{ backgroundColor: "#29324A" }}

					className='p-4  rounded-lg border border-gray-700'

				>
					<h3 style={{ color: "rgb(97, 218, 251)" }} className='text-xl font-semibold mb-3'>Profile Information</h3>
					<p className='text-gray-300'>Name: {user.name}</p>
					<p className='text-gray-300'>Email: {user.email}</p>
				</div>
				<div
					style={{ backgroundColor: "#29324A" }}
					className='p-4  rounded-lg border border-gray-700'

				>
					<h3 style={{ color: "rgb(97, 218, 251)" }} className='text-xl font-semibold  mb-3'>Account Activity</h3>
					<p className='text-gray-300'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300'>
						<span className='font-bold'>Last Login: </span>

						{formatDate(user.lastLogin)}
					</p>
				</div>
			</div>

			<div

				className='mt-4'
			>
				<button
					onClick={handleLogout}
					style={{ backgroundColor: "#328af1" }}

					className='w-full py-3 px-4  text-white 
				font-bold rounded-lg shadow-lg 
				 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Logout
				</button>
			</div>
		</div>
	);
};
export default DashboardPage;