import { useQuery } from "@tanstack/react-query";
import {getCouponPayLog} from "../api/getCouponPayLog.ts";

export function useCouponPayLogQuery() {
    return useQuery({
        queryKey: ["couponPayLog"],
        queryFn: getCouponPayLog,
        staleTime: 1000 * 10,
    });
}
