import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Profile = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [changePassword, setChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") == "true");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/auth/getUserData/${localStorage.getItem("userID")}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                console.log(res.data);
                setUserData(res.data.user);
                setFullName(res.data.user.fullName);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);

    const getInitials = (name) => {
        if (!name) return "";

        return name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const handleSave = async () => {
        if(!fullName.trim()){
            toast.error("Full name cannot be empty",{autoClose:2000});
            return;
        }
        try {
            
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URI}/v1/auth/updateUserData`,
                {
                    fullName:fullName,
                    userID: localStorage.getItem("userID")
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            localStorage.setItem("username", fullName);
            setUserData({
                ...userData,
                fullName
            });
            
            toast.success("Name updated successfully",{autoClose:2000});
            setEditing(false);
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleLogout = async () =>{
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#00be4cff",
            confirmButtonText: "Yes, logout!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userID");
                    localStorage.removeItem("username");
                    
                    toast.success("Logged out successfully",{
                        onClose:()=>{
                            navigate("/");
                        },
                        autoClose:2000});
                } catch (err) {
                    console.log(err);
                }
            }
        })
        
    }

    const handleChangePassword = async() =>{
        if(!newPassword.trim() || !currentPassword.trim() || !newPasswordConfirm.trim()){
            toast.error("Please fill all the fields",{autoClose:2000});
            return;
        }
        if(!(newPassword===newPasswordConfirm)){
            toast.error("New Passwords do not match",{autoClose:2000});
            return;
        }

        try{
            const res = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URI}/v1/auth/changePassword`,
                {
                    oldPassword:currentPassword,
                    newPassword:newPassword,
                    userID: localStorage.getItem("userID")
                },
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success("Password changed successfully",{autoClose:2000});
            setChangePassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
        }catch(err){
            console.log(err.message);
            toast.error(err.response?.data?.message || "Something went wrong", { autoClose: 2000 });
        }

        
    }

    const handleDelete = async () =>{
        Swal.fire({
            title: "Confirm Delete",
            text: "Are you sure you want to permanently delete your Account. All your data will be lost forever.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#00be4cff",
            confirmButtonText: "Yes, Delete Account!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(
                        `${import.meta.env.VITE_BACKEND_URI}/v1/auth/deleteAccount/${localStorage.getItem("userID")}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );

                    localStorage.removeItem("token");
                    localStorage.removeItem("userID");
                    localStorage.removeItem("username");


                    
                    toast.success("Account deleted successfully",{
                        onClose:()=>{
                            navigate("/");
                        },
                        autoClose:2000});
                } catch (err) {
                    console.log(err);
                }
            }
        })
        
    }

    const handleAdmin = async () =>{
        Swal.fire({
            title: "Admin Rights",
            text: "Do you want to revoke your admin rights? You may get it back.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#00be4cff",
            confirmButtonText: "Yes, Revoke Rights!",
            cancelButtonText: "Cancel"
        }).then(
            async(result)=>{
                if(result.isConfirmed){
                    try{
                    const res = await axios.patch(
                        `${import.meta.env.VITE_BACKEND_URI}/v1/auth/removeUserAdmin/${localStorage.getItem("userID")}`,
                        {
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    
                    localStorage.setItem("isAdmin", "false");
                    console.log(localStorage.getItem("isAdmin"));
                    setIsAdmin(false);
                    setUserData({
                        ...userData,
                        isAdmin: false
                    });
                    toast.success("Admin rights revoked successfully",{autoClose:2000,
                        onClose:()=>{
                            navigate("/");
                        }
                    });
                }catch(err){
                    console.log(err);
                    toast.error(err.response?.data?.message || "Something went wrong", { autoClose: 2000 });
                }
            }
    })
    }

    return (
        <div className="w-full min-h-screen bg-slate-900 flex justify-center items-center px-5 py-10 text-gray-200">
            <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">

                {/* Avatar */}
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {getInitials(userData.fullName)}
                    </div>

                    <p className="text-gray-100 mt-1 text-2xl font-bold">
                        My Profile
                    </p>
                    <p className="text-yellow-200 mt-1 text-sm italic">
                        User ID: {userData.userID}
                    </p>
                </div>

                { isAdmin &&
                <div className="bg-green-600 w-fit mx-auto text-green-100 px-4 py-2 mt-6 rounded-lg hover:bg-green-700 text-center cursor-pointer"
                    onClick={handleAdmin}>
                    You are an admin
                </div>
                }

                {/* Details */}
                <div className="mt-10 space-y-6">

                    {/* Full Name */}
                    <div>
                        <label className="text-sm text-gray-200">
                            Full Name
                        </label>

                        <div className="flex gap-3 mt-2">
                            <input
                                type="text"
                                value={fullName}
                                disabled={!editing}
                                onChange={(e) => setFullName(e.target.value)}
                                className={`flex-1 px-4 py-3 rounded-lg outline-none border transition
                                ${
                                    editing
                                        ? "bg-cyan-100 border-cyan-600 text-black":
                                        " bg-slate-600 text-white border-cyan-600 border cursor-not-allowed"
                                }`}
                            />

                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                                >
                                    Edit
                                </button>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    className="px-5 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-200">
                            Email
                        </label>

                        <div className="mt-2 px-4 py-3 text-gray-100 rounded-lg bg-slate-600 border border-cyan-600 cursor-not-allowed">
                            {userData.email}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="bg-slate-700 rounded-xl p-5 border border-slate-600">
                            <p className="text-gray-200 text-sm">
                                Score
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-blue-400">
                                {userData.score ?? 0}
                            </h2>
                        </div>

                        <div className="bg-slate-700 rounded-xl p-5 border border-slate-600">
                            <p className="text-gray-200 text-sm">
                                Problems Solved
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-green-400">
                                {userData.problemsSolved ?? 0}
                            </h2>
                        </div>

                    </div>

                    {/* change password */}
                    {!changePassword ? (
                        <div className="mt-10 flex flex-rows justify-between">
                            <button
                                onClick={() => setChangePassword(true)}
                                className="px-5 py-3 self-start bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition"
                            >
                                Change Password
                            </button>
                            <div className="flex flex-col gap-1">
                            <button
                                onClick={handleLogout}
                                className="px-5 py-3 bg-red-500 w-fit self-end hover:bg-red-700 rounded-lg font-semibold transition"
                            >
                                Logout
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                            >
                                Delete My Account
                            </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-10">
                            <label className="text-sm text-gray-200">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value.trim())}
                                className="w-full px-4 py-3 rounded-lg outline-none border border-cyan-600 mt-2"
                            />
                            <label className="text-sm text-gray-200">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value.trim())}
                                className="w-full px-4 py-3 rounded-lg outline-none border border-cyan-600 mt-2"
                            />
                            <label className="text-sm text-gray-200">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value.trim())}
                                className="w-full px-4 py-3 rounded-lg outline-none border border-cyan-600 mt-2"
                            />
                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={() => setChangePassword(false)}
                                    className="px-5 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="px-5 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;