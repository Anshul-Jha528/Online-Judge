import { useState, useEffect } from "react";
import { Link, replace, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {  
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
        navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setAuthToken = async (token, name, userID) => {

    localStorage.setItem("token", token);
    localStorage.setItem("username", name);
    localStorage.setItem("userID", userID);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try{
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/v1/auth/login`,{
          email,password
        })
        setAuthToken(res.data.token, res.data.username, res.data.userID);
        console.log(res.data);
        toast.success("Login successful",{
          onClose:()=>navigate("/Dashboard", {replace:true}),
          autoClose:3000
        })
      }
      catch(err){
        console.log(err.message);
        toast.error("Something went wrong")
      }
    }
  };

  return (
     <div className="min-h-screen bg-radial from-indigo-950 to-sky-900 flex items-center justify-center p-4 relative overflow-hidden font-serif"> 
      
      <div className="relative w-full max-w-[500px] flex justify-center items-center">
        
        {/* Login Card */}
        <div className="relative z-10 w-full bg-[#181d33]/40 backdrop-blur-[24px] rounded-[32px] p-10 md:p-12 border border-[#ffffff]/10 shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
          
          <div className="text-white text-[28px] font-normal tracking-wide text-center mt-2 mb-8 select-none">
            <h1>Welcome Back!</h1>
            <h3 className="text-[20px] text-gray-200">Login to your account</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
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

            {/* Login Button */}
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
              Login
            </button>
          </form>

          {/* Footer register Link */}
          <p className="text-gray-400 text-s text-center mt-8 font-light select-none">
            Don't have an account?{" "}
            <Link
              to="/Register"
              className="text-yellow-300 hover:text-white transition-colors cursor-pointer font-normal"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
