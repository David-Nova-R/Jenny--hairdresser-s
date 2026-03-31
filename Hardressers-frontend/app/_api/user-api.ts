import axios from 'axios';
import { supabase } from '@/utils/supabase/client';
import { AdminUserDTO, PagedUsersResponse } from '@/app/_models/models';

const API_BASE_URL = 'https://localhost:7226';

async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
}

// ── Filters ───────────────────────────────────────────────────────────────────
export interface UserFilters {
    query:  string;
    roleId: number | null;   // null = all  |  1 = Admin  |  2 = Styliste  |  3 = Client
}

export const DEFAULT_USER_FILTERS: UserFilters = {
    query:  '',
    roleId: null,
};

// ── Endpoints ─────────────────────────────────────────────────────────────────
export async function FetchUsersAdmin(
    pageNumber: number,
    filters: UserFilters = DEFAULT_USER_FILTERS
): Promise<PagedUsersResponse> {
    const headers = await getAuthHeaders();

    const body: Record<string, unknown> = { pageNumber };
    if (filters.query.trim()) body.searchQuery = filters.query.trim();
    if (filters.roleId !== null) body.roleId = filters.roleId;

    const response = await axios.post<PagedUsersResponse>(
        `${API_BASE_URL}/api/UserManagement/GetUsers`,
        body,
        { headers }
    );
    return response.data;
}

export async function FetchUserAdmin(userId: number): Promise<AdminUserDTO> {
    const headers = await getAuthHeaders();
    const response = await axios.get<AdminUserDTO>(
        `${API_BASE_URL}/api/UserManagement/GetUser/${userId}`,
        { headers }
    );
    return response.data;
}
