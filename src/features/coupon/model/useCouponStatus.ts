import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {type CouponDetailResponse, getCouponDetail} from "../api/getCouponDetail.ts";

interface CouponStatusVars {
    couponId: number;
}

export function useCouponStatus() {
    return useMutation<CouponDetailResponse, ApiError, CouponStatusVars>({
        mutationFn: ({ couponId }) => getCouponDetail(couponId),
    });
}
