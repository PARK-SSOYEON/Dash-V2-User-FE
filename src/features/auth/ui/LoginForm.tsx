import * as React from "react";
import {LoginHeader, type HeaderStep} from "./LoginHeader";
import {formatPhone, isValidPhone} from "../../../shared/lib/phone.ts";
import {isValidOtp} from "../../../shared/lib/otp.ts";
import {InputGroup} from "../../../shared/ui/input/InputGroup.tsx";
import {IconButton} from "../../../shared/ui/buttons/IconButton.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useUIStore} from "../../../shared/model/uiStore.ts";

type Step = "phone" | "otp" | "done";

export function LoginForm() {
    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    React.useEffect(() => {
        hideBottomMenu();
    }, []);

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
