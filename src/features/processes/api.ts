import { apiClient } from "@/services/global.api";

export async function killProcess(pid: number) {
  return apiClient.delete(`/processes/kill/${pid}`);
}

export async function terminateProcess(pid: number) {
  return apiClient.delete(`/processes/terminate/${pid}`);
}
