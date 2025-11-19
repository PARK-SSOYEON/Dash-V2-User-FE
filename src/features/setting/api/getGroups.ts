import axios from "axios";
import type {GroupListResponse} from "../../../entities/group/model/types.ts";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export async function getGroups(): Promise<GroupListResponse> {
    try {
        const res = await apiClient.get<GroupListResponse>("/groups", {
            requireAuth: true,
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
                message: err.response?.data?.message ?? "소속 목록을 불러오지 못했습니다.",
                code: err.response?.data?.code,
            } as ApiError;
        }

        throw {
            message: "소속 목록을 불러오지 못했습니다.",
        } as ApiError;
    }
}
