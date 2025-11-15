import {Outlet, useLocation} from "react-router-dom";
import Layout from "./app/widget/layout.tsx";
import {BottomMenu} from "./app/widget/BottomMenu.tsx";
import {LoginBlob} from "./shared/ui/backgroud/LoginBlob.tsx";
import {useUIStore} from "./shared/model/uiStore.ts";

function App() {
    const location = useLocation();
    const hideMenuPaths = ["/login", "/onboarding", "/sign"];
    const isLogin = location.pathname === "/login";
    const isSign = location.pathname ==="/sign";

    const shouldHideByRoute = hideMenuPaths.includes(location.pathname);
    const bottomMenuVisible = useUIStore((s) => s.bottomMenuVisible);
    const shouldShowBottomMenu = !shouldHideByRoute && bottomMenuVisible;

    return (
        <>
            {/*<Header/>*/}
            {(isLogin || isSign ) && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <LoginBlob
                        className="absolute"
                        style={{
                            left: "48%",
                            bottom: "-15%"
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

            <BottomMenu visible={shouldShowBottomMenu} />
        </>
    )
}

export default App
