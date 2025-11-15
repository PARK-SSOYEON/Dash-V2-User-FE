import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";

import LoginRoute from "./routes/Login";
import TestPage from "./routes/TestPage.tsx";
import SignRoute from "./routes/Sign.tsx";
import IssueRoute from "./routes/Issue.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <TestPage/>},
            {path: "login", element: <LoginRoute/>},
            {path: "sign", element: <SignRoute/>},
            {path: "coupon", element: <div>쿠폰 페이지</div>},
            {path: "issue", element: <IssueRoute/>},
            {path: "settings", element: <div>환경설정</div>},
        ],
    },
]);
