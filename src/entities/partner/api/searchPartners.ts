import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface PartnerItem {
    partnerId: number;
    partnerName: string;
    numbers: string; // "010-5678-5678"
}

export interface PartnerSearchResponse {
    items: PartnerItem[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface PartnerSearchParams {
    keyword: string;
    page?: number;
    size?: number;
}

export async function searchPartners(
    params: PartnerSearchParams
): Promise<PartnerSearchResponse> {
    const { keyword, page = 1, size = 10 } = params;

    try {
        const res = await apiClient.get<PartnerSearchResponse>("/partners", {
            requireAuth: true,
            params: {
                keyword,
                page,
                size,
            },
        });

        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 401) {
                throw {
                    message: "로그인이 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            throw {
                message:
                    err.response?.data?.message ??
                    "파트너 목록을 불러오는 중 오류가 발생했습니다.",
                code: err.response?.data?.code,
            } as ApiError;
        }

        throw {
            message: "파트너 목록을 불러오는 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
