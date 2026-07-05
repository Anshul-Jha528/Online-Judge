import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SidePanel = ({isOpen}) => {
    const navigate = useNavigate();
    const logout = async () =>  {
        const result = await Swal.fire({
            title:"Are you sure?",
            text:"You want to logout?",
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Yes, Logout!",
            cancelButtonText:"Cancel",
            confirmButtonColor:"#e14b61ff",
            cancelButtonColor:"#0fbf79ff"
        });

        if(result.isConfirmed){
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/login", { replace: true });
        }

    }

    const isAdmin = (localStorage.getItem("isAdmin")=="true");

    const [adminPanel, setAdminPanel] = useState(false);

    if(!isOpen) return null;


    return (
        <div className=" h-full w-[20%] flex-col bg-cyan-700">
            <NavLink to="/dashboard" className="flex px-[20px] py-[15px] text-[16px] cursor-pointer justify-start items-center hover:bg-red-600">
                All Problems
            </NavLink>
            <NavLink to="/submissions" className="flex px-[20px] py-[15px] cursor-pointer justify-start items-center hover:bg-red-600">
                My Submissions
            </NavLink>
            <NavLink to="/leaderboard" className="flex px-[20px] py-[15px] cursor-pointer justify-start items-center hover:bg-red-600">
                Leaderboard
            </NavLink>
            <div onClick={()=>window.open("/compiler","_blank")} className="flex px-[20px] py-[15px] cursor-pointer justify-start items-center hover:bg-red-600">
                Compiler
            </div>

            {
                !isAdmin && (
                    <NavLink to="/getAdminRights" className="flex px-[20px] py-[15px] cursor-pointer justify-start items-center hover:bg-red-600">
                        Get Admin Rights
                    </NavLink>
                )
            }

            {
                isAdmin && (
                    <div onClick={()=>setAdminPanel(!adminPanel)} className="flex px-[20px] py-[15px] cursor-pointer justify-between items-center hover:bg-red-600">
                        <span>Admin Panel</span>
                        <span>{adminPanel ? "▲" : "▼"}</span>
                    </div>
                )
            }
            {
                adminPanel && (
                    <>
                        <NavLink to="/admin/createProblem" className="flex px-[30px] py-[15px] cursor-pointer justify-start items-center hover:bg-red-600">
                            Create Problem
                        </NavLink>
                        <NavLink to="/admin/myProblems" className="flex px-[30px] py-[15px] cursor-pointer justify-start items-center hover:bg-red-600">
                            My Problems
                        </NavLink>
                    </>
                )
            }

            <div className="flex px-[20px] py-[15px] cursor-pointer justify-start items-center hover:bg-red-600"
                onClick={logout} >
                Logout
            </div>
        </div>
    )
}

export default SidePanel;