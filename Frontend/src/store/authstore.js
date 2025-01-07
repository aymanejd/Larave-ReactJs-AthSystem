import { create } from "zustand";
import axios from "axios";
import  Cookies  from "js-cookie";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api";
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['content-type'] = 'application/json';

export const AuthStore = create((set, get) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: false,
	message: null,
	credentialserror:null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			const expiryDate = new Date().getTime() + (6 * 24 * 60 * 60 * 1000); 
			const  tok=response.data.token
			const tokenData = {
				token: tok, 
				expiry: expiryDate, 
			};
			window.localStorage.setItem('accesstoken', JSON.stringify(tokenData));
		} catch (error) {
			set({ error: error.response.data.errors || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {

			const response = await axios.post(`/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
			const expiryDate = new Date().getTime() + (6 * 24 * 60 * 60 * 1000); 
			const  tok=response.data.token
			const tokenData = {
				token: tok, 
				expiry: expiryDate, 
			};
			window.localStorage.setItem('accesstoken', JSON.stringify(tokenData));
			
		} catch (error) {
			if (error.response.status === 401 ||error.response.status === 400) {
				set({ credentialserror: error.response.data.message || "Unauthorized" });
			  }
			set({ error: error.response?.data.errors || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			const token = JSON.parse(window.localStorage.getItem('accesstoken'));


			const currentTime = new Date().getTime();
			if (currentTime > token.expiry) {
				window.localStorage.removeItem('accesstoken');
				set({ user: null, isAuthenticated: false });
				return null;
			}
			 await axios.post('/logout',{}, { headers: { Authorization: `Bearer ${token.token}` } })	
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
			window.localStorage.removeItem('accesstoken');

		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post('/verify-email', { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const token = JSON.parse(window.localStorage.getItem('accesstoken'));


			const currentTime = new Date().getTime();
			if (currentTime > token.expiry) {
				window.localStorage.removeItem('accesstoken');
				set({ isCheckingAuth: false });

				return null;
			}
			const response = await axios.get('/auth-check', { headers: { Authorization: `Bearer ${token.token}` } })
			console.log('ponse')
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });




		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (passtoken, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/reset-password/${passtoken}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
	ResendverifyEmail: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post('/Resendverify-email', { email });
			set({  isLoading: false });
			toast.success(response.data.message);

		} catch (error) {
			set({  isLoading: false });

			if(error.status==400){
				toast.error(error.response.data.message);

				setTimeout(() => {
					window.location.href = "/login";
				}, 2000);
				
			}
			throw error;
		}
	},
}));