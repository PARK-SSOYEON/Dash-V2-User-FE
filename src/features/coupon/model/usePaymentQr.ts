import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { ApiError } from "../../../shared/types/api.ts";
import {requestPaymentQr, type RequestPaymentQrBody, type RequestPaymentQrResponse} from "../api/requestPaymentQr.ts";

export function usePaymentQr(
    options?: UseMutationOptions<
        RequestPaymentQrResponse,
        ApiError,
        RequestPaymentQrBody
    >
) {
    return useMutation<RequestPaymentQrResponse, ApiError, RequestPaymentQrBody>({
        mutationFn: (body) => requestPaymentQr(body),
        ...options,
    });
}
