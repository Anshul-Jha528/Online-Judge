import { useEffect, useState } from "react";
import axios from 'axios';

const Leaderboard = () => {
    document.title = "Leaderboard";

    const [leaderboard, setLeaderboad] = useState([]);

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/user/getLeaderboard`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )
                console.log(res.data);

                setLeaderboad(res.data.users);
            } catch (err) {
                console.log(err.message);
            }
        }
        getLeaderboard();
    },[]);

    return (
        <div className="w-full min-h-screen bg-slate-900 px-5 py-5 text-gray-200">

            <div className="w-fill text-gray-50 text-center text-2xl my-5">
                View your rank and top performers!
            </div>

            <table className="w-full border border-cyan-700 rounded-lg overflow-hidden">

                <thead className="bg-slate-800">
                    <tr className="border-b border-cyan-700">
                        <th className="py-3 px-3 text-left w-[10%]">Rank</th>
                        <th className="py-3 px-3 text-left w-[35%]">Name</th>
                        <th className="py-3 px-3 text-left w-[25%]">Score</th>
                        <th className="py-3 px-3 text-left w-[15%]">Problems Solved</th>
                        <th className="py-3 px-3 text-center w-[15%]">Used ID</th>
                    </tr>
                </thead>

                <tbody>
                    {leaderboard.length > 0 ? (
                        leaderboard.map((leaderboard, index) => (
                            <tr
                                key={index}
                                className="border-b border-cyan-700 hover:bg-slate-800 transition"
                            >
                                <td className="px-3 py-3">
                                    {index+1}
                                </td>

                                <td className="px-3 py-3 font-semibold">
                                    {leaderboard.fullName}
                                </td>

                                <td className="px-3 py-3">
                                    <span
                                        className={`px-3 py-1 text-sm font-medium `}
                                    >
                                        {leaderboard.score}
                                    </span>
                                </td>

                                <td className="px-3 py-3">
                                    <span
                                        className={`px-3 py-1 text-sm font-medium `}
                                    >
                                        {leaderboard.problems}
                                    </span>
                                </td>

                                <td className="px-3 py-3 text-center text-cyan-400 font-medium text-sm">
                                    {leaderboard.userID}
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
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

export default Leaderboard;