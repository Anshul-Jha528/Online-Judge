import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const GetAdminRights = () => {
    document.title = "Admin Panel";

    const [info, setInfo] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [pending, setPending] = useState(false);

    useEffect(() =>{
        async function checkPendingStatus(){
            try{
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/auth/isRequestPending`,
                    {
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                )
                if(res.data.isPending){
                    setPending(true);
                }
                
            }catch(err){

            }
        }
        checkPendingStatus();
    },[])

    const handleAdmin = async () => {
        if (disabled) return;
        if (info.trim().length<20){
            toast.info("Please fill the required fields", {autoClose:2000}) 
            return;
        }

        setDisabled(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/auth/requestAdminRights`,
                {
                    info: info
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            toast.success("Request submitted successfully", {
                autoClose: 2000
            })
            setPending(true);
            setDisabled(true);
        } catch (err) {
            console.log(err.response?.data?.message);
            toast.error(err.response?.data?.message || "Couldn't submit request", { autoClose: 2000 })
            setDisabled(false);
        }

    }
    const handleWithdraw = async() => {
        Swal.fire({
            title:"Withdraw Request",
            text:"Are you sure you want to withdraw your request?",
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Withdraw",
            cancelButtonText:"Cancel",
            confirmButtonColor:"#f7004eff",
            cancelButtonColor:"#00bc52ff",
            preConfirm:async() => {
                try{
                    await axios.post(
                        `${import.meta.env.VITE_BACKEND_URI}/v1/auth/withdrawAdminRequest`,
                        {},
                        {
                            headers:{
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    )
                    toast.success("Request withdraw successfully", {autoClose:2000})
                    setPending(false);
                    return true;
                }catch(err){
                    console.log(err.response?.data?.message);
                    toast.error(err.response?.data?.message || "Couldn't withdraw request", { autoClose: 2000 })
                    return false;
                }
            }
            
        })
    }


    return (
        <>
            {
                pending &&
                <div className="w-full bg-slate-900 flex flex-col items-center px-5 py-5 text-gray-200">
                    <div className="text-gray-200 text-[20px] text-center py-[20px]">
                        Your request has been submitted successfully. Please wait for admin approval. It may take 24 hours to 48 hours for your request to be approved.
                    </div>
                    <button 
                        onClick={() => handleWithdraw()}
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
                        >
                            Withdraw Request
                    </button>
                </div>

            }
            {
                !pending &&
                <>
                    <div className="w-full bg-slate-900 flex flex-col items-center px-5 py-5 text-gray-200">
                        <div className="text-yellow-200 text-2xl text-center font-medium py-[20px]">
                            Become an admin
                        </div>

                        <div className="text-xl font-medium mx-2">
                            Admins can create and modify problems on CodeClimb. Please tell us why you would be a good addition to the admin team.
                        </div>
                        <textarea
                            className="border border-gray-400 p-2 w-[90%]  m-4 h-40 rounded bg-slate-700 text-white"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            placeholder="Explain your past experiences, programming skils, links to coding profiles and your objective as an admin..."
                        />

                        <button 
                            onClick={handleAdmin}
                            disabled={disabled}
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600">
                            Submit Request
                        </button>

                    </div>
                </>
            }

        </>
    )
}

export default GetAdminRights;