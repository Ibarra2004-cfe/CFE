import api from "../../api/api";
import { ServiceRecord, CreateServiceRecordData, UpdateServiceRecordData } from "../../types/service_records/service_record";

export const serviceRecordService = {
    getRecords: async (): Promise<ServiceRecord[]> => {
        const response = await api.get("/m9mex");
        return response.data;
    },

    getRecordById: async (id: number): Promise<ServiceRecord> => {
        const response = await api.get(`/m9mex/${id}`);
        return response.data;
    },

    createRecord: async (data: CreateServiceRecordData): Promise<ServiceRecord> => {
        const response = await api.post("/m9mex", data);
        return response.data;
    },

    updateRecord: async (id: number, data: UpdateServiceRecordData): Promise<ServiceRecord> => {
        const response = await api.put(`/m9mex/${id}`, data);
        return response.data;
    },

    deleteRecord: async (id: number): Promise<void> => {
        await api.delete(`/m9mex/${id}`);
    },
};
