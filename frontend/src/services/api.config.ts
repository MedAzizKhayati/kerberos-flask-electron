// Config for the API service
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
});

axiosInstance.interceptors.request.use(
    async (config) => {
        if(config.headers.Mode === 'no-auth') 
            return config;
        // Get Kerberos Ticket from Electron 
        const ticket = await new Promise((resolve, reject) => {
            window.Main.getFlaskTicket();
            setTimeout(() => reject("Request timed out!"), 2000);
            window.Main.on('flask-ticket', resolve);
            window.Main.removeEventListener('flask-ticket', resolve);
        });
        config.headers.Authorization = `Negotiate ${ticket}`;
        return config;
    }
);