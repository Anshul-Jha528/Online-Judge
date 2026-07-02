import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import ShowAllProblems from "./ShowAllProblems";
import SidePanel from "./SidePanel";
import { useState } from "react";

const Dashboard = () =>{
    document.title = "Dashboard";

    const [sidePanelOpen, setSidePanel ] = useState(false)

    return (
        <>
        
        <div className="bg-slate-900 w-full text-gray-50 flex-col ">
            <NavBar sidePanelOpen={sidePanelOpen} setSidePanel={setSidePanel} />
            <div className={"flex w-full h-screen"}>
                <SidePanel isOpen={sidePanelOpen} className="transition-all duration-300 ease-in-out"/>
                <div className="w-full">
                    <Outlet/>
                </div>
            </div>
        </div>
        </>
    )
}
export default Dashboard