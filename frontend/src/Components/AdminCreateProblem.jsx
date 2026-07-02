import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AdminCreateProblem = () => {
    const [title, setTitle] = useState("");
    const [statement, setStatement] = useState("");
    const [diff, setDiff] = useState("");
    const [time, setTime] = useState("");
    const [memory, setMemory] = useState("");
    const [topics, setTopics] = useState([]);
    const [topicInput, setTopicInput] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        toast.info("Creating problem...",{
            autoClose: 2000,
        })

        const problemData = {
            title,
            statement,
            difficulty: diff,
            timeLimitMs: Number(time),
            memoryLimitMB: Number(memory),
            topics,
        };

        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/v1/admin/createProblem`,
        problemData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        if(res.status === 201){
            toast.success("Problem created successfully");
        }
        console.log(res.data);
    };

    return (
        <div className="w-full flex-col font-serif p-5 text-[16px]">
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
                                placeholder="Given an array of integers..."
                                value={statement}
                                onChange={(e) =>
                                    setStatement(e.target.value)
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

                    {/* Submit */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded"
                        >
                            Create Problem
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateProblem;