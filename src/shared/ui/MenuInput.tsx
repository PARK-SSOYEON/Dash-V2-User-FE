import * as React from "react";
import { cva } from "class-variance-authority";
import {cn} from "../lib/cn.ts";
import {Icon} from "./Icon.tsx";

export type IssueItem = {
    id: string;
    name: string;
    qty: number;
};

export type MenuMode = "view" | "edit";

const panelClass = cva(
    "rounded-2xl p-6 md:p-8 bg-(--color-gray-50) border-(--color-gray-200)",
);

const headerRowClass = cva(
    "grid items-center gap-2 pb-2",
    {
        variants: {
            mode: {
                view: "grid-cols-[1fr_auto]",
                edit: "grid-cols-[1fr_96px_72px]",
            },
        },
        defaultVariants: { mode: "view" },
    }
);

const headerCellClass = cva(
    "text-base font-medium tracking-tight"
);

const rowClass = cva(
    "grid items-center gap-2 py-5",
    {
        variants: {
            mode: {
                view: "grid-cols-[1fr_auto] border-b last:border-none",
                edit: "grid-cols-[1fr_96px_72px] border-b last:border-none",
            },
        },
        defaultVariants: { mode: "view" },
    }
);
const qtyTextClass  = cva("text-lg md:text-xl font-extrabold");

const nameInputByMode = cva("w-full rounded-lg border px-3 py-2 text-base md:text-lg outline-none", {
  variants: {
    mode: {
      edit: "bg-white focus:ring-2",
      view: "bg-transparent border-transparent focus:ring-0 cursor-default select-none",
    },
  },
  defaultVariants: { mode: "view" },
});

const qtyInputByMode = cva("w-[96px] rounded-lg border px-3 py-2 text-center text-lg md:text-xl font-extrabold outline-none", {
  variants: {
    mode: {
      edit: "bg-white focus:ring-2",
      view: "bg-transparent border-transparent focus:ring-0 cursor-default select-none",
    },
  },
  defaultVariants: { mode: "view" },
});

type MenuInputProps = {
    items: IssueItem[];
    onChange: (items: IssueItem[]) => void;
    onDelete?: (id: string) => void;
    onAdd?: () => void;
    className?: string;
    mode?: MenuMode; // "view" | "edit" (default: "view")
    titleLeft?: string;   // 기본: "품목명"
    titleMid?: string;    // 기본: "발행수량"
    titleRight?: string;  // 기본: "기능" (edit 모드일 때만 보임)
};

export const MenuInput: React.FC<MenuInputProps> = ({
  items,
  onChange,
  onDelete,
  onAdd,
  className,
  mode = "view",
  titleLeft = "품목명",
  titleMid = "발행수량",
  titleRight = "기능",
}) => {
  const updateItem = React.useCallback(
    (id: string, patch: Partial<IssueItem>) => {
      const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
      onChange(next);
    },
    [items, onChange]
  );

  const handleQtyChange = (id: string, raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    const value = digits === "" ? 0 : parseInt(digits, 10);
    updateItem(id, { qty: value });
  };

  return (
    <section className={cn(panelClass(), className)}>
      <div className={headerRowClass({ mode })}>
        <div className={headerCellClass()}>{titleLeft}</div>
        <div className={cn(headerCellClass(), "text-right")}>{titleMid}</div>
        {mode === "edit" && (
          <div className={cn(headerCellClass(), "text-right")}>
            {titleRight}
          </div>
        )}
      </div>

      <ul className="divide-y">
        {items.map((it) => (
          <li key={it.id} className={rowClass({ mode })}>
            {/* 품목명 */}
            <input
              className={nameInputByMode({ mode })}
              value={it.name}
              onChange={(e) => updateItem(it.id, { name: e.target.value })}
              placeholder="제품명을 입력하세요"
              readOnly={mode === "view"}
              tabIndex={mode === "view" ? -1 : 0}
              aria-readonly={mode === "view"}
            />

            {/* 발행 수량 + 단위 */}
            <div className="flex items-center justify-end gap-1">
              <input
                className={qtyInputByMode({ mode })}
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(it.qty ?? 0)}
                onChange={(e) => handleQtyChange(it.id, e.target.value)}
                readOnly={mode === "view"}
                tabIndex={mode === "view" ? -1 : 0}
                aria-readonly={mode === "view"}
              />
              <span className={qtyTextClass()}>장</span>
            </div>

            {/* 기능 (삭제) — edit 모드에서만 표시 */}
            {mode === "edit" && (
              <button
                type="button"
                aria-label="행 삭제"
                className="ml-auto grid place-items-center rounded-full p-1 hover:opacity-80"
                onClick={() => onDelete?.(it.id)}
              >
                <Icon name={"trashcan"} size={24} />
              </button>
            )}
          </li>
        ))}
      </ul>

      {mode === "edit" && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAdd}
            className={cn(
              "w-full md:w-auto",
              "rounded-full px-6 py-4 border",
              "text-lg md:text-xl font-extrabold",
              "flex items-center justify-center gap-2"
            )}
          >
            제품 추가 <span className="text-2xl leading-none">＋</span>
          </button>
        </div>
      )}
    </section>
  );
};
