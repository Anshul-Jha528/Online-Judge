import NavBar from "./NavBar";
import ShowAllProblems from "./ShowAllProblems";

const Dashboard = () =>{
    return (
        <div className="bg-slate-900 h-screen w-full text-gray-50 flex-col ">
            <NavBar />
            <h1 className="w-full text-center text-3xl font-serif font-bold py-[20px]">Welcome {localStorage.getItem("username")}</h1>
            <ShowAllProblems/>
        </div>
    )
}
export default Dashboard