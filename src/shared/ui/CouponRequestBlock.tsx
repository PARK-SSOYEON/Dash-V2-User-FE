import {Icon} from "./Icon.tsx";
import {cva} from 'class-variance-authority';
import {cn} from "../lib/cn.ts";

export type CouponRequestMode = 'normal' | 'select' | 'view';

const statusColorClassMap: Record<string, string> = {
    대기중: 'text-(--color-gray-500)',
    결제대기: 'text-(--color-yellow-500)',
    발행: 'text-(--color-blue-500)',
    반려: 'text-(--color-red-300)',
    배부: 'text-(--color-green-500)',
    사용완료: 'text-(--color-gray-500)',
};

export interface CouponRequestBlockProps {
    mode: CouponRequestMode;
    selected?: boolean; //선택 모드 (선택 여부)
    onClick?: () => void; //일반모드 (클릭 시 이동)

    title: string;
    subtitle?: string;
    itemCount?: number;
    amount?: number;
    statusLabel: string;
}

const couponRequestBlock = cva(
    'w-full rounded-[36px] bg-white px-8 py-6 flex items-center justify-between transition-shadow',
    {
        variants: {
            selected: {
                true: 'border-(--color-blue-500) border-2',
                false: 'gradient-border',
            },
            mode: {
                normal: 'cursor-pointer',
                view: 'cursor-default',
                select: 'cursor-pointer',
            },
        },
        defaultVariants: {
            selected: false,
            mode: 'normal',
        },
    }
);

export const CouponRequestBlock = ({
    mode,
    selected = false,
    onClick,
    title,
    subtitle,
    itemCount,
    amount,
    statusLabel,
}: CouponRequestBlockProps) => {
    const isClickable = mode !== 'view';
    const borderSelected = selected && mode === 'select';
    const colorClass = statusColorClassMap[statusLabel] ?? 'text-(--color-gray-500)';

    const baseClasses = cn(
        couponRequestBlock({ selected: borderSelected, mode })
    );

    const detailText = [
        typeof itemCount === 'number' ? `${itemCount}개 품목` : undefined,
        typeof amount === 'number' ? `${amount.toLocaleString('ko-KR')}원` : undefined,
    ]
        .filter(Boolean)
        .join('  \u00B7  '); // 중점 구분자

    return (
        <div
            className={baseClasses}
            onClick={isClickable ? onClick : undefined}
            role={isClickable ? 'button' : undefined}
        >
            {/* 왼쪽 텍스트 영역 */}
            <div className="min-w-0">
                <div className="text-black text-xl font-bold truncate">{title}</div>
                {subtitle ? <div className="mt-0.5 text-sm text-black truncate">{subtitle}</div> : null}
                {detailText ? <div className="mt-2 text-base font-normal text-(--color-gray-400)">{detailText}</div> : null}
            </div>

            <div className="flex items-center gap-2 shrink-0">
        <span className={[
            'text-xl font-bold',
            colorClass,
        ].join(' ')}>
          {statusLabel}
        </span>
                <Icon name={"right"} size={24}/>
            </div>
        </div>
    );
}
