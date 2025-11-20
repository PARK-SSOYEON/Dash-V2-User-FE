// entities/issue/api/createIssueRequest.ts
import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";
import type { Product } from "../model/productType.ts";

/**
 * 발행요청서에서 선택/입력한 파트너 정보
 */
export interface IssueRequestPartnerPayload {
    isNew: boolean;
    partnerId?: number;       // isNew === false 인 경우 필수
    partnerName?: string;     // isNew === true 인 경우 필수
    partnerPhone?: string;    // isNew === true 인 경우 필수
}

/**
 * 발행요청 생성 요청 바디
 */
export interface CreateIssueRequestBody {
    title: string;
    partner: IssueRequestPartnerPayload;
    products: Product[];      // { isNew, productId?, productName?, count }
}

export async function createIssueRequest(
    body: CreateIssueRequestBody
): Promise<void> {
    try {
        await apiClient.post("/issues/requests", body, {
            requireAuth: true,
        });
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const data = err.response?.data as ApiError | undefined;

            // 로그인 에러
            if (status === 401) {
                throw {
                    message: "로그인 정보가 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            // 형식 에러 (잘못된 body)
            if (status === 400) {
                throw {
                    message: data?.message ?? "발행요청서 정보가 올바르지 않습니다.",
                    code: data?.code ?? "ERR-IVD-VALUE",
                } as ApiError;
            }

            throw {
                message: data?.message ?? "발행요청서를 생성하는 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "발행요청서를 생성하는 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
