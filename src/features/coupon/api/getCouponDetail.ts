// entities/coupon/api/getCouponDetail.ts
import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface CouponDetailResponse {
    id: number;
    productName: string;
    partner: {
        partnerId: number;
        partnerName: string;
        phones: string[];
    };
    register: {
        memberId: number;
        memberName: string;
        memberBirth: string;
    };
    registerLog: unknown;
    isUsed: boolean;
    useLog?: unknown;
    createdAt: string;
    expiredAt: string;
}

export async function getCouponDetail(
    couponId: number
): Promise<CouponDetailResponse> {
    try {
        const res = await apiClient.get<CouponDetailResponse>(`/coupons/${couponId}`, {
            requireAuth: true,
        });
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
                    message: "본인이 등록한 쿠폰이 아닙니다.",
                    code: data.code,
                } as ApiError;
            }

            if (status === 400 && data?.code === "ERR-IVD-VALUE") {
                throw {
                    message: "유효하지 않은 쿠폰입니다.",
                    code: data.code,
                } as ApiError;
            }
        }

        throw {
            message: "쿠폰 정보를 가져오는 중 오류가 발생했습니다.",
        } as ApiError;
    }
}
