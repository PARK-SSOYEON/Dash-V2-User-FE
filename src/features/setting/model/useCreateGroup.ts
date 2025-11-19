import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {ApiError} from "../../../shared/types/api.ts";
import {createGroup, type CreateGroupBody} from "../api/createGroups.ts";

export function useCreateGroup(
    options?: UseMutationOptions<void, ApiError, CreateGroupBody>
) {
    return useMutation<void, ApiError, CreateGroupBody>({
        mutationFn: (body) => createGroup(body),
        ...options,
    });
}
