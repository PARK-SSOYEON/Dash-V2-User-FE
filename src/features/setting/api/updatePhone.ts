import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface UpdatePhoneResponse {
    accessToken: string;
}

export async function updatePhone(
    phoneAuthToken: string
): Promise<UpdatePhoneResponse> {
    try {
        const res = await apiClient.patch<UpdatePhoneResponse>(
            "/users/phone",
            { phoneAuthToken },
            { requireAuth: true }
        );

        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const data = err.response?.data as ApiError | undefined;

            // 로그인 에러 (토큰 만료/없음 등)
            if (status === 401 && !data?.code) {
                throw {
                    message: "로그인 정보가 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            // 올바르지 않은 phoneAuthToken
            if (status === 401 && data?.code === "ERR-IVD-VALUE") {
                throw {
                    message: "올바르지 않은 인증 정보입니다. 다시 인증을 진행해주세요.",
                    code: data.code,
                } as ApiError;
            }

            throw {
                message: data?.message ?? "전화번호 변경 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "전화번호 변경 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
