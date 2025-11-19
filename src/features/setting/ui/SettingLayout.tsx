import {CouponRequestBlock} from "../../../shared/ui/CouponRequestBlock.tsx";
import * as React from "react";
import {useLocation} from "react-router-dom";
import {useMyProfile} from "../model/useMyProfile.ts";
import type {Group} from "../../../entities/group/model/types.ts";

type Profile = {
    name: string;
    phone: string;
    affiliation: Group[];
};

export function SettingLayout({children}: { children?: React.ReactNode }) {

    const location = useLocation();
    const highlightArea = location.pathname.includes("phone")
        ? "subtitle"
        : location.pathname.includes("affiliation")
            ? "detail"
            : undefined;

    const { data } = useMyProfile();

    const profile: Profile = React.useMemo(
        () => ({
            name: data ? `${data.memberName}님` : "파트너님",
            phone: data?.number ?? "",
            affiliation: data?.groups || []
        }),
        [data]
    );

    return (
        <div className="flex flex-col pt-4 w-full gap-4 min-h-[calc(100vh-var(--bottom-nav-h,66px)-40px)]">
            <header className="flex items-center justify-between h-17">
                <h1 className="text-3xl font-bold tracking-tight text-black">
                    설정
                </h1>
            </header>

            <CouponRequestBlock
                mode="view"
                title={profile.name}
                subtitle={profile.phone}
                subtitle2={"개인회원"}
                detailText={profile.affiliation.join("    ")}
                statusLabel={""}
                highlightArea={highlightArea}
                showStatus={false}
            />

            {children}
        </div>
    )
}
