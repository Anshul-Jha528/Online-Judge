import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const AdminUpdateProblem = () => {
    const problemID = useParams().problemID;
    console.log(useParams());
    const [title, setTitle] = useState("");
    const [statement, setStatement] = useState("");
    const [diff, setDiff] = useState("");
    const [time, setTime] = useState("");
    const [memory, setMemory] = useState("");
    const [topics, setTopics] = useState([]);
    const [topicInput, setTopicInput] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const getProblemDetails = async () => {
            if (!problemID) return;
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/admin/getProblem/${problemID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                // console.log("Problem Data:", res.data);

                const problem = res.data.problem;

                // Set all fields
                setTitle(problem.title);
                setStatement(problem.statement);
                setDiff(problem.difficulty);
                setTime(String(problem.timeLimitMs));
                setMemory(String(problem.memoryLimitMB));
                setTopics(problem.topics || []);
            } catch (err) {
                console.error("Error fetching problem details:", err.message);
                toast.error("Failed to load problem details");
            }
        };

        getProblemDetails();

    }, [problemID]);

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

    const updateProblem = async () => {

        toast.info("Updating problem...", {
            autoClose: 2000,
        })
        try {
            const problemData = {
                title,
                statement,
                difficulty: diff,
                timeLimitMs: Number(time),
                memoryLimitMB: Number(memory),
                topics,
                problemID: problemID,
            };

            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URI}/v1/admin/updateProblem`,
                problemData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Problem updated successfully");
            }
            console.log(res.data);
        } catch (err) {
            toast.error("Failed to update problem");
            console.log(err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update this problem?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3b82f6",
            confirmButtonText: "Yes, Update it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                updateProblem();
            }
        });
    }

    const deleteProblem = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/v1/admin/deleteProblem/${problemID}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Problem deleted successfully", {
                    onClose: () => navigate("/admin/myProblems", { replace: true }),
                    autoClose: 3000
                });
            }
            console.log(res.data);
        } catch (err) {
            toast.error("Failed to delete problem");
            console.log(err.message);
        }
    }

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3b82f6",
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProblem();
            }
        });

    }

    return (
        <div className="w-full flex-col font-serif p-5 text-[16px]">
            <div className="text-yellow-300 border border-yellow-500 flex justify-center text-[20px] py-2">
                Please enter updated problem details
            </div>

            <div className="w-full px-10 py-5">
                <form className="space-y-5" onSubmit={handleUpdate}>
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
                    <div className="flex justify-between gap-8">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded"
                        >
                            Update Problem
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete()}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded"
                        >
                            Delete Problem
                        </button>
                        <button
                            type="button"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded"
                        >
                            Add Test Cases
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUpdateProblem;