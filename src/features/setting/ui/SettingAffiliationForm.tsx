import * as React from "react"
import {useNavigate} from "react-router-dom";
import {MultiDropdownSelector} from "../../../shared/ui/dropdown/MultiDropdownSelector.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useGroupsQuery} from "../model/useGroupQuery.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {useUpdateAffiliation} from "../model/useUpdateAffiliation.ts";

export function SettingAffiliationForm() {
    const navigate=useNavigate();
    const [affiliation, setAffiliation] = React.useState<string[]>([]);
    const { mutate: updateDepartMutate, isPending } = useUpdateAffiliation();

    const { data, isLoading } = useGroupsQuery();

    const options = React.useMemo(
        () =>
            data?.items.map((g) => ({
                id: String(g.groupId),
                label: g.groupName,
            })) ?? [],
        [data]
    );

    const handleSubmit = () => {
        if (affiliation.length > 0) {
            updateDepartMutate(
                { departAt: affiliation },
                {
                    onSuccess: () => {
                        navigate("/settings");
                    },
                    onError: (error: ApiError) => {
                        if (error.code === "ERR-AUTH") {
                            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                            return;
                        }
                        alert(error.message ?? "소속 정보를 수정하는 중 오류가 발생했습니다.");
                    },
                }
            );
        } else {
            // 선택한 소속이 없으면 변경 없이 설정 화면으로 돌아갑니다.
            navigate("/settings");
        }
    };

    return (
        <div className={"flex flex-col flex-1 bg-white p-8 gradient-border w-full rounded-4xl gap-6 "}>
            <div className={"font-medium text-2xl whitespace-pre-line leading-loose"}>
                다니시는 학교나 단체,<br/>모임을 모두 선택해주세요
            </div>

            <div className={"w-full flex flex-col gap-6"}>
                <MultiDropdownSelector
                    placeholder={isLoading ? "소속단체 불러오는 중..." : "소속단체 모두 선택"}
                    searchPlaceholder="검색 키워드를 입력해주세요"
                    data={options}
                    onSelect={(items) => setAffiliation(items.map((i) => i.label))}
                />
            </div>

            <div
                className={"flex flex-row gap-3 fixed left-1/2 -translate-x-1/2 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md "}
                style={{
                    width: "min(calc(100vw - (var(--gutter,24px) * 2)), calc(var(--container-max,450px) - (var(--gutter,24px) * 2)))",
                    bottom: "max(1.5rem, env(safe-area-inset-bottom))",
                    height: "var(--bottom-nav-h,66px)",
                }}>
                <Button
                    mode="mono"
                    icon={"leftChevron"}
                    iconPosition='left'
                    onClick={()=>navigate('/settings')}
                >
                    변경 취소
                </Button>
                <Button
                    mode={"color_fill"}
                    icon={"rightChevron"}
                    iconPosition='right'
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    저장
                </Button>
            </div>
        </div>
    )
}
