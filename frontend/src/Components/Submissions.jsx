import { useEffect, useState } from "react";
import axios from 'axios';
const Submissions = () =>{
    document.title = "Submissions";

    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const getSubmissions = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/user/getMySubmissions/${localStorage.getItem("userID")}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )
                console.log(res.data);

                setSubmissions(res.data.submissions);
            } catch (err) {
                console.log(err.message);
            }
        }
        getSubmissions();
    },[]);

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
                        <th className="py-3 px-3 text-left w-[25%]">Language</th>
                        <th className="py-3 px-3 text-left w-[15%]">Verdict</th>
                        <th className="py-3 px-3 text-center w-[15%]">Submission ID</th>
                    </tr>
                </thead>

                <tbody>
                    {submissions.length > 0 ? (
                        submissions.map((submission, index) => (
                            <tr
                                key={index}
                                className="border-b border-cyan-700 hover:bg-slate-800 transition"
                            >
                                <td className="px-3 py-3">
                                    {index}
                                </td>

                                <td className="px-3 py-3 font-semibold">
                                    {submission.problemID}
                                </td>

                                <td className="px-3 py-3">
                                    <span
                                        className={`px-3 py-1 text-sm font-medium `}
                                    >
                                        {submission.problemTitle}
                                    </span>
                                </td>

                                <td className="px-3 py-3">
                                    <span
                                        className={`px-3 py-1 text-sm font-medium `}
                                    >
                                        {submission.language}
                                    </span>
                                </td>

                                <td className="px-3 py-3 text-center text-cyan-400 font-medium text-sm">
                                    {submission.verdict}
                                </td>

                                <td className="px-3 py-3 text-center text-cyan-400 font-medium text-sm">
                                    {submission.submissionID}
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

export default Submissions;
