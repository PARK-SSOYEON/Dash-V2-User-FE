import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface UploadSignatureResponse {
    signatureCode: string;
}

export async function uploadSignatureApi(
    file: File | Blob
): Promise<UploadSignatureResponse> {
    try {
        const formData = new FormData();
        formData.append("signature", file);

        const res = await apiClient.post<UploadSignatureResponse>(
            "/upload/signature",
            formData,
            {
                requireAuth: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
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

            if (status === 500 && data?.code === "ERR-SIZE-EXCEED") {
                throw {
                    message: "서명 이미지 용량이 너무 큽니다.",
                    code: "ERR-SIZE-EXCEED",
                } as ApiError;
            }

            throw {
                message: data?.message ?? "서명 업로드 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "서명 업로드 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
