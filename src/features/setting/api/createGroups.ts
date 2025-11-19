import axios from "axios";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface CreateGroupBody {
    groupName: string;
}

export async function createGroup(body: CreateGroupBody): Promise<void> {
    try {
        await apiClient.post("/groups", body, {
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

            // 주어진 스펙에 'ERR-DUP-VAULE' 오타지만 그대로 맞춰줌
            if (status === 400 && data?.code === "ERR-DUP-VAULE") {
                throw {
                    message: "이미 동일한 이름의 단체가 존재합니다.",
                    code: data.code,
                } as ApiError;
            }

            throw {
                message: data?.message ?? "소속 생성 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "소속 생성 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
