import {Outlet, useLocation} from "react-router-dom";
import Layout from "./app/widget/layout.tsx";
import {BottomMenu} from "./app/widget/BottomMenu.tsx";
import {LoginBlob} from "./shared/ui/backgroud/LoginBlob.tsx";

function App() {
    const location = useLocation();
    const hideMenuPaths = ["/login", "/onboarding"];
    const isLogin = location.pathname === "/login";

    const shouldHideMenu = hideMenuPaths.includes(location.pathname);

    return (
        <>
            {/*<Header/>*/}
            {isLogin && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <LoginBlob
                        className="absolute"
                        style={{
                            left: "48%",
                            bottom: "-10%"
                        }}
                    />
                </div>
            )}

            <div className="fixed top-0 left-0 h-full z-[1]"
                 style={{width: "calc((100vw - 450px) / 2)", backgroundColor: "rgb(245, 245, 245)"}}
            />
            <div className="fixed top-0 right-0 h-full z-[1]"
                 style={{width: "calc((100vw - 450px) / 2)", backgroundColor: "rgb(245, 245, 245)"}}
            />


            <Layout>
                <Outlet/>
            </Layout>

            {!shouldHideMenu && <BottomMenu/>}
        </>
    )
}

export default App
