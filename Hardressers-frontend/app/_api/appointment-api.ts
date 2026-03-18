import axios from 'axios';
import { AvailableDay, HairStyle } from '@/app/_models/models';

export async function FetchHairStyles(): Promise<HairStyle[]> {
    console.log('Fetching hair styles from API...');
    const response = await axios.get<HairStyle[]>('https://localhost:7226/api/Appointment/GetHairStyles');
    return response.data;
}

export async function FetchAvailableSlots(HairStyleId: number,year: number,month: number,): Promise<AvailableDay[]> {
    console.log('Fetching available slots from API...');
    const response = await axios.post<AvailableDay[]>(
        `https://localhost:7226/api/Appointment/GetAvailableMonth`,
        {
            ServiceId: HairStyleId,
            year: year,
            month: month
        }
    );
    return response.data;
}

// Register user with backend API
export async function registerUserInBackend(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}): Promise<void> {
    console.log('Registering user in backend...');
    try {
        const response = await axios.post('https://localhost:7226/api/User/Register', {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber
        });
        console.log('User registered successfully:', response.data);
    } catch (err: any) {
        console.error('Failed to register user in backend:', err.response?.data || err.message);
        throw err;
    }
}

// Login user with backend API
export async function loginUserWithBackend(email: string, password: string): Promise<any> {
    console.log('Logging in user with backend...');
    try {
        const response = await axios.post('https://localhost:7226/api/User/Login', {
            email,
            password
        });
        console.log('User logged in successfully:', response.data);
        return response.data;
    } catch (err: any) {
        console.error('Failed to login user:', err.response?.data || err.message);
        throw err;
    }
}

