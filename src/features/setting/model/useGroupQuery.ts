import { useQuery } from "@tanstack/react-query";
import type {GroupListResponse} from "../../../entities/group/model/types.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {getGroups} from "../api/getGroups.ts";

export function useGroupsQuery() {
    return useQuery<GroupListResponse, ApiError>({
        queryKey: ["groups"],
        queryFn: getGroups,
        staleTime: 1000 * 60, // 1분 정도 캐싱
    });
}
