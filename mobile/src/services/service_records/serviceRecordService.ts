import { api } from "../../api/client"; // o donde tengas axios
import { ServiceRecord } from "../../types/service_records/service_record";

export const serviceRecordService = {
  async getRecords(): Promise<ServiceRecord[]> {
    const { data } = await api.get("/m9mex");
    return data;
  },

  async getRecordById(id: number): Promise<ServiceRecord> {
    const { data } = await api.get(`/m9mex/${id}`);
    return data;
  },

  async createRecord(payload: any): Promise<ServiceRecord> {
    const { data } = await api.post("/m9mex", payload);
    return data;
  },

  // ✅ NUEVO
  async updateRecord(id: number, payload: any): Promise<ServiceRecord> {
    const { data } = await api.patch(`/m9mex/${id}`, payload);
    return data;
  },

  async deleteRecord(id: number) {
    await api.delete(`/m9mex/${id}`);
  },
};
