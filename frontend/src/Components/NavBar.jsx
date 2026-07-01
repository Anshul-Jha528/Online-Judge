import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NavBar = () => {
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
    
    return (
        <>
            <div className="w-full h-12 bg-cyan-700 flex position-fixed">
                <div className="justify-left cursor-default font-bold font-sans-serif text-white text-[24px] my-auto ml-[10px] ">
                    CodeClimb
                </div>
                <div className="h-full justify-end flex gap-8 font-medium font-sans text-white text-22px my-auto mx-auto mr-[10px] px-[50px]">
                    <div className="h-full flex px-[20px] cursor-pointer justify-center items-center my-auto hover:bg-red-600"
                        onClick={null} >
                        Dashboard
                    </div>
                    <div className="h-full flex px-[20px] cursor-pointer justify-center items-center my-auto hover:bg-red-600"
                        onClick={null}>
                        Admin Panel
                    </div>
                    <div className="h-full flex px-[20px] cursor-pointer justify-center items-center my-auto hover:bg-red-600"
                        onClick={logout}>
                        Sign Out
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar;