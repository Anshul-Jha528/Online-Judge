import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NavBar = ({sidePanelOpen, setSidePanel}) => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const handleSidePanel = () => {
        setSidePanel(!sidePanelOpen);
    }
    
    return (
        <>
            <div className="w-full h-12 bg-cyan-700 flex position-fixed">
                <div onClick={handleSidePanel} className="cursor-pointer my-auto m-[10px] p=[10px]">
                    ☰
                </div>
                <div className="justify-left cursor-default font-bold font-sans-serif text-white text-[24px] my-auto ml-[10px] ">
                    CodeClimb
                </div>
                <div className="h-full justify-end flex font-medium font-sans text-white text-22px my-auto mx-auto mr-[10px] px-[50px]">
                    <NavLink to="/dashboard" className="h-full flex px-[20px] cursor-pointer justify-center items-center my-auto hover:bg-red-600">
                        Dashboard
                    </NavLink>
                    <NavLink to="/profile" className="h-full flex px-[20px] cursor-pointer justify-center items-center my-auto hover:bg-red-600">
                        {username}
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default NavBar;