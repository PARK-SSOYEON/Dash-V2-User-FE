import { useQuery } from "@tanstack/react-query";
import {getMyCoupons, type MyCouponsResponse} from "../api/getMyCoupons.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function useMyCoupons() {
    return useQuery<MyCouponsResponse, ApiError>({
        queryKey: ["myCoupons"],
        queryFn: getMyCoupons,
    });
}
