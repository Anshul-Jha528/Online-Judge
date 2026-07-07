import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import ShowAllProblems from "./ShowAllProblems";
import SidePanel from "./SidePanel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () =>{

    const navigate = useNavigate();

    useEffect(() =>{
        // console.log(false);
        const checkToken  = async ()=>{
            try{
                const res = await axios.post(
                    `http://localhost:5000/v1/auth/verifyToken`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                if(res.status !== 200 ){
                    localStorage.removeItem("token");
                    localStorage.removeItem("userID");
                    localStorage.removeItem("username");
                    toast.error("Session expired. Please login again.", {autoClose: 2000,
                        onClose: () => {
                            navigate("/");
                        },
                    });
                }else{
                    
                    console.log("Token verified successfully");
                }
                
                
            }catch(err){
                if(err.response.status == 401){
                    localStorage.removeItem("token");
                    localStorage.removeItem("userID");
                    localStorage.removeItem("username");
                    toast.error("Session expired. Please login again.", {autoClose: 2000,
                        onClose: () => {
                            navigate("/");
                        },
                    });
                }
                console.log(err);
            }
        }
        checkToken();
    })

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