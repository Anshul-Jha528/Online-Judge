import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";



const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
        navigate("/dashboard", { replace: true });
    }
}, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [cpassword, setCPassword] = useState("");


  const validate = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.name = "Name must contain only letters and spaces";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    else if (!cpassword) {
      newErrors.cpassword = "Confirm Password is required";
    }
    else if (password !== cpassword) {
      newErrors.cpassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    if (validate()) {
      try{
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/v1/auth/register`,
        {fullName:name, email, password}
      )
      console.log(res.data);
      toast.success("Registered successfully", {
        onClose:() => navigate("/login", {replace:true}),
        autoClose:3000
      });
      }
      catch(err){
        console.log(err.message);
        toast.error("Something went wrong",{
          autoClose:3000
        })
      }
    }
  };

  return (
     <div className="min-h-screen bg-radial from-indigo-950 to-sky-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-serif"> 
      

      <div className="relative w-full max-w-[500px] flex justify-center items-center">
        
        {/* Register Card */}
        <div className="relative z-10 w-full bg-[#181d33]/40 backdrop-blur-[24px] rounded-[32px] p-10 md:p-12 border border-[#ffffff]/10 shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
          
          <div className="text-white text-[28px] font-normal tracking-wide text-center mt-2 mb-8 select-none">
            <h1>Set up your account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* FullName Input */}
            <div className="relative">
              <input
                type="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                className={`
                  w-full
                  bg-[#242c4b]/80
                  focus:bg-[#2c365d]/90
                  border-2
                  border-gray-600
                  focus:outline-none
                  focus:ring-1
                  focus:ring-sky-500/40
                  rounded-[16px]
                  px-5
                  py-4
                  text-white
                  text-[15px]
                  placeholder-[#6e7b9e]
                  transition-all
                  duration-300
                  ${errors.name ? "ring-1 ring-red-500/50" : ""}
                `}
              />
              {errors.name && (
                <span className="text-red-400 text-xs mt-1 block pl-2 font-light">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                className={`
                  w-full
                  bg-[#242c4b]/80
                  focus:bg-[#2c365d]/90
                  border-2
                  border-gray-600
                  focus:outline-none
                  focus:ring-1
                  focus:ring-sky-500/40
                  rounded-[16px]
                  px-5
                  py-4
                  text-white
                  text-[15px]
                  placeholder-[#6e7b9e]
                  transition-all
                  duration-300
                  ${errors.email ? "ring-1 ring-red-500/50" : ""}
                `}
              />
              {errors.email && (
                <span className="text-red-400 text-xs mt-1 block pl-2 font-light">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                className={`
                  w-full
                  bg-[#242c4b]/80
                  focus:bg-[#2c365d]/90
                  border-2
                  border-gray-600
                  focus:outline-none
                  focus:ring-1
                  focus:ring-sky-500/40
                  rounded-[16px]
                  px-5
                  py-4
                  text-white
                  text-[15px]
                  placeholder-[#6e7b9e]
                  transition-all
                  duration-300
                  ${errors.password ? "ring-1 ring-red-500/50" : ""}
                `}
              />
              {errors.password && (
                <span className="text-red-400 text-xs mt-1 block pl-2 font-light">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                value={cpassword}
                onChange={(e) => {
                  setCPassword(e.target.value);
                  if (errors.cpassword) setErrors({ ...errors, cpassword: null });
                }}
                className={`
                  w-full
                  bg-[#242c4b]/80
                  focus:bg-[#2c365d]/90
                  border-2
                  border-gray-600
                  focus:outline-none
                  focus:ring-1
                  focus:ring-sky-500/40
                  rounded-[16px]
                  px-5
                  py-4
                  text-white
                  text-[15px]
                  placeholder-[#6e7b9e]
                  transition-all
                  duration-300
                  ${errors.cpassword ? "ring-1 ring-red-500/50" : ""}
                `}
              />
              {errors.cpassword && (
                <span className="text-red-400 text-xs mt-1 block pl-2 font-light">
                  {errors.cpassword}
                </span>
              )}
            </div>


            {/* Register Button */}
            <button
              type="submit"
              className="
                w-full
                bg-cyan-700
                hover:bg-cyan-800
                active:bg-cyan-900
                text-white
                text-[20px]
                font-bold
                py-3
                rounded-[16px]
                transition-all
                duration-300
                shadow-lg
                mt-6
                cursor-pointer
              "
            >
              Register
            </button>
          </form>

          {/* Footer register Link */}
          <p className="text-gray-400 text-s text-center mt-8 font-light select-none">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="text-yellow-300 hover:text-white transition-colors cursor-pointer font-normal"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
