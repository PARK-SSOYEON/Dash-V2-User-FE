import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {deleteCoupons, type DeleteCouponsRequest} from "../api/deleteCoupons.ts";

export function useDeleteCoupons(
    options?: UseMutationOptions<void, ApiError, DeleteCouponsRequest>
) {
    return useMutation<void, ApiError, DeleteCouponsRequest>({
        mutationFn: (req) => deleteCoupons(req),
        ...options,
    });
}
