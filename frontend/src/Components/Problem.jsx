import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MonacoEditor from "./MonacoEditor";
import AIChatBot from "./AIChatBot";

const Problem = () => {
    useEffect(() => {
        document.title = "Problem";
    }, []);

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

    const { problemID } = useParams();
    const [problemData, setProblemData] = useState(null);
    const [testCases, setTestCases] = useState([]);
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState(javaSample);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("Your output will appear here...");
    const [verdict, setVerdict] = useState("Submit code to see verdict...");
    const [isEditing, setEditing] = useState(true);
    const [type, setType] = useState("input");
    const [runEnabled, setRunEnabled] = useState(true);
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [activeTab, setActiveTab] = useState("problem");
    const [aiMessages, setAiMessages] = useState([
        {
            sender: "ai",
            text: "Hello! I am your Code Climb AI assistant. I can help you understand the problem, debug errors, or give you hints. How can I help you today?",
        },
    ]);
    const [aiInputText, setAiInputText] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    // Ref to target the bottom of the console panel
    const consoleEndRef = useRef(null);

    const scrollToConsole = () => {
        if (consoleEndRef.current) {
            consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };


    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/user/getProblem/${problemID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setProblemData(response.data.problem);
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchTestCases = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/user/getTestCases/${problemID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const cases = res.data.testCases || [];
                setTestCases(cases);
                
                if (cases.length > 0) {
                    setInput(cases[0].input);
                } else {
                    setInput("");
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchTestCases();
        fetchProblemData();
    }, [problemID]);

    const handleRun = async () => {
        setOutput("Running...");
        setRunEnabled(false);
        

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/compile/run`,
                { language, code, input },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            
            setRunEnabled(true);
            setType('output');
            setEditing(false);

            if (res.status !== 200) {
                setOutput("Error: " + res.data.message);
            } else {
                setOutput(res.data.output.output);
            }
            setTimeout(scrollToConsole, 70);
        } catch (err) {
            console.error(err.message);
            setOutput("Error: " + err.message);
        }
    };

    const handleSubmit = async () => {
        setSubmitEnabled(false);
        setVerdict("Submitting...");
        

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/compile/submit`,
                { language, code, problemID },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setTimeout(scrollToConsole, 80);
            setSubmitEnabled(true);
            setType('verdict');
            setEditing(false);
            setVerdict(res.data.verdict);
            
        } catch (err) {
            console.error(err.message);
            setVerdict("Error: " + err.message);
            setSubmitEnabled(true);
        }
    };

    return (
        <div className="w-full h-screen overflow-y-auto flex flex-col bg-slate-950 text-gray-50" style={{ scrollbarWidth: "none" }}>
            <div className="flex flex-row justify-between px-5 bg-cyan-700 p-2">
                <h1 className="text-white text-2xl cursor-default font-medium">Problem</h1>
                <select 
                    onChange={(e) => {
                        const newLang = e.target.value;
                        setLanguage(newLang);
                        if (code === javaSample || code === cppSample || code === pythonSample || code === jsSample) {
                            if (newLang === "cpp") setCode(cppSample);
                            else if (newLang === "java") setCode(javaSample);
                            else if (newLang === "python") setCode(pythonSample);
                            else if (newLang === "javascript") setCode(jsSample);
                        }
                    }} 
                    className="bg-cyan-100 text-gray-950 border-0 rounded px-1 py-2 w-[10%]" 
                    value={language}
                >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                </select>
            </div>

            <div className="flex flex-row h-[96%] p-5">
                <div className="w-[50%] bg-gray-900 flex flex-col h-full overflow-hidden rounded-lg">
                    {/* Tab Header */}
                    <div className="flex border-b border-gray-800 bg-gray-950/40">
                        <button
                            className={`flex-1 py-3 text-center font-medium text-base border-b-2 transition-colors ${
                                activeTab === "problem"
                                    ? "text-yellow-200 border-yellow-200 bg-gray-900/80"
                                    : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-900/30"
                            }`}
                            onClick={() => setActiveTab("problem")}
                        >
                            Problem
                        </button>
                        <button
                            className={`flex-1 py-3 text-center font-medium text-base border-b-2 transition-colors ${
                                activeTab === "submissions"
                                    ? "text-green-200 border-green-200 bg-gray-900/80"
                                    : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-900/30"
                            }`}
                            onClick={() => setActiveTab("submissions")}
                        >
                            Submissions
                        </button>
                        <button
                            className={`flex-1 py-3 text-center font-medium text-base border-b-2 transition-colors ${
                                activeTab === "ai"
                                    ? "text-cyan-400 border-cyan-400 bg-gray-900/80"
                                    : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-900/30"
                            }`}
                            onClick={() => setActiveTab("ai")}
                        >
                            Ask AI
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {activeTab === "problem" ? (
                            <div className="flex-1 p-5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                                <h1 className="text-yellow-200 text-2xl cursor-default font-medium">{problemData?.title}</h1>
                                <p className="text-white mt-2 text-base whitespace-pre-wrap">{problemData?.statement}</p>

                                {testCases.map((testCase, index) => (
                                    <div key={index}>
                                        <h2 className="text-white mt-5 text-lg font-medium">Test Case {index + 1}</h2>
                                        <p className="text-white m-1 text-base">Input</p>
                                        <p className="text-gray-100 p-1 bg-slate-800 whitespace-pre-wrap">{testCase.input}</p>
                                        <p className="text-white m-1 text-base">Output</p>
                                        <p className="text-gray-100 p-1 bg-slate-800 whitespace-pre-wrap">{testCase.expectedOutput}</p>
                                    </div>
                                ))}
                                <p className="text-white mt-5 text-base">Time limit: {problemData?.timeLimitMs}ms</p>
                                <p className="text-white mt-2 text-base">Memory limit: {problemData?.memoryLimitMB}MB</p>
                                <h2 className="text-white mt-5 text-base font-medium">Author: {problemData?.authorName}</h2>
                            </div>
                        ) : (null)}
                       {activeTab==="submissions"?(
                            <div className="flex-1 p-5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                                <Submissions problemID={problemID} setCode={setCode} setLanguage={setLanguage} />
                            </div>
                       ) : (null)}
                       {activeTab==="ai"? (
                            <div className="flex-1 p-5 overflow-hidden">
                                <AIChatBot
                                    problemID={problemID}
                                    problemData={problemData}
                                    code={code}
                                    messages={aiMessages}
                                    setMessages={setAiMessages}
                                    inputText={aiInputText}
                                    setInputText={setAiInputText}
                                    loading={aiLoading}
                                    setLoading={setAiLoading}
                                />
                            </div>
                        ):(null)}
                    </div>
                </div>

                {/* Right Side (Code + Action Console Context) */}
                <div className="w-[50%] h-screen overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none" }}>
                    <div className="h-[70%] px-4">
                        <h1 className="bg-gray-800 p-2 rounded-md text-gray-100">Code</h1>
                        <MonacoEditor language={language} code={code} setCode={setCode} />
                    </div>

                    <div className="flex flex-row pt-12 px-5 justify-between">
                        <button
                            onClick={runEnabled ? handleRun : null}
                            disabled={!runEnabled}
                            className="w-[50%] mr-2 p-1 bg-blue-600 disabled:bg-blue-400 cursor-pointer disabled:cursor-not-allowed rounded-lg hover:bg-blue-700 text-white font-medium text-lg flex justify-center items-center"
                        >
                            {runEnabled ? 'Run Code' : 'Running...'}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!submitEnabled}
                            className="w-[50%] ml-2 p-1 bg-green-700 disabled:bg-green-500 cursor-pointer disabled:cursor-not-allowed rounded-lg hover:bg-green-600 text-white font-medium text-lg flex justify-center items-center"
                        >
                            {!submitEnabled ? 'Submitting...' : 'Submit Code'}
                        </button>
                    </div>                      

                    <div className="flex flex-row bg-slate-800 mx-5 mt-5">
                        <button 
                            className="w-[33%] border border-cyan-800 p-2 text-white font-medium text-lg flex justify-center items-center hover:bg-slate-700"
                            style={{ background: type === 'input' ? "#253c5f" : "" }}
                            onClick={() => {
                                setType("input");
                                setEditing(true);
                            }}
                        >
                            Input
                        </button>

                        <button 
                            className="w-[33%] border border-cyan-800 p-2 text-white font-medium text-lg flex justify-center items-center hover:bg-slate-700"
                            style={{ background: type === 'output' ? "#253c5f" : "" }}
                            onClick={() => {
                                setType("output");
                                setEditing(false);
                            }}
                        >
                            Output
                        </button>

                        <button 
                            className="w-[33%] border border-cyan-800 p-2 text-white font-medium text-lg flex justify-center items-center hover:bg-slate-700"
                            style={{ background: type === 'verdict' ? "#253c5f" : "" }}
                            onClick={() => {
                                setType("verdict");
                                setEditing(false);
                            }}
                        >
                            Verdict
                        </button>
                    </div>

                    <textarea
                        className="h-[10rem] min-h-[10rem] mb-10 text-gray-50 bg-slate-800 mx-5 my-1 rounded-md p-3"
                        value={type === "input" ? input : type === "output" ? output : verdict}
                        placeholder="Input sample test cases"
                        onChange={(e) => {
                            if (type === "input") setInput(e.target.value);
                        }}
                        disabled={!isEditing}
                    />
                    
                    {/* Empty target element that anchors the bottom scroll view */}
                    <div ref={consoleEndRef} className="h-2 w-full" />
                </div>
            </div>
        </div>
    );
};

