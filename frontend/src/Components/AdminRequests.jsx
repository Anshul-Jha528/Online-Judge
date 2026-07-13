import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


const AdminRequests = () => {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState("Fetching requests...")

    const fetchRequests = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URI}/v1/admin/adminRequests`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            setRequests(res.data.requests);
            // console.log(res.data);
            setLoading("No pending requests");
        } catch (err) {
            setLoading("No pending requests")
            console.log(err.response?.data?.message);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);


    const handleAccept = async (userID) => {
        Swal.fire({
            title: "Confirm",
            text: `Do you want to make ${userID} an Admin?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00be4cff",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URI}/v1/admin/acceptRequest`,
                        {
                            userID: userID
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    )
                    toast.success("Request accepted successfully", {
                        autoClose: 2000
                    })
                    fetchRequests();
                } catch (err) {
                    console.log(err.response?.data?.message);
                    toast.error("Couldn't accept request", { autoClose: 2000 })
                }
            }
        })
    }

    const handleReject = async (userID) => {
        Swal.fire({
            title: "Confirm",
            text: `Do you want to reject ${userID}'s request?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#00be4c",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URI}/v1/admin/rejectRequest`,
                        {
                            userID: userID
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    )
                    toast.success("Request rejected successfully", {
                        autoClose: 2000
                    });
                    fetchRequests();
                } catch (err) {
                    console.log(err.response?.data?.message);
                    toast.error("Couldn't reject request", { autoClose: 2000 })
                }
            }
        })
    }

    return (
        <>
            <div className="w-full bg-slate-900 flex flex-col p-4 text-sans-serif text-gray-50">
                <h1 className="text-2xl text-center text-yellow-200 w-full font-semibold">Admin Requests</h1>

                {
                    requests.length === 0 ? (
                        <p className="text-gray-200 text-md min-h-screen my-4 text-center w-full">
                            {loading}
                        </p>
                    ) :
                        (
                            requests.map((request) => (
                                <div className="flex flex-col w-full rounded bg-slate-800 m-4 ">
                                    <div className="flex flex-row w-full items-center justify-between">
                                        <div className="w-[50%] flex flex-col p-2 m-1">
                                            <h1 className="text-sm font-medium">UserID: {request.userID}</h1>
                                            <h1 className="text-sm font-medium">Name: {request.fullName}</h1>
                                        </div>
                                        <div className="w-[50%] flex flex-row gap-1 p-2 m-3 justify-end items-center">
                                            <button
                                                onClick={() => handleAccept(request.userID)}
                                                className="bg-green-500 w-[40%] mx-4 rounded rounded-xl text-sm font-serif">
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.userID)}
                                                className="bg-red-500 w-[40%] mx-4 rounded rounded-xl text-sm font-serif">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-100 p-1 ml-4 whitespace-pre-wrap">
                                        About: {request.adminInfo}
                                    </div>
                                </div>
                            ))
                        )
                }

            </div>

        </>
    );
};

export default AdminRequests;