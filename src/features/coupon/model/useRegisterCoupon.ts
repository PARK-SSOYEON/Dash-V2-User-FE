import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {registerCoupon} from "../api/registerCoupon.ts";

interface RegisterCouponVars {
    couponId: number;
    registrationCode: string;
    signatureCode: string;
}

export function useRegisterCoupon() {
    return useMutation<void, ApiError, RegisterCouponVars>({
        mutationFn: ({ couponId, registrationCode, signatureCode }) =>
            registerCoupon(couponId, { registrationCode, signatureCode }),
    });
}
