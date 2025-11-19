import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { ApiError } from "../../../shared/types/api.ts";
import {updatePhone, type UpdatePhoneResponse} from "../api/updatePhone.ts";

interface UpdatePhoneVars {
    phoneAuthToken: string;
}

export function useUpdatePhone(
    options?: UseMutationOptions<UpdatePhoneResponse, ApiError, UpdatePhoneVars>
) {
    return useMutation<UpdatePhoneResponse, ApiError, UpdatePhoneVars>({
        mutationFn: ({ phoneAuthToken }) => updatePhone(phoneAuthToken),
        ...options,
    });
}
