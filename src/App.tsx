import * as React from 'react';

import {Button} from "./shared/ui/buttons/Button.tsx";
import {Input} from "./shared/ui/Input.tsx";
import Layout from "./app/widget/layout.tsx";
import {BottomMenu} from "./app/widget/BottomMenu.tsx";
import {IconButton} from "./shared/ui/buttons/IconButton.tsx";

function App() {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState<string | undefined>();

    const submit = () => {
        if (!value.trim()) {
            setError("필수 입력값이에요");
        }
    };

    return (
        <Layout>
            <div className="flex w-full flex-col gap-4">

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

                <Button
                    mode="mono"
                    icon={"identify"}
                    iconPosition='left'
                > 테스트용 </Button>
                <Button
                    mode="color_fill"
                    icon={"identify"}
                    iconPosition='left'
                > 테스트용 </Button>
                <Button
                    mode="red_line"
                    icon={"identify"}
                    iconPosition='left'
                > 테스트용 </Button>
                <Button
                    mode="mono"
                    icon={"identify"}
                    iconPosition='right'
                > 테스트용 </Button>
                <Button
                    mode="color_fill"
                    icon={"identify"}
                    iconPosition='right'
                > 테스트용 </Button>
                <Button
                    mode="red_line"
                    icon={"identify"}
                    iconPosition='right'
                > 테스트용 </Button>
            </div>
            <BottomMenu/>

        </Layout>
    );
}

export default App
