import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";

import LoginRoute from "./routes/Login";
import TestPage from "./routes/TestPage.tsx";
import SignRoute from "./routes/Sign.tsx";
import IssueRoute from "./routes/Issue.tsx";
import IssueCreateRoute from "./routes/NewIssue.tsx";
import IssueDetailRoute from "./routes/IssueDetailView.tsx";
import SettingsRoute from "./routes/Settings.tsx";
import SettingPhoneRoute from "./routes/SettingPhone.tsx";
import SettingAffiliationRoute from "./routes/SettingAffiliation.tsx";
import MyCouponRoute from "./routes/MyCoupon.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <TestPage/>},
            {path: "login", element: <LoginRoute/>},
            {path: "sign", element: <SignRoute/>},
            {path: "coupon", element: <MyCouponRoute/>},
            {path: "issue", element: <IssueRoute/>},
            {path: "issue/new", element: <IssueCreateRoute/>},
            {path: "issue/:id", element: <IssueDetailRoute/>},
            {path: "settings", element: <SettingsRoute/>},
            {path: "settings/phone", element: <SettingPhoneRoute/>},
            {path: "settings/affiliation", element: <SettingAffiliationRoute/>}
        ],
    },
]);
