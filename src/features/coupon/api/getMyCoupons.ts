import axios from "axios";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface MyCoupon {
    couponId: number;
    productName: string;
    partnerName: string;
    isUsed: boolean;
    signature: string; // 이미지 URL
    createdAt: string; // "YYYY-MM-DD HH:MM:SS"
    expiredAt: string; // "YYYY-MM-DD HH:MM:SS"
}

export interface MyCouponsResponse {
    items: MyCoupon[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export async function getMyCoupons(): Promise<MyCouponsResponse> {
    try {
        const res = await apiClient.get<MyCouponsResponse>("/coupons", {
            requireAuth: true,
        });
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 401) {
                throw {
                    message: "로그인 정보가 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            throw {
                message: err.response?.data?.message ?? "쿠폰 목록을 불러오지 못했습니다.",
                code: err.response?.data?.code,
            } as ApiError;
        }

        throw {
            message: "알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
