import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {uploadSignatureApi, type UploadSignatureResponse} from "../api/uploadSignature.ts";

export function useUploadSignature() {
    return useMutation<UploadSignatureResponse, ApiError, File | Blob>({
        mutationFn: (file) => uploadSignatureApi(file),
    });
}