const Submissions = ({setCode, setLanguage, problemID}) => {
    const [mySubmissions, setMySubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);
    const [submissionsError, setSubmissionsError] = useState(false);

    useEffect(() => {
        const fetchSubmissions = async () => {
            Promise.resolve().then(() => {
                setSubmissionsLoading(true);
                setSubmissionsError(false);
            });
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/v1/user/getMySubmissions/${localStorage.getItem("userID")}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                setMySubmissions(res.data.submissions
                    .filter(
                    (sub) => sub.problemID === problemID
                )
                );
            } catch (err) {
                console.error(err.message);
                setSubmissionsError(true);
            } finally {
                setSubmissionsLoading(false);
            }
        };
        fetchSubmissions();
    }, [problemID, setMySubmissions, setSubmissionsLoading, setSubmissionsError]);

    return (
        <div className="w-full bg-slate-900 text-gray-200">

            <table className="w-full border border-cyan-700 rounded-lg overflow-hidden">

                <thead className="bg-slate-800">
                    <tr className="border-b border-cyan-700">
                        <th className="py-3 px-3 text-center w-[15%]">Submission ID</th>
                        <th className="py-3 px-3 text-left w-[25%]">Language</th>
                        <th className="py-3 px-3 text-left w-[40%]">Verdict</th>
                        <th className="py-3 px-3 text-left w-[20%]">Code</th>
                        
                    </tr>
                </thead>

                <tbody>
                    {submissionsLoading ? (
                        <tr>
                            <td
                                colSpan="4"
                                className="text-center py-8 text-cyan-400"
                            >
                                Loading submissions...
                            </td>
                        </tr>
                    ) : submissionsError ? (
                        <tr>
                            <td
                                colSpan="4"
                                className="text-center py-8 text-red-400"
                            >
                                Error loading submissions.
                            </td>
                        </tr>
                    ) : mySubmissions.length > 0 ? (
                        mySubmissions.map((submission, index) => (
                            <tr
                                key={index}
                                className="border-b border-cyan-700 hover:bg-slate-800 transition"
                            >
                                

                                <td className="px-3 py-3 w-[15%] font-semibold">
                                    {submission.submissionID}
                                </td>

                                <td className="px-3 py-3 w-[25%] font-semibold">
                                    {/* <span
                                        className={`px-3 py-1 text-start text-sm font-medium `}
                                    > */}
                                        {submission.language}
                                    {/* </span> */}
                                </td>

                                <td className="px-3 py-3 text-start ps-5 w-[40%] font-semibold">
                                    {/* <span
                                        className={`px-3 py-1 text-sm font-medium `}
                                    > */}
                                        {submission.verdict}
                                    {/* </span> */}
                                </td>

                                <td className="px-3 py-3 text-start ps-5 w-[20%] text-cyan-400 font-medium text-sm cursor-pointer"
                                    onClick={async () => {
                                        try {
                                            const res = await axios.get(
                                                `${import.meta.env.VITE_BACKEND_URI}/v1/user/getOneSubmission/${submission.submissionID}`,
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                    },
                                                }
                                            );
                                            setCode(res.data.submission.code);
                                            setLanguage(res.data.submission.language);
                                        } catch (err) {
                                            console.error(err.message);
                                        }
                                    }}    
                                >
                                    Revert code
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                className="text-center py-8 text-gray-400"
                            >
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
}

export default Problem;