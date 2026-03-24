import axios from 'axios';
import { AvailableDay, HairStyle, AppointmentResponseDTO } from '@/app/_models/models';
import { supabase } from '@/utils/supabase/client';

const API_BASE_URL = 'https://localhost:7226';

// Helper to get Supabase token for authenticated requests
async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function FetchHairStyles(): Promise<HairStyle[]> {
  const response = await axios.get<HairStyle[]>(
    `${API_BASE_URL}/api/HairStyles/GetHairStyles`
  );
  return response.data;
}

export async function FetchAvailableSlots(
  hairStyleId: number,
  year: number,
  month: number
): Promise<AvailableDay[]> {
  const headers = await getAuthHeaders();

  const response = await axios.post<AvailableDay[]>(
    `${API_BASE_URL}/api/Appointment/GetAvailableMonth`,
    {
      serviceId: hairStyleId,
      year,
      month,
    },
    {
      headers,
    }
  );

  return response.data;
}

export async function registerUserInBackend(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}): Promise<void> {
  try {
    await axios.post(`${API_BASE_URL}/api/User/Register`, {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    });
  } catch (err: any) {
    console.error(
      'Failed to register user in backend:',
      err.response?.data || err.message
    );
    throw err;
  }
}

export async function loginUserWithBackend(
  email: string,
  password: string
): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/User/Login`, {
      email,
      password,
    });

    return response.data;
  } catch (err: any) {
    console.error('Failed to login user:', err.response?.data || err.message);
    throw err;
  }
}

export async function postAppointment(
  appointmentDate: string,
  hairStyleId: number
): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.post(
      `${API_BASE_URL}/api/Appointment/PostAppointment`,
      {
        appointmentDate,
        hairStyleId,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (err: any) {
    console.error(
      'Failed to create appointment:',
      err.response?.data || err.message
    );
    throw err;
  }
}

export async function FetchMyAppointments(): Promise<AppointmentResponseDTO[]> {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.get<AppointmentResponseDTO[]>(
      `${API_BASE_URL}/api/Appointment/GetMyAppointmentHistoric`,
      {
        headers,
      }
    );

    return response.data;
  } catch (err: any) {
    console.error(
      'Failed to fetch appointments:',
      err.response?.data || err.message
    );
    throw err;
  }
}