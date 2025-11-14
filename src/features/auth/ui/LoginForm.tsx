import * as React from "react";
import {IconButton} from "../../../shared/ui/buttons/IconButton.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {LoginHeader, type HeaderStep} from "./LoginHeader.tsx";
import {InputGroup} from "../../../shared/ui/input/InputGroup.tsx";

type Step = "phone" | "otp" | "done";

// 전화번호 자동 포맷팅 (010-1234-5678)
function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function isValidPhone(formatted: string): boolean {
    return /^01[0-9]-\d{3,4}-\d{4}$/.test(formatted);
}

function isValidOtp(v: string): boolean {
    return /^\d{6}$/.test(v);
}

export function LoginForm() {
    const [step, setStep] = React.useState<Step>("phone");
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [phone, setPhone] = React.useState("");
    const phoneValid = isValidPhone(phone);

    const [otp, setOtp] = React.useState("");
    const otpValid = isValidOtp(otp);

    const headerStep: HeaderStep = step === "otp" ? "otp" : "default";

    const goNextFromPhone = () => {
        if (!phoneValid) {
            setErrorMsg("올바르지 않은 형식 (010-XXXX-XXXX)");
            return;
        }
        setErrorMsg(undefined);
        setStep("otp");
    };

    const goNextFromOtp = () => {
        if (!otpValid) {
            setErrorMsg("인증번호가 올바르지 않습니다");
            return;
        }
        setErrorMsg(undefined);
        setStep("done");
    };

    return (
        <div
            className="relative overflow-hidden flex flex-col"
            style={{
                minHeight:
                    "calc(100vh - (env(safe-area-inset-bottom) + var(--bottom-nav-h,66px) + var(--gutter,24px) + 1rem))",
            }}
        >
            <LoginHeader step={headerStep}/>

            {/* 하단 단계 컨테이너 */}
            <div className="flex-1 w-full flex items-center">
                {step === "phone" && (
                    <InputGroup
                        label="전화번호"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        inputMode="tel"
                        errorMessage={errorMsg}
                        rightAction={{
                            onClick: goNextFromPhone,
                            visible: phoneValid,
                            mode: "blue_line",
                        }}
                    />
                )}

                {step === "otp" && (
                    <InputGroup
                        label="인증번호"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        inputMode="numeric"
                        errorMessage={errorMsg}
                        leftAction={{
                            onClick: () => setStep("phone"),
                            visible: !otpValid,
                            mode: "mono",
                        }}
                        rightAction={{
                            onClick: goNextFromOtp,
                            visible: otpValid,
                            mode: "blue_line",
                        }}
                    />
                )}

                {step === "done" && (
                    <div className="flex flex-row items-center gap-2 w-full justify-center ">
                        <IconButton
                            mode="mono"
                            icon="leftArrow"
                            onClick={() => setStep("otp")}
                        />
                        <Button
                            mode="color_fill"
                            icon={"identify"}
                            iconPosition='left'
                        > 000으로 계속 </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
