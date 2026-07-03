import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const GetAdminRights = () => {


    const navigate = useNavigate();

    const makeAdmin = async () => {
        toast.info("Please wait...", { autoClose: 1500 });
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/auth/makeUserAdmin`,
                {
                    userID: localStorage.getItem("userID"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem("isAdmin", true);
                toast.success("Admin Rights Granted Successfully", {
                    onClose: () => {
                        navigate("/admin/createProblem", { replace: true });
                    },
                    autoClose: 3000,
                });
            }


        } catch (err) {
            console.log(err.message);
            toast.error("Failed to get Admin Rights");
        }

    }

    const handleAdmin = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to make yourself admin?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Make me admin!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#e14b61ff",
            cancelButtonColor: "#0fbf79ff"
        }).then((result) => {
            if (result.isConfirmed) {
                makeAdmin();
            }
        })
    }


    return (
        <div className="w-full min-h-screen bg-slate-900 flex flex-col justify-center items-center px-5 py-5 text-gray-200">
            <div className="text-gray-100 text-[20px] text-center py-[20px]">
                You need to get Admin Rights to create problems.
            </div>
            <div
                onClick={handleAdmin}
                className="bg-red-600 w-[200px] h-[200px] rounded-full flex items-center justify-center hover:bg-red-500 px-4 py-2 transition cursor-pointer"
            >
                Get admin rights
            </div>

        </div>
    )
}

export default GetAdminRights;