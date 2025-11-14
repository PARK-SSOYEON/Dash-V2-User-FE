import * as React from "react";
import {useState} from "react";
import {type IssueItem, MenuInput} from "../../shared/ui/MenuInput.tsx";
import {SlideSelector} from "../../shared/ui/SlideSelector.tsx";
import {CardSlider} from "../../shared/ui/CardSlider.tsx";
import {Button} from "../../shared/ui/buttons/Button.tsx";
import {Input} from "../../shared/ui/Input.tsx";
import {IconButton} from "../../shared/ui/buttons/IconButton.tsx";
import {CouponRequestBlock} from "../../shared/ui/CouponRequestBlock.tsx";

export default function TestPage() {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState<string | undefined>();
    const [val, setVal] = useState('항목1');
    const [val2, setVal2] = useState('항목1');

    const [items, setItems] = React.useState<IssueItem[]>([
        { id: "1", name: "오리지널 타코야끼", qty: 5 },
        { id: "2", name: "네기 타코야끼", qty: 100 },
        { id: "3", name: "눈꽃치즈 타코야끼", qty: 1000 }
    ]);


    const submit = () => {
        if (!value.trim()) {
            setError("필수 입력값이에요");
        }
    };

    const cards = [
        <div className="h-40 flex flex-1 items-center justify-center rounded-xl bg-purple-500 text-white font-bold">Card 1</div>,
        <div className="h-40 flex flex-1 items-center justify-center rounded-xl bg-cyan-500 text-white font-bold">Card 2</div>,
        <div className="h-40 flex flex-1 items-center justify-center rounded-xl bg-amber-500 text-white font-bold">Card 3</div>,
        <div className="h-40 flex flex-1 items-center justify-center rounded-xl bg-rose-500 text-white font-bold">Card 4</div>,
    ];


    return (
        <>
            <div className="flex w-full flex-col gap-4">
                <SlideSelector
                    options={['항목1', '항목2', '항목3']}
                    value={val}
                    onChange={setVal}
                />
                <SlideSelector
                    options={['항목1', '항목2', '항목3']}
                    value={val2}
                    onChange={setVal2}
                    disabledOptions={['항목3']}
                />
                <CardSlider
                    cards={cards}
                />
                <Button
                    mode="mono"
                > 테스트용 </Button>
                <Button
                    mode="color_fill"
                    icon={"identify"}
                    iconPosition='left'
                > 테스트용 </Button>
                <Button
                    mode="red_line"
                    icon={"identify"}
                    iconPosition='right'
                > 테스트용 </Button>
                <div className="flex flex-row items-center gap-2">
                    <Button
                        mode="blue_line"
                        icon={"identify"}
                        iconPosition='left'
                    > 테스트용 </Button>

                    <Input
                        label="이름"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        errorMessage={error}
                    />
                </div>
                <div className="flex w-full justify-between">
                    <IconButton
                        mode="blue_line"
                        icon={"leftArrow"}
                    />
                    <IconButton
                        mode="mono"
                        icon={"rightArrow"}
                    />
                </div>


                <Input label="입력제목" defaultValue="대충 입력값..."/>
                <Input label="입력제목"/>
                <button onClick={submit}>제출</button>

                <CouponRequestBlock
                    mode="select"
                    selected={true}
                    title="신입생 간식사업"
                    subtitle="호시 타코야끼"
                    itemCount={5}
                    amount={250000}
                    statusLabel="발행"
                />

                <CouponRequestBlock
                    mode="normal"
                    onClick={() => console.log('hello')}
                    title="신입생 간식사업"
                    itemCount={5}
                    amount={250000}
                    statusLabel="결제대기"
                />
                <MenuInput
                    items={items}
                    onChange={setItems}
                    onDelete={(id) => setItems((prev) => prev.filter((x) => x.id !== id))}
                    onAdd={() =>
                        setItems((prev) => [
                            ...prev,
                            {id: crypto.randomUUID(), name: "", qty: 0},
                        ])
                    }
                    mode={"edit"}
                />
                <MenuInput
                    items={items}
                    onChange={setItems}
                    onDelete={(id) => setItems((prev) => prev.filter((x) => x.id !== id))}
                    onAdd={() =>
                        setItems((prev) => [
                            ...prev,
                            {id: crypto.randomUUID(), name: "", qty: 0},
                        ])
                    }
                />
            </div>
        </>
    );
}
