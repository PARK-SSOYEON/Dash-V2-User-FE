import React from "react";

type SlideSelectorProps = {
    options: string[];
    value: string;
    onChange: (next: string) => void;
    className?: string;
};

export const SlideSelector: React.FC<SlideSelectorProps> = ({ options, value, onChange, className }) => {
    const [pressed, setPressed] = React.useState<string | null>(null);

    const activeIndex = Math.max(0, options.findIndex((o) => o === value));
    const pressedIndex = pressed ? options.findIndex((o) => o === pressed) : -1;
    const highlightIndex = pressedIndex !== -1 ? pressedIndex : activeIndex;


    return (
        <nav
            className={
                "relative rounded-full bg-white border border-gray-300 px-1 py-1 " +
                (className ?? "")
            }
            aria-label="Slide selector"
        >
            <ul className="grid h-12 w-full items-stretch relative" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
                {(
                    <span
                        aria-hidden
                        className={
                            "absolute top-1/2 left-0 pointer-events-none rounded-full " +
                            " transition-[left,transform,opacity,background-color,box-shadow] duration-250 ease-[cubic-bezier(0.34,1.2,0.68,1)] will-change-[left,transform,opacity] bg-blue-500"
                        }
                        style={{
                            width: `min(180px, calc(100%/${options.length} - 12px))`,
                            height: "43px",
                            left: `calc(${Math.max(0, highlightIndex)} * (100% / ${options.length}) + (50% / ${options.length}))`,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                )}

                {options.map((opt) => {
                    const isActive = opt === value;
                    const isOptPressed = pressed === opt;
                    const hasPressed = pressed !== null;
                    const baseClass = "font-bold text-base"

                    const colorClass = hasPressed
                        ? (isOptPressed ? "text-white " : "text-gray-600 ")
                        : (isActive ? "text-white " : "text-gray-600 ");

                    return (
                        <li key={opt} className="flex">
                            <button
                                type="button"
                                className="relative z-10 grid place-items-center w-full rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                aria-pressed={isActive}
                                onPointerDown={() => setPressed(opt)}
                                onPointerUp={() => setPressed(null)}
                                onPointerLeave={() => setPressed(null)}
                                onPointerCancel={() => setPressed(null)}
                                onClick={() => onChange(opt)}
                            >
                                <span
                                    className={`${colorClass} ${baseClass} transition-colors duration-300`}>{opt}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
