import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {createIssueRequest, type CreateIssueRequestBody} from "../api/createIssueRequest.ts";

export function useCreateIssueRequest(
    options?: UseMutationOptions<void, ApiError, CreateIssueRequestBody>
) {
    return useMutation<void, ApiError, CreateIssueRequestBody>({
        mutationFn: (body) => createIssueRequest(body),
        ...options,
    });
}
