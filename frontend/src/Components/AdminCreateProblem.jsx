import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCreateProblem = () => {
    document.title = "Admin Panel";

    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [statement, setStatement] = useState("");
    const [diff, setDiff] = useState("");
    const [time, setTime] = useState("");
    const [memory, setMemory] = useState("");
    const [topics, setTopics] = useState([]);
    const [topicInput, setTopicInput] = useState("");
    const [submitText, setSubmitText] = useState("Verify problem");
    const [scoreVisible, setScoreVisible] = useState(false);
    const [expertReport, setExpertReport] = useState("");
    const [verified, setVerified] = useState(false);
    const [autoCompleteClicked, setAutoCompleteClicked] = useState(false);

    const addTopic = () => {
        const topic = topicInput.trim();
        if (!topic) return;
        if (
            topics.some(
                (t) => t.toLowerCase() === topic.toLowerCase()
            )
        ) {
            setTopicInput("");
            return;
        }
        setTopics([...topics, topic]);
        setTopicInput("");
    };

    const handleTopicKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTopic();
        }
    };

    const removeTopic = (topic) => {
        setTopics(topics.filter((t) => t !== topic));
    };

    const handleAutoComplete = async () => {
        if(autoCompleteClicked){
            toast.info("Already generating...")
            return;
        }
        toast.info("Generating optimized problem statement...",{autoClose:2000});
        
        setAutoCompleteClicked(true);
        try{
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/ai/autoCompleteProblem`,
                {
                    problem: statement
                },
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setStatement(res.data.problem);
            
        } catch(err){
            console.log(err.message);
            toast.error("Could not autocomplete problem", {autoClose:3000});
            setAutoCompleteClicked(false);
        }
    }

    const getReport = async () => {
        if(!statement || !title || !diff || !time || !memory || !topics.length){
            toast.warning("Please fill all the fields", {autoClose:3000});
            return;
        }
        toast.info("Getting report...", {autoClose: 2000});
        try{
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/ai/verifyProblem`,
                {
                    problem: statement,
                    title,
                    difficulty: diff,
                    timeLimitMs: Number(time),
                    memoryLimitMB: Number(memory),
                    topics,
                },
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if(res.data.score.split(" ")[0]>=80){
                toast.success("Problem is good to go!", {autoClose:3000});
                setExpertReport("Problem qualified with score of "+res.data.score);
                setVerified(true);
                setSubmitText("Create Problem");

            } else {
                toast.warning("Problem did not meet the criteria!", {autoClose:3000});
                setExpertReport("Score : "+res.data.score);
            }
            setScoreVisible(true);
        } catch(err){
            console.log(err.response?.data?.message);
            toast.error("Could not get report", {autoClose:3000});
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!title || !statement || !diff || !time || !memory || !topics.length){
            toast.warning("Please fill all the fields", {autoClose:3000});
            return;
        }

        if(!verified){
            toast.warning("Please get a report first", {autoClose:3000});
            return;
        }

        toast.info("Creating problem...",
            {autoClose: 2000}
        )

        const problemData = {
            title,
            statement,
            difficulty: diff,
            timeLimitMs: Number(time),
            memoryLimitMB: Number(memory),
            topics,
        };
        try{
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/v1/admin/createProblem`,
        problemData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        if(res.status === 201){
            toast.success("Problem created successfully",{
                onClose:()=>{
                    navigate(`/admin/addTestCases/${res.data.problem.problemID}`, {replace: true});
                }
            }
            );
        }
        console.log(res.data);
    } catch(err){
        console.log(err.message);
        toast.error("Could not create problem", {autoClose:3000});
    }
    };

    return (
        <div className="w-full flex-col font-serif p-5 bg-slate-900 text-[16px]">
            <div className="text-yellow-300 border border-yellow-500 flex justify-center text-[20px] py-2">
                Please enter problem details
            </div>

            <div className="w-full px-10 py-5">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Row 1 */}
                    <div className="flex gap-6">
                        <div className="flex items-center w-1/2">
                            <label className="w-40 text-white">
                                Title
                            </label>

                            <input
                                type="text"
                                placeholder="Two Sum"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="flex-1 bg-cyan-50 text-gray-900 border-2 border-cyan-600 rounded px-3 py-2 placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex items-center w-1/2">
                            <label className="w-40 text-white">
                                Difficulty
                            </label>

                            <select
                                value={diff}
                                onChange={(e) => setDiff(e.target.value)}
                                className="flex-1 bg-cyan-50 text-gray-900 border-2 border-cyan-600 rounded px-3 py-2"
                            >
                                <option value="">Select Difficulty</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex gap-6">
                        <div className="flex items-center w-1/2">
                            <label className="w-40 text-white">
                                Time Limit
                            </label>

                            <input
                                type="number"
                                placeholder="1000"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="flex-1 bg-cyan-50 text-gray-900 border-2 border-cyan-600 rounded px-3 py-2 placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex items-center w-1/2">
                            <label className="w-40 text-white">
                                Memory Limit
                            </label>

                            <input
                                type="number"
                                placeholder="256"
                                value={memory}
                                onChange={(e) => setMemory(e.target.value)}
                                className="flex-1 bg-cyan-50 text-gray-900 border-2 border-cyan-600 rounded px-3 py-2 placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="flex gap-6 items-start">
                        <div className="flex w-1/2">
                            <label className="w-40 text-white pt-2">
                                Statement
                            </label>

                            <textarea
                                placeholder="Provide a detailed problem statement along with constraints, input and output format, and possible data type warnings..."
                                value={statement}
                                onChange={(e) =>{
                                    setStatement(e.target.value)
                                    setVerified(false);
                                }
                                }
                                className="flex-1 h-56 bg-cyan-50 text-gray-900 border-2 border-cyan-600 rounded px-3 py-2 placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex w-1/2">
                            <label className="w-40 text-white pt-2">
                                Topics
                            </label>

                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="HashMap"
                                        value={topicInput}
                                        onChange={(e) =>
                                            setTopicInput(e.target.value)
                                        }
                                        onKeyDown={handleTopicKeyDown}
                                        className="flex-1 bg-cyan-50 text-gray-900 border-2 border-cyan-600 rounded px-3 py-2 placeholder:text-gray-600"
                                    />

                                    <button
                                        type="button"
                                        onClick={addTopic}
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 rounded"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Topic Chips */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {topics.map((topic) => (
                                        <div
                                            key={topic}
                                            className="flex items-center gap-2 bg-green-400 text-white px-3 py-1 rounded-full"
                                        >
                                            <span>{topic}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeTopic(topic)
                                                }
                                                className="font-bold hover:text-red-300"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    {
                        scoreVisible && (
                    <div className = "w-full text-start mx-10 my-5 p-4 rounded-md border border-2 border-cyan-500 bg-green-200 h-auto text-black font-semibold">
                        {expertReport}
                        
                    </div>
                        )
                    }

                    {
                        (statement.trim().length>10) && !autoCompleteClicked &&
                        <buton
                            onClick={handleAutoComplete} 
                            className="fixed bottom-10 right-6 h-24 w-24 text-center text-sm rounded-full bg-orange-600 hover:bg-orange-700 text-gray-100 shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center z-50">
                            Stuck with idea? Auto complete
                        </buton>
                    }

                    {/* Submit */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={verified? handleSubmit: getReport}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded"
                        >
                            {submitText}
                        </button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateProblem;