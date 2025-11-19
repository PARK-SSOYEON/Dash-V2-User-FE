import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

interface RegisterCouponBody {
    registrationCode: string;
    signatureCode: string;
}

export async function registerCoupon(
    couponId: number,
    body: RegisterCouponBody
): Promise<void> {
    try {
        await apiClient.post(`/coupons/add/${couponId}`, body, {
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

            if (status === 403 && data?.code === "ERR-NOT-YOURS") {
                throw {
                    message: "이미 다른 사람에게 등록된 쿠폰입니다.",
                    code: data.code,
                } as ApiError;
            }

            if (status === 400 && data?.code === "ERR-IVD-VALUE") {
                throw {
                    message: "유효하지 않은 등록코드이거나 서명 정보가 올바르지 않습니다.",
                    code: data.code,
                } as ApiError;
            }

            throw {
                message: data?.message ?? "쿠폰 등록 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "쿠폰 등록 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
