import axios from "axios";
import { useEffect, useState } from "react";

const ShowAllProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProblems = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/user/getAllProblems`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                console.log("API Response:", res.data);

                setProblems(res.data.problems);

                setLoading(false);
            } catch (err) {
                console.log(err.response?.data || err.message);
                setLoading(false);
            }
        };

        getProblems();
    }, []);

    if (loading) {
        return (
            <div className="text-white text-center mt-10 text-xl">
                Loading Problems...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-900 px-5 py-5 text-gray-200">

            <div className="w-fill text-gray-50 text-center text-2xl my-5">
                Welcome {localStorage.getItem("username")}!
            </div>

            <table className="w-full border border-cyan-700 rounded-lg overflow-hidden">

                <thead className="bg-slate-800">
                    <tr className="border-b border-cyan-700">
                        <th className="py-3 px-3 text-left w-[10%]">Problem ID</th>
                        <th className="py-3 px-3 text-left w-[35%]">Title</th>
                        <th className="py-3 px-3 text-left w-[25%]">Topics</th>
                        <th className="py-3 px-3 text-left w-[15%]">Difficulty</th>
                        <th className="py-3 px-3 text-center w-[15%]">Solve</th>
                    </tr>
                </thead>

                <tbody>
                    {problems.length > 0 ? (
                        problems.map((problem) => (
                            <tr
                                key={problem._id}
                                className="border-b border-cyan-700 hover:bg-slate-800 transition"
                            >
                                <td className="px-3 py-3">
                                    {problem.problemID}
                                </td>

                                <td className="px-3 py-3 font-semibold">
                                    {problem.title}
                                </td>

                                <td className="px-3 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        {problem.topics?.map((topic) => (
                                            <span
                                                key={topic}
                                                className="bg-cyan-700 text-white px-2 py-1 rounded text-xs"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                <td className="px-3 py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            problem.difficulty === "Easy"
                                                ? "bg-green-600"
                                                : problem.difficulty === "Medium"
                                                ? "bg-yellow-500 text-black"
                                                : "bg-red-600"
                                        }`}
                                    >
                                        {problem.difficulty}
                                    </span>
                                </td>

                                <td className="px-3 py-3 text-center">
                                    <button
                                        className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition cursor-pointer"
                                    >
                                        Solve →
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                className="text-center py-8 text-gray-400"
                            >
                                No problems found.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default ShowAllProblems;