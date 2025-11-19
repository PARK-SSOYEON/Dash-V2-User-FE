import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface CouponByRegistrationCodeResponse {
    couponId: number;
    productName: string;
    partnerName: string;
    createdAt: string;
    expiredAt: string;
}

export async function getCouponByRegistrationCode(
    registrationCode: string
): Promise<CouponByRegistrationCodeResponse> {
    try {
        const res = await apiClient.post<CouponByRegistrationCodeResponse>(
            "/coupons/add",
            { registrationCode },
            { requireAuth: true }
        );
        return res.data;
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
                    message: "유효하지 않은 등록코드입니다.",
                    code: data.code,
                } as ApiError;
            }

            throw {
                message: data?.message ?? "쿠폰 정보를 불러오는 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "쿠폰 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
