import { Loader } from "lucide-react";

const LoadingSpinner = () => {
	return (
		<div style={{backgroundColor:"rgb(19 23 28)"}} className='min-h-screen  flex items-center justify-center relative overflow-hidden'>
			<Loader className='w-6 h-6 animate-spin  mx-auto' />
		</div>
	);
};

export default LoadingSpinner;