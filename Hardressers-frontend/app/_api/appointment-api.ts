import axios from 'axios';
import { AvailableDay, AppointmentResponseDTO, AdminCalendarAppointmentDTO, HairStyleWithPhotos, AdminReviewDTO, ReviewDisplayDTO } from '@/app/_models/models';
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

export type PagedAppointmentsResponse = {
    items: AppointmentResponseDTO[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
};

export async function FetchHairStyles(): Promise<HairStyleWithPhotos[]> {
    const response = await axios.get<HairStyleWithPhotos[]>(
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
export async function FetchAllAppointmentsAdmin(
    pageNumber: number
): Promise<PagedAppointmentsResponse> {
    const headers = await getAuthHeaders();
    console.log('Fetching all appointments with headers:', pageNumber);
    const response = await axios.post<PagedAppointmentsResponse>(
        `${API_BASE_URL}/api/Appointment/GetAllAppointments`,
        { pageNumber },
        { headers }
    );

    return response.data;
}

export async function AcceptAppointmentAdmin(
  appointmentId: number
): Promise<void> {
  const headers = await getAuthHeaders();
  await axios.put(
    `${API_BASE_URL}/api/Appointment/AcceptAppointment/${appointmentId}`,
    null,
    { headers }
  );
}

export async function UpdateAppointmentStatusAdmin(
    appointmentId: number,
    status: number
): Promise<void> {
    try {
        const headers = await getAuthHeaders();

        await axios.put(
            `${API_BASE_URL}/api/Appointment/PutAppointmentStatus`,
            {
                appointmentId,
                status,
            },
            {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (err: any) {
        console.error(
            'Failed to update appointment status:',
            err.response?.data || err.message
        );
        throw err;
    }
}

export async function FetchAdminCalendarAppointments(
    weekStart: string
): Promise<AdminCalendarAppointmentDTO[]> {
    const headers = await getAuthHeaders();

    const response = await axios.post<AdminCalendarAppointmentDTO[]>(
        `${API_BASE_URL}/api/Appointment/GetAdminCalendarAppointments`,
        { weekStart },
        {
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        }
    );
    console.log('Fetched admin calendar appointments:', response.data);
    return response.data;
}

export async function UploadHairStylePhoto(
    hairStyleId: number,
    file: File
): Promise<{ message?: string; Message?: string; url?: string; Url?: string }> {
    console.log("API_BASE_URL =", API_BASE_URL);
    try {
        const headers = await getAuthHeaders();

        const formData = new FormData();
        formData.append('photo', file);

        const response = await axios.post(
            `${API_BASE_URL}/api/HairStyles/UploadPhoto/${hairStyleId}`,
            formData,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error(
            "Failed to upload hairstyle photo:",
            err.response?.data || err.message
        );
        throw err;
    }
}

export async function DeleteHairStylePhoto(photoId: number): Promise<void> {
    try {
        const headers = await getAuthHeaders();

        await axios.delete(`${API_BASE_URL}/api/HairStyles/DeletePhoto/${photoId}`, {
            headers,
        });
    } catch (err: any) {
        console.error(
            'Failed to delete hairstyle photo:',
            err.response?.data || err.message
        );
        throw err;
    }
}

export async function FetchAllReviewsAdmin(): Promise<AdminReviewDTO[]> {
  const headers = await getAuthHeaders();

  const response = await axios.get<AdminReviewDTO[]>(
    `${API_BASE_URL}/api/Reviews/GetAllReviews`,
    { headers }
  );

  return response.data;
}

export async function PutVisibilityReview(reviewId: number): Promise<void> {
  const headers = await getAuthHeaders();

  await axios.put(
    `${API_BASE_URL}/api/Reviews/PutVisibilityReview/${reviewId}`,
    {},
    { headers }
  );
}

export async function DeleteReview(reviewId: number): Promise<void> {
  const headers = await getAuthHeaders();

  await axios.delete(
    `${API_BASE_URL}/api/Reviews/DeleteReview/${reviewId}`,
    { headers }
  );
}
export async function FetchVisibleReviews(): Promise<ReviewDisplayDTO[]> {
  const response = await axios.get<ReviewDisplayDTO[]>(
    `${API_BASE_URL}/api/Reviews/GetVisibleReviews`
  );

  return response.data;
}