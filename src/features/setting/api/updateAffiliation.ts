import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface UpdateAffiliationBody {
    departAt: string[];
}

export async function updateAffiliation(body: UpdateAffiliationBody): Promise<void> {
    try {
        await apiClient.put("/users/depart", body, {
            requireAuth: true,
        });
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const data = err.response?.data as ApiError | undefined;

            if (status === 401) {
                throw {
                    message: "로그인이 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            if (status === 400) {
                throw {
                    message: data?.message ?? "올바르지 않은 소속 ID가 포함되어 있습니다.",
                    code: data?.code ?? "ERR-IVD-DEPART",
                } as ApiError;
            }

            throw {
                message: data?.message ?? "소속 정보를 수정하는 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "소속 정보를 수정하는 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
