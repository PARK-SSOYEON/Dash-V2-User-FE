import {IcIdentify} from "./IcIdentify";
import {IcLeftArrow} from "./IcLeftArrow";
import {IcRightArrow} from "./IcRightArrow";
import {IcTrashcan} from "./IcTrashcan";
import {IcCoupon} from "./IcCoupon";
import {IcIssue} from "./IcIssue";
import {IcNotification} from "./IcNotification";
import {IcProfile} from "./IcProfile";
import {IcRight} from "./IcRight.tsx";
import {IcDownChevron} from "./IcDownChevron.tsx";
import {IcUpChevron} from "./IcUpChevron.tsx";
import {IcRightChevron} from "./IcRightChevron.tsx";
import {IcSelect} from "./IcSelect.tsx";
import {IcList} from "./IcList.tsx";

export const IconRegistry = {
    identify: IcIdentify,
    leftArrow: IcLeftArrow,
    rightArrow: IcRightArrow,
    downChevron: IcDownChevron,
    upChevron: IcUpChevron,
    rightChevron: IcRightChevron,
    trashcan: IcTrashcan,
    coupon: IcCoupon,
    issue: IcIssue,
    notification: IcNotification,
    profile: IcProfile,
    right: IcRight,
    select: IcSelect,
    list: IcList,
}

export type IconName = keyof typeof IconRegistry
