import {SettingLayout} from "./SettingLayout";
import {useUIStore} from "../../../shared/model/uiStore.ts";
import * as React from "react";
import {SettingAffiliationForm} from "./SettingAffiliationForm.tsx";

export function SettingAffiliationPage() {
    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    React.useEffect(() => {
        hideBottomMenu();
    }, [hideBottomMenu]);

    return (
        <SettingLayout>
            <SettingAffiliationForm/>
        </SettingLayout>
    );
}
