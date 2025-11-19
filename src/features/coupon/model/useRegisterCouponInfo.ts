import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {
    type CouponByRegistrationCodeResponse,
    getCouponByRegistrationCode
} from "../api/getCouponByRegistrationCode.ts";

interface Vars {
    registrationCode: string;
}

export function useRegisterCouponInfo() {
    return useMutation<CouponByRegistrationCodeResponse, ApiError, Vars>({
        mutationFn: ({ registrationCode }) =>
            getCouponByRegistrationCode(registrationCode),
    });
}
