import * as React from "react";
import {cva} from "class-variance-authority";
import {SignHeader} from "./SignHeader.tsx";
import {InputGroup} from "../../../shared/ui/input/InputGroup.tsx";
import {cn} from "../../../shared/lib/cn.ts";
import {DropdownSelector} from "../../../shared/ui/dropdown/DropdownSelector.tsx";

type QuestionId = 1 | 2 | 3;

const questionTitleVariants = cva("text-xl font-bold", {
    variants: {
        done: {
            true: "text-(--color-blue-500)",
            false: "text-black",
        },
    },
    defaultVariants: {
        done: false,
    },
});

const sampleData = [
    { id: '1', label: '선택자 1' },
    { id: '2', label: '선택자 2' },
    { id: '3', label: '검색어에 해당하는 선택자 1' },
    { id: '4', label: '검색어에 해당하는 선택자 2' },
    { id: '6', label: '검색어에 해당하는 선택자 3' },
    { id: '7', label: '검색어에 해당하는 선택자 4' },
    { id: '5', label: '다른 항목' },
];


function isValidBirthDate(input: string): boolean {
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(input)) return false;
    const [yyyy, mm, dd] = input.split(".").map((v) => Number(v));
    if (yyyy < 1900 || yyyy > 2025) return false;
    if (mm < 1 || mm > 12) return false;

    const monthDays: Record<number, number> = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };

    const maxDay = monthDays[mm];
    if (dd < 1 || dd > maxDay) return false;

    return true;
}

function formatBirthInput(input: string): string {
    let v = input.replace(/[^0-9]/g, "").slice(0, 8);
    if (v.length >= 5) v = v.slice(0, 4) + "." + v.slice(4);
    if (v.length >= 8) v = v.slice(0, 7) + "." + v.slice(7);
    return v;
}

export function SignForm() {
    const [name, setName] = React.useState("");
    const [birth, setBirth] = React.useState("");
    const [affiliation, setAffiliation] = React.useState("");

    const [activeQuestion, setActiveQuestion] = React.useState<1 | 2 | 3>(1);
    const [nameDone, setNameDone] = React.useState(false);
    const [birthDone, setBirthDone] = React.useState(false);
    const [affiliationDone, setAffiliationDone] = React.useState(false);
    const [birthError, setBirthError] = React.useState<string>("");
    const [birthErrorTrigger, setBirthErrorTrigger] = React.useState(false);

    const [introVisible, setIntroVisible] = React.useState(true);
    React.useEffect(() => {
        const t = setTimeout(() => setIntroVisible(false), 3000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className="relative overflow-hidden flex flex-col"
            style={{
                minHeight:
                    "calc(100vh - (env(safe-area-inset-bottom) + var(--bottom-nav-h,66px) + var(--gutter,24px) + 1rem))",
            }}
        >
            <SignHeader/>

            <div
                className={cn(
                    "mt-8 flex flex-col gap-8 transition-all duration-700",
                    introVisible ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
                )}
            >
                {(() => {
                    const questions: {
                        id: QuestionId;
                        value: string;
                        setValue: (v: string) => void;
                        done: boolean;
                        setDone: (v: boolean) => void;
                        getTitle: () => string;
                        inputLabel: string;
                    }[] = [
                        {
                            id: 1,
                            value: name,
                            setValue: setName,
                            done: nameDone,
                            setDone: setNameDone,
                            getTitle: () =>
                                nameDone && name
                                    ? `1. ${name}님, 안녕하세요!`
                                    : "1. 이용자분의 이름은 무엇인가요?",
                            inputLabel: "이름",
                        },
                        {
                            id: 2,
                            value: birth,
                            setValue: setBirth,
                            done: birthDone,
                            setDone: setBirthDone,
                            getTitle: () =>
                                birthDone && birth
                                    ? `2. ${birth.slice(5,7)}월 ${birth.slice(8,10)}일 생일이시군요! 기억할게요 😎`
                                    : "2. 생일은 언제세요?",
                            inputLabel: "생일 (YYYY.MM.DD)",
                        },
                        {
                            id: 3,
                            value: affiliation,
                            setValue: setAffiliation,
                            done: affiliationDone,
                            setDone: setAffiliationDone,
                            getTitle: () =>
                                affiliationDone && affiliation
                                    ? `3. 지금 다니시는 곳은 ${affiliation} 맞으신가요?`
                                    : "3. 지금 다니시는 학교나 회사, 단체가 있나요?",
                            inputLabel: "소속단체",
                        },
                    ];

                    const order: QuestionId[] = [1, 2, 3];

                    return order.map((id, index) => {
                        const q = questions.find((item) => item.id === id)!;
                        const prev = index > 0 ? questions.find((item) => item.id === order[index - 1])! : q;

                        const shouldShow =
                            id === 1 || prev.done || activeQuestion === id;

                        if (!shouldShow) return null;

                        const isActive = activeQuestion === id;
                        const isFilled = !!q.value;

                        const handleSubmit = () => {
                            if (!q.value.trim()) return;

                            if (id === 2) {
                                if (!isValidBirthDate(birth)) {
                                    setBirthError("생년월일이 올바르지 않습니다");
                                    setBirthErrorTrigger((prev) => !prev);
                                    return;
                                } else {
                                    setBirthError("");
                                }
                            }

                            q.setDone(true);

                            const nextId = (id + 1) as QuestionId;
                            const hasNext = order.includes(nextId);
                            if (hasNext) {
                                setActiveQuestion(nextId);
                            }
                        };

                        const handleClickTitle = () => {
                            if (q.done) {
                                setActiveQuestion(id);
                            }
                        };

                        return (
                            <div key={id} className="flex flex-col gap-4">
                                <button
                                    type="button"
                                    className="text-left"
                                    onClick={handleClickTitle}
                                >
                                    <span
                                        className={questionTitleVariants({
                                            done: q.done,
                                        })}
                                    >
                                        {q.getTitle()}
                                    </span>
                                </button>

                                {isActive && id === 3 && (
                                    <DropdownSelector
                                        placeholder="선택값을 입력해주세요"
                                        searchPlaceholder="검색 키워드를 입력해주세요"
                                        data={sampleData}
                                        onSelect={setAffiliation}
                                    />
                                )}

                                {isActive && id !== 3 && (
                                    <InputGroup
                                        label={q.inputLabel}
                                        value={q.value}
                                        onChange={
                                            id === 2
                                                ? (e) => {
                                                      q.setValue(formatBirthInput(e.target.value));
                                                  }
                                                : (e) => q.setValue(e.target.value)
                                        }
                                        rightAction={{
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                            visible: isFilled,
                                            mode: "blue_line",
                                        }}
                                        {...(id === 2
                                            ? {
                                                  errorMessage: birthError,
                                                  errorTrigger: birthErrorTrigger,
                                              }
                                            : {})}
                                    />
                                )}
                            </div>
                        );
                    });
                })()}
            </div>
        </div>
    )
}
