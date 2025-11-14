import { createBrowserRouter } from "react-router-dom";
import LoginRoute from "./routes/Login";
import TestPage from "./routes/TestPage.tsx";
import App from "../App.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <TestPage /> },
            { path: "login", element: <LoginRoute /> },
            { path: "coupon", element: <div>쿠폰 페이지</div> },
            { path: "settings", element: <div>환경설정</div> },
        ],
    },
]);
