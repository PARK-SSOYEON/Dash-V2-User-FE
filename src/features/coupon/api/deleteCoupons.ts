import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface DeleteCouponsRequest {
    coupons: number[];
}

export async function deleteCoupons(req: DeleteCouponsRequest): Promise<void> {
    try {
        await apiClient.delete("/coupons", {
            data: req,
            requireAuth: true,
        });
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const data = err.response?.data as ApiError | undefined;

            if (status === 401) {
                throw {
                    message: "로그인 정보가 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            if (status === 403 && data?.code === "ERR-NOT-YOURS") {
                throw {
                    message: "본인이 등록한 쿠폰이 아닙니다.",
                    code: data.code,
                } as ApiError;
            }

            if (status === 400 && data?.code === "ERR-IVD-VALUE") {
                throw {
                    message: "유효하지 않은 쿠폰이 포함되어 있습니다.",
                    code: data.code,
                } as ApiError;
            }

            throw {
                message: data?.message ?? "쿠폰 삭제 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "쿠폰 삭제 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
