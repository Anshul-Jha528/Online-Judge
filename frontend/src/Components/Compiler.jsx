import { use, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import axios from 'axios';

const Compiler = () => {
    document.title = "Compiler";

    const [language, setLanguage] = useState("java");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [runEnabled, setRunEnabled] = useState(true);
    const javaSample = `import java.util.*;
import java.io.*;
class Main {
    public static void main(String[] args) throws IOException {
        System.out.println("Hello, World!");
    }
}`;
    const cppSample = `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`;
    const pythonSample = `print("Hello, World!")`;
    const jsSample = `console.log("Hello, World!");`;

    const [code, setCode] = useState(javaSample);

    const handleRun = async () => {
        setRunEnabled(false);
        setOutput("Running...");
        try{
            // console.log(code);
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/compile/run`,
                {
                    language,
                    code,
                    input
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            )
            console.log(res.data);
            if(res.status !== 200){
                setOutput("Error: " + res.data.message);
            }else{
                setOutput(res.data.output.output);
            }
            setRunEnabled(true);
        }catch(err){
            setRunEnabled(true);
            console.log(err.message);
            setOutput("Error: " + err.message);
        }

    }

    return (
        <>
            <div className="w-screen h-screen bg-slate-950 text-gray-50 flex flex-col">
                <div className="flex flex-row justify-between px-5 bg-cyan-700 p-2">
                    <h1 className="text-white text-2xl cursor-default font-medium ">Compiler</h1>
                    <select onChange={(e)=>{
                        setLanguage(e.target.value);
                        if(e.target.value=="cpp"){
                            setCode(cppSample);
                        }else if(e.target.value=="java"){
                            setCode(javaSample);
                        }else if(e.target.value=="python"){
                            setCode(pythonSample);
                        }else if(e.target.value=="javascript"){
                            setCode(jsSample);
                        }
                    }} className="bg-cyan-100 text-gray-950 border-0 rounded px-1 py-2 w-[10%]" value={language}>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                </div>
                <div className="flex flex-row overflow-hidden ">
                    <div className="w-[65%] h-[92%] p-5">
                        <MonacoEditor language={language} code={code} setCode={setCode} height={"full"} />
                    </div>
                    <div className="w-[35%] h-[100%] p-5 pb-12 flex-col flex justify-between">
                        <div className="h-[35%]">
                            <h1>Input</h1>
                            <textarea className="w-full h-full bg-slate-800 text-gray-300 border-0 rounded-lg px-1 py-2"
                            value={input}
                            placeholder="Enter yout input here..."
                            onChange={(e)=>setInput(e.target.value)}
                            
                            ></textarea>
                        </div>

                        <div className="h-[35%]">
                            <h1>Output</h1>
                            <textarea className="w-full h-full bg-slate-800 text-gray-300 border-0 rounded-lg px-1 py-2"
                            value={output}
                            placeholder="Your output will appear here..."
                            disabled
                            
                            ></textarea>
                        </div>

                        <button 
                        onClick={handleRun}
                        disabled={!runEnabled}
                        className="w-full mt-5 bg-blue-500 h-[15%] cursor-pointer rounded-lg hover:bg-blue-600 text-white font-medium text-lg flex justify-center items-center disabled:bg-gray-500 disabled:cursor-not-allowed" >
                            Run Code
                        </button>
                            
                    </div>
                </div>
            </div>
        
        </>
    )

}

export default Compiler;