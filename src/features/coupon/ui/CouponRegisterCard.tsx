import React, {useState, useRef, useCallback} from 'react';
import {SignatureCanvasComponent, type SignatureCanvasRef} from "./SignatureCanvasComponent.tsx";
import {QRScanner} from "./QRScanner.tsx";
import {Icon} from "../../../shared/ui/Icon.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useRegisterCouponInfo} from "../model/useRegisterCouponInfo.ts";
import {useUploadSignature} from "../model/useUploadSignature.ts";
import {useRegisterCoupon} from "../model/useRegisterCoupon.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {useNavigate} from "react-router-dom";

interface ProductData {
    couponId: number;
    productName: string;
    partnerName: string;
    createdAt: string;
    expiredAt: string;
}

type Step = 'INSTRUCTION' | 'REGISTER' | 'COMPLETE';

function dataURLToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export const CouponRegisterCard: React.FC = () => {
    const [step, setStep] = useState<Step>('INSTRUCTION');
    const [product, setProduct] = useState<ProductData | null>(null);
    const [registrationCode, setRegistrationCode] = useState<string | null>(null);

    React.useEffect(() => {
        if (step === 'COMPLETE') {
            const timer = setTimeout(() => {
                setStep('INSTRUCTION');
                setProduct(null);
                setRegistrationCode(null);
                sigCanvas.current?.clear();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const sigCanvas = useRef<SignatureCanvasRef | null>(null);
    const qrScannerId = 'reader';

    const { mutate: fetchCouponByCode } = useRegisterCouponInfo();
    const { mutate: uploadSignature, isPending } = useUploadSignature();
    const { mutate: registerCoupon, isPending: isRegistering } = useRegisterCoupon();
    const navigate = useNavigate();

    // --- Step 1: INSTRUCTION ---
    const instructionContent = (
        <button className="flex flex-col items-center justify-center w-full h-full p-8 text-center space-y-4"
                onClick={() => setStep('REGISTER')}>
            <Icon name={"addCoupon"} size={103}/>
            <span className="text-base font-medium text-black/40">지류 교환권이나 등록코드가 있다면 <br/> 여기서 등록 후 사용할 수 있어요 </span>
        </button>
    );

    // --- Step 2: QR Scanning Logic ---
    const handleScanSuccess = useCallback((decodedText: string) => {
        console.log("QR Code Scanned:", decodedText);

        fetchCouponByCode(
            { registrationCode: decodedText },
            {
                onSuccess: (data: ProductData) => {
                    setProduct(data);
                    setRegistrationCode(decodedText);
                },
                onError: (error: ApiError) => {
                    if (error.code === "ERR-AUTH") {
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        navigate("/login");
                        return;
                    }
                    if (error.code === "ERR-NOT-YOURS") {
                        alert("이미 다른 사람에게 등록된 쿠폰입니다.");
                        return;
                    }
                    if (error.code === "ERR-IVD-VALUE") {
                        alert("유효하지 않은 등록코드입니다.");
                        return;
                    }
                    alert(error.message ?? "쿠폰 정보를 불러오는 중 오류가 발생했습니다.");
                },
            }
        );
    }, [fetchCouponByCode, navigate]);

    const handleRegister = () => {
        if (!product) {
            alert("먼저 쿠폰을 인식해주세요.");
            return;
        }

        if (!registrationCode) {
            alert("등록코드 정보를 찾을 수 없습니다. 다시 시도해주세요.");
            return;
        }

        if (sigCanvas.current?.isEmpty()) {
            alert("서명을 먼저 해주세요.");
            console.log("서명을 먼저 해주세요.");
            return;
        }

        const dataUrl = sigCanvas.current?.getDataURL();
        if (!dataUrl) {
            alert("서명 이미지 생성에 실패했습니다.");
            return;
        }

        const file = dataURLToFile(dataUrl, "signature.png");

        uploadSignature(file, {
            onSuccess: (res) => {
                const signatureCode = res.signatureCode;
                registerCoupon(
                    {
                        couponId: product.couponId,
                        registrationCode,
                        signatureCode,
                    },
                    {
                        onSuccess: () => {
                            setStep("COMPLETE");
                        },
                        onError: (error: ApiError) => {
                            if (error.code === "ERR-AUTH") {
                                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                                navigate("/login");
                                return;
                            }
                            if (error.code === "ERR-NOT-YOURS") {
                                alert("이미 다른 사람에게 등록된 쿠폰입니다.");
                                return;
                            }
                            if (error.code === "ERR-IVD-VALUE") {
                                alert("유효하지 않은 등록코드이거나 서명 정보가 올바르지 않습니다.");
                                return;
                            }
                            alert(error.message ?? "쿠폰 등록 중 오류가 발생했습니다.");
                        },
                    }
                );
            },
            onError: (error: ApiError) => {
                if (error.code === "ERR-AUTH") {
                    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/login");
                    return;
                }
                if (error.code === "ERR-SIZE-EXCEED") {
                    alert("서명 이미지 용량이 너무 큽니다. 다시 시도해주세요.");
                    return;
                }
                alert(error.message ?? "서명 업로드 중 오류가 발생했습니다.");
            },
        });
    };

    const registerContent = (
        <div className="flex flex-col w-full items-center justify-center h-full p-6 text-center">
            {!product && (
                <QRScanner onScanSuccess={handleScanSuccess} scannerId={qrScannerId}/>
            )}
            {product && (
                <div className="flex-grow bg-white border border-gray-300 rounded-3xl overflow-hidden shadow-inner">
                    <SignatureCanvasComponent
                        canvasRef={sigCanvas} // ref 전달
                        width={400} // 캔버스 실제 해상도 설정
                        height={350} // 캔버스 실제 해상도 설정
                    />
                </div>
            )}

            <div className="flex flex-col w-full mt-6 p-4 justify-start text-left">
                <p className="font-bold text-lg text-black">{product?.productName || "상품명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">{product?.partnerName || "파트너명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">
                    {product?.expiredAt ? `유효 기간 ~${product.expiredAt}` : "유효기간 인식중..."}
                </p>
            </div>

        </div>
    )


    // --- Step 3: Complete Logic ---
    const completeContent = (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center space-y-4">
            <Icon name={"check"} size={115}/>
            <span className="text-base font-medium text-(--color-blue-500)">쿠폰이 정상적으로 등록됐어요!</span>
        </div>
    );

    // --- Render based on Step ---
    const renderContent = () => {
        switch (step) {
            case 'INSTRUCTION':
                return instructionContent;
            case 'REGISTER':
                return registerContent;
            case 'COMPLETE':
                return completeContent;
            default:
                return <div className="p-8">알 수 없는 단계입니다.</div>;
        }
    };

    return (
        <div className={"flex flex-col gap-4 w-full min-h-[calc(100vh-var(--header-h,68px)-var(--bottom-nav-h,66px)-200px)]"}>
            <div
                className={"flex flex-1 flex-col pt-4 w-full h-full gap-4 rounded-3xl " +
                    "bg-white/80 backdrop-blur shadow-[0_0_4px_rgba(0,0,0,0.2)] items-center justify-center"}>
                {renderContent()}
            </div>

            {(product && step === 'REGISTER') &&
                <div className={"flex w-full"}>
                    <Button mode="color_fill" onClick={handleRegister} disabled={isPending || isRegistering}>
                        {isPending || isRegistering ? "등록 중..." : "쿠폰 등록"}
                    </Button>
                </div>}
        </div>

    );
};
