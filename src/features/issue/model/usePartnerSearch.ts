import { useQuery } from "@tanstack/react-query";
import {
    searchPartners,
    type PartnerSearchResponse,
} from "../../../entities/partner/api/searchPartners.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export function usePartnerSearch(
    keyword: string,
    page: number = 1,
    size: number = 10
) {
    const trimmed = keyword.trim();

    return useQuery<PartnerSearchResponse, ApiError>({
        queryKey: ["partners", { keyword: trimmed, page, size }],
        queryFn: () => searchPartners({ keyword: trimmed, page, size }),
        enabled: trimmed.length > 0,
    });
}
