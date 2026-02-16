import { API_URL } from "../../config";

export const padronService = {
  async getByRpu(rpu: string) {
    const clean = (rpu || "").trim();
    if (!clean) return null;

    const res = await fetch(`${API_URL}/padron/rpu/${encodeURIComponent(clean)}`);

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Padron ${res.status}: ${txt}`);
    }

    const json = await res.json().catch(() => null);
    return json?.data ?? null;
  },
};
