import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";
import * as React from "react";
import type {IssueRequestDetailResponse} from "../api/getIssueRequestDetail.ts";

export function IssueRequest({issue}: {issue: IssueRequestDetailResponse}) {

    const items: DetailItem[] = [
        {
            id: "title",
            label: "요청서 제목",
            value: issue.title,
        },
        {
            id: "name",
            label: "요청자",
            value: issue.vendor.memberName,
        },
        {
            id: "phone",
            label: "연락처",
            value: issue.vendor.number,
        },
        {
            id: "request_date",
            label: "요청일시",
            value: issue.requestedAt,
        },
    ];

    const [menuItems, setMenuItems] = React.useState<IssueItem[]>(() =>
        issue.products.map((product, index) => ({
            rowId: String(product.productId ?? index + 1),
            productId: product.productId,
            isNew: !product.productId,
            name: product.productName ?? "",
            qty: product.count,
        }))
    );

    React.useEffect(() => {
        setMenuItems(
            issue.products.map((product, index) => ({
                rowId: String(product.productId ?? index + 1),
                productId: product.productId,
                isNew: !product.productId,
                name: product.productName ?? "",
                qty: product.count,
            }))
        );
    }, [issue.products]);


    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col w-full text-xl font-bold gap-4">
                기본 정보
                <DetailBox items={items}/>
            </div>

            <div className="flex flex-col w-full text-xl font-bold gap-4">
                발행품목 및 수량
                <MenuInput
                    items={menuItems}
                    onChange={setMenuItems}
                />
            </div>
        </div>
    );
}
