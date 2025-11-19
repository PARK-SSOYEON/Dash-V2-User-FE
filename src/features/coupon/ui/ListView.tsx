import {Icon} from "../../../shared/ui/Icon.tsx";
import {useCouponPayLogQuery} from "../model/useCouponPayLogQuery.ts";

export function ListView() {
    const { data, isLoading, isError } = useCouponPayLogQuery();

    if (isLoading) {
        return (
            <div className="rounded-3xl bg-white/80 backdrop-blur gradient-border h-full flex items-center justify-center">
                <p className="text-sm text-black/50">불러오는 중...</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="rounded-3xl bg-white/80 backdrop-blur gradient-border h-full flex items-center justify-center">
                <p className="text-sm text-red-500">데이터를 불러오지 못했습니다.</p>
            </div>
        );
    }


    return (
        <div
            className={
                "rounded-3xl bg-white/80  " +
                "backdrop-blur gradient-border h-full flex"
            }
        >
            {/* 스크롤 되는 영역 */}
            <div className="flex-1 overflow-y-auto">
                {data.map((item) => (
                    <button
                        key={item.useLogId}
                        className={
                            "w-full flex items-center justify-between px-5 py-4 " +
                            "border-b border-black/5 last:border-b-0 active:bg-black/[0.03]"
                        }
                    >
                        <div className="flex flex-col gap-1 text-left min-w-0">
                            <p className="text-sm font-semibold text-black truncate">
                                {item.coupon.productName}
                            </p>
                            <div className="flex flex-row gap-2 text-[11px] text-black/50">
                                <span>{item.coupon.partnerName}</span>
                                <span>·</span>
                                <span>{item.usedAt}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center flex-shrink-0 pl-3">
                            <Icon name={"rightChevron"} size={24}/>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
