import * as React from "react";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {CardSlider} from "../../../shared/ui/CardSlider.tsx";
import {CouponRegisterCard} from "./CouponRegisterCard.tsx";
import {ToggleButton} from "../../../shared/ui/buttons/ToggleButton.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {ListView} from "./ListView.tsx";
import {CouponViewCard} from "./CouponViewCard.tsx";
import {useMyCoupons} from "../model/useMyCoupons.ts";
import {useDeleteCoupons} from "../model/useDeleteCoupons.ts";
import {useQueryClient} from "@tanstack/react-query";
import type {ApiError} from "../../../shared/types/api.ts";

interface couponData {
    couponId: number;
    productName: string;
    partnerName: string;
    expiredAt: string;
    mode: 'DEFAULT' | 'EXPIRED' | 'USED';
}

export function MyCouponPage() {
    const [selectMode, setSelectMode] = React.useState(false);
    const [listMode, setListMode] = React.useState(false);

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const showBottomMenu = useUIStore((s) => s.showBottomMenu);
    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    const { data } = useMyCoupons();
    const coupons = data?.items ?? [];

    const queryClient = useQueryClient();
    const { mutate: deleteCouponsMutate, isPending: isDeleting } = useDeleteCoupons();

    React.useEffect(() => {
        if (selectMode) {
            hideBottomMenu();
        } else {
            showBottomMenu();
        }
    }, [selectMode, hideBottomMenu, showBottomMenu]);

    const handleToggleSelect = (couponId: number) => {
        const id = String(couponId);
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const getCouponMode = (expiredAt: string, isUsed: boolean): couponData["mode"] => {
        if (isUsed) return "USED";
        const date = new Date(expiredAt.replace(" ", "T"));
        if (!Number.isNaN(date.getTime()) && date.getTime() < Date.now()) {
            return "EXPIRED";
        }
        return "DEFAULT";
    };

    const couponCards = [
        ...coupons.map(coupon => {
            const id = String(coupon.couponId);
            const isSelected = selectedIds.includes(id);
            const mode = getCouponMode(coupon.expiredAt, coupon.isUsed);

            return (
                <CouponViewCard
                    key={coupon.couponId}
                    mode={mode}
                    product={{
                        couponId: coupon.couponId,
                        productName: coupon.productName,
                        partnerName: coupon.partnerName,
                        expiredAt: coupon.expiredAt,
                    }}
                    selectable={selectMode}
                    selected={isSelected}
                    onToggleSelect={handleToggleSelect}
                />
            );
        }),
        <CouponRegisterCard key={"register"}/>
    ];

    const handleDelete = () => {
        if (selectedIds.length === 0) {
            alert("삭제할 쿠폰을 선택해주세요.");
            return;
        }

        const confirmed = window.confirm(
            `${selectedIds.length}개의 쿠폰을 삭제하시겠습니까?`
        );
        if (!confirmed) return;

        const couponIds = selectedIds
            .map((id) => Number(id))
            .filter((n) => !Number.isNaN(n));

        if (couponIds.length === 0) {
            alert("유효한 쿠폰이 없습니다.");
            return;
        }

        deleteCouponsMutate(
            { coupons: couponIds },
            {
                onSuccess: () => {
                    alert("선택한 쿠폰이 삭제되었습니다.");
                    setSelectedIds([]);
                    setSelectMode(false);
                    queryClient.invalidateQueries({ queryKey: ["myCoupons"] });
                },
                onError: (error: ApiError) => {
                    if (error.code === "ERR-AUTH") {
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        return;
                    }
                    if (error.code === "ERR-NOT-YOURS") {
                        alert("본인이 등록하지 않은 쿠폰이 포함되어 있습니다.");
                        return;
                    }
                    if (error.code === "ERR-IVD-VALUE") {
                        alert("유효하지 않은 쿠폰이 포함되어 있습니다.");
                        return;
                    }
                    alert(error.message ?? "쿠폰 삭제 중 오류가 발생했습니다.");
                },
            }
        );
    }

    return (
        <div className="flex flex-col pt-4 w-full gap-3">
            <header className="flex items-center justify-between h-17">
                <div className={"flex flex-col"}>
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        내 쿠폰
                    </h1>
                    {listMode && (
                        <div className={"flex flex-row gap-2 font-light text-base items-center justify-start"}>
                            최근 사용내역
                        </div>
                    )}
                </div>

                <ToggleButton
                    leftIcon={"list"}
                    rightIcon={"select"}
                    onChange={(value) => {
                        // null | "left" | "right"
                        if (value === "right") {
                            setSelectMode(true);
                            setListMode(false);
                        } else if (value === "left") {
                            setSelectMode(false);
                            setListMode(true);
                            setSelectedIds([]);
                        } else {
                            setSelectedIds([]);
                            setSelectMode(false);
                            setListMode(false);
                        }
                    }}
                />
            </header>

            <div className="relative flex-1 w-full">
                <CardSlider
                    cards={couponCards}
                />
                {listMode && (
                    <div className="absolute inset-0 flex w-full justify-center pointer-events-none z-10">
                        <div
                            className="pointer-events-auto w-full"
                        >
                            <ListView/>
                        </div>
                    </div>
                )}
            </div>

            {selectMode && (
                <Button
                    mode="red_line"
                    icon={"trashcan"}
                    iconPosition='left'
                    className={"fixed left-1/2 -translate-x-1/2 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md px-4 "}
                    style={{
                        width: "min(calc(100vw - (var(--gutter,24px) * 2)), calc(var(--container-max,450px) - (var(--gutter,24px) * 2)))",
                        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
                        height: "var(--bottom-nav-h,66px)",
                    }}
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    삭제하기
                </Button>
            )}
        </div>
    )
}
