import { apiClient } from "../../../shared/lib/apiClient";
import axios from "axios";
import type { ApiError } from "../../../shared/types/api";

export interface CouponPayLogItem {
    useLogId: number;
    coupon: {
        couponId: number;
        productName: string;
        partnerName: string;
        isUsed: boolean;
        createdAt: string;
        expiredAt: string;
    };
    usedAt: string;
}

export interface CouponPayLogResponse {
    items: CouponPayLogItem[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export async function getCouponPayLog(): Promise<CouponPayLogItem[]> {
    try {
        const res = await apiClient.get<CouponPayLogResponse>("/coupons/pay/log", {
            requireAuth: true,
        });
        return res.data.items;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 401) {
                throw {
                    message: "로그인 정보가 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }
        }

        throw {
            message: "사용 기록을 불러오지 못했습니다.",
        } as ApiError;
    }
}
