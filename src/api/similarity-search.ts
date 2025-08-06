import type { TMachine } from "@/types/machines";

import { api, MACHINE_TYPE_TO_FETCH } from ".";

export const fetchMachines = async (): Promise<TMachine[]> => {
  const response = await api.get("/zbot/machines/", {
    params: { limit: 100, is_deleted: false, type: MACHINE_TYPE_TO_FETCH },
  });

  return response.data.results;
};
