import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MonacoEditor from "./MonacoEditor";

const Problem = () => {
    document.title = "Problem";

    const problemID = useParams().problemID;
    const [problemData, setProblemData] = useState();
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState("// Write your code here");
    const [input, setInput] = useState("Input sample test cases...");
    const [output, setOutput] = useState("Your output will appear here...");
    const [verdict, setVerdict] = useState("Submit code to see verdict...");
    const [isEditing, setEditing] = useState(true);
    const [textBoxText , setText] = useState(input);
    const [type, setType] = useState("input");
    

    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/v1/user/getProblem/${problemID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    }
                );
                setProblemData(response.data.problem);
                console.log(response.data);
            } catch (error) {
                console.log(error.messsage);
            }
        }
        fetchProblemData();
    }, [problemID]);

    const handleRun = async () => {
        setOutput("Running...");

    }

    const handleSubmit = async () => {
        setOutput("Submitting...");

    }

    return (
        <>
            <div className="w-full h-screen overflow-y-auto flex flex-col bg-slate-950 text-gray-50" style={{scrollbarWidth:"none"}}>
                <div className="flex flex-row justify-between px-5 bg-cyan-700 p-2">
                    <h1 className="text-white text-2xl cursor-default font-medium ">Problem</h1>
                    <select onChange={(e)=>setLanguage(e.target.value)} className="bg-cyan-100 text-gray-950 border-0 rounded px-1 py-2 w-[10%]" value={language}>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="js">JavaScript</option>
                    </select>
                </div>
                <div className="flex flex-row h-[92%] p-5">
                    <div className="w-[50%] bg-gray-900 p-5 overflow-y-auto">
                        <h1 className="text-yellow-200 text-2xl cursor-default font-medium ">{problemData?.title}</h1>
                        <p className="text-white mt-2 text-base ">{problemData?.statement}</p>
                        <h2 className="text-white mt-5 text-lg font-medium ">Test Cases</h2>
                        <h2 className="text-white mt-5 text-1g font-medium">Constraints</h2>
                        <p className="text-white mt-2 text-base ">Time limit: {problemData?.timeLimitMs}ms</p>
                        <p className="text-white mt-2 text-base ">Memory limit: {problemData?.memoryLimitMB}MB</p>
                        <h2 className="text-white mt-5 text-base font-medium">Author: {problemData?.authorName}</h2>
                        

                    </div>

                    <div className="w-[50%]  h-screen overflow-y-auto flex flex-col " style={{scrollbarWidth:"none"}} >
                        <div className="h-[70%] px-4">
                            <h1 className="bg-gray-800 p-2 rounded-md text-gray-100">Code</h1>
                            <MonacoEditor language={language} value={code} onChange={setCode} />
                        </div>

                        <div className=" flex flex-row pt-12 px-5 justify-between">
                            <div
                                onClick={handleRun}
                                className="w-[50%] mr-2 p-1 bg-blue-600 cursor-pointer rounded-lg hover:bg-blue-600 text-white font-medium text-lg flex justify-center items-center" >
                                Run Code
                            </div>
                            <div
                                onClick={handleSubmit}
                                className="w-[50%] ml-2 p-1 bg-green-700 cursor-pointer rounded-lg hover:bg-green-600 text-white font-medium text-lg flex justify-center items-center" >
                                Submit Code
                            </div>

                        </div>                     

                        <div className="flex flex-row bg-slate-800 mx-5 mt-5">

                            <button className="w-[33%] border border-cyan-800 bg-slate-800 cursor-pointer text-white font-medium text-lg flex justify-center items-center hover:bg-slate-700"
                                onClick={()=>{
                                    setType("input");
                                    setText(input);
                                    setEditing(true);
                                }}
                            >
                                Input
                            </button>

                            <button className="w-[33%] border border-cyan-800 bg-slate-800 cursor-pointer text-white font-medium text-lg flex justify-center items-center hover:bg-slate-700"
                                onClick={()=>{
                                    setType("output");
                                    setEditing(false);
                                    setText(output);
                                }}>
                                Output
                            </button>

                            <button className="w-[33%] border border-cyan-800 bg-slate-800 cursor-pointer text-white font-medium text-lg flex justify-center items-center hover:bg-slate-700"
                                onClick={() => {
                                    setText(verdict);
                                    setEditing(false);
                                    setType("verdict");
                                }}
                            >
                                Verdict
                            </button>

                        </div>

                        <textarea
                            className="h-[10rem] min-h-[10rem] mb-10 text-gray-50 bg-slate-800 mx-5 my-1 rounded-md p-3 "
                            value={textBoxText}
                            onChange={(e)=>{
                                setText(e.target.value);
                                if(type=="input") setInput(e.target.value)
                            }}
                            disabled={!isEditing}
                        />

                        



                    </div>

                </div>
            </div>
        </>
    )
}

export default Problem;