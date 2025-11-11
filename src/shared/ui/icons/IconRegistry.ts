import {IcIdentify} from "./IcIdentify";
import {IcLeftArrow} from "./IcLeftArrow";
import {IcRightArrow} from "./IcRightArrow";
import {IcTrashcan} from "./IcTrashcan";
import {IcCoupon} from "./IcCoupon";
import {IcIssue} from "./IcIssue";
import {IcNotification} from "./IcNotification";
import {IcProfile} from "./IcProfile";
import {IcRight} from "./IcRight.tsx";

export const IconRegistry = {
    identify: IcIdentify,
    leftArrow: IcLeftArrow,
    rightArrow: IcRightArrow,
    trashcan: IcTrashcan,
    coupon: IcCoupon,
    issue: IcIssue,
    notification: IcNotification,
    profile: IcProfile,
    right: IcRight,
}

export type IconName = keyof typeof IconRegistry
