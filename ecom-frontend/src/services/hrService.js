import axiosInstance from '../utils/axiosInstance';

// Helper to interact with LocalStorage for Mock Data
const getMockData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setMockData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ========================
// EMPLOYEE ACCOUNTS (MOCK)
// ========================
export const getAllEmployees = async () => {
    try {
        const res = await axiosInstance.get('/admin/employees');
        if (Array.isArray(res.data) && res.data.length > 0) return res;
        throw new Error("No data");
    } catch {
        const mockEmps = getMockData('mock_employees');
        if (mockEmps.length === 0) {
            const initial = [
                { employee_id: 1, name: 'Alice Smith', email: 'alice@shopvibe.com', role: 'Support Agent', department: 'Customer Service' },
                { employee_id: 2, name: 'Bob Jones', email: 'bob@shopvibe.com', role: 'Warehouse Manager', department: 'Operations' },
            ];
            setMockData('mock_employees', initial);
            return { data: initial };
        }
        return { data: mockEmps };
    }
}

export const createEmployee = async (data) => {
    try {
        return await axiosInstance.post('/admin/employees', data);
    } catch {
        const emps = getMockData('mock_employees');
        const newEmp = { ...data, employee_id: Date.now() };
        setMockData('mock_employees', [...emps, newEmp]);
        return { data: newEmp };
    }
}

// ========================
// ATTENDANCE (MOCK)
// ========================
export const recordAttendance = async (userEmail, status) => {
    try {
        // Real API attempt
        return await axiosInstance.post('/employee/attendance', { status, date: new Date().toISOString() });
    } catch {
        // Mock fallback
        const logs = getMockData('mock_attendance');
        const today = new Date().toISOString().split('T')[0];
        
        // Remove existing record for today if any
        const filtered = logs.filter(log => !(log.userEmail === userEmail && log.date === today));
        
        const newRecord = { id: Date.now(), userEmail, status, date: today, timestamp: new Date().toISOString() };
        setMockData('mock_attendance', [...filtered, newRecord]);
        return { data: newRecord };
    }
}

export const getMyAttendance = async (userEmail) => {
    try {
        const res = await axiosInstance.get(`/employee/attendance`);
        if (!Array.isArray(res.data)) throw new Error("Invalid response");
        return res;
    } catch {
        const logs = getMockData('mock_attendance');
        return { data: logs.filter(l => l.userEmail === userEmail).sort((a,b) => new Date(b.date) - new Date(a.date)) };
    }
}

export const getAllAttendance = async () => {
    try {
        const res = await axiosInstance.get(`/admin/attendance`);
        if (!Array.isArray(res.data)) throw new Error("Invalid response");
        return res;
    } catch {
        return { data: getMockData('mock_attendance') };
    }
}

// ========================
// LEAVES (MOCK)
// ========================
export const applyForLeave = async (userEmail, leaveData) => {
    try {
        return await axiosInstance.post('/employee/leaves', leaveData);
    } catch {
        const leaves = getMockData('mock_leaves');
        const newLeave = {
            id: Date.now(),
            userEmail,
            ...leaveData,
            status: 'Pending',
            appliedOn: new Date().toISOString()
        };
        setMockData('mock_leaves', [...leaves, newLeave]);
        return { data: newLeave };
    }
}

export const getMyLeaves = async (userEmail) => {
    try {
        const res = await axiosInstance.get(`/employee/leaves`);
        if (!Array.isArray(res.data)) throw new Error("Invalid response");
        return res;
    } catch {
        const leaves = getMockData('mock_leaves');
        return { data: leaves.filter(l => l.userEmail === userEmail).sort((a,b) => new Date(b.appliedOn) - new Date(a.appliedOn)) };
    }
}

export const getAllLeaves = async () => {
    try {
        const res = await axiosInstance.get(`/admin/leaves`);
        if (!Array.isArray(res.data)) throw new Error("Invalid response");
        return res;
    } catch {
        const leaves = getMockData('mock_leaves');
        return { data: leaves.sort((a,b) => new Date(b.appliedOn) - new Date(a.appliedOn)) };
    }
}

export const updateLeaveStatus = async (leaveId, status) => {
    try {
        return await axiosInstance.put(`/admin/leaves/${leaveId}`, { status });
    } catch {
        const leaves = getMockData('mock_leaves');
        const updated = leaves.map(l => l.id === leaveId ? { ...l, status } : l);
        setMockData('mock_leaves', updated);
        return { data: { success: true } };
    }
}
