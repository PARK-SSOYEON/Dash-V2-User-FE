import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {updateAffiliation, type UpdateAffiliationBody} from "../api/updateAffiliation.ts";

export function useUpdateAffiliation(
    options?: UseMutationOptions<void, ApiError, UpdateAffiliationBody>
) {
    return useMutation<void, ApiError, UpdateAffiliationBody>({
        mutationFn: (body) => updateAffiliation(body),
        ...options,
    });
}
