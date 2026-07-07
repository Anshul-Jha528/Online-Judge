import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const addTestCase = () => {
    document.title = "Admin Panel";

    const navigate = useNavigate();

    const problemID = useParams().problemID;

    const [testCases, setTestCases] = useState([
        {
            input: "",
            expectedOutput: "",
            isHidden: false
        },
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...testCases];
        updated[index][field] = value;
        setTestCases(updated);
    };

    const addTestCase = () => {
        setTestCases([
            ...testCases,
            {
                input: "",
                expectedOutput: "",
            },
        ]);
    };

    const deleteTestCase = (index) => {
        const updated = testCases.filter((_, i) => i !== index);
        setTestCases(updated);
    };

    const validate = () => {
        const hasEmpty = testCases.some(
            tc => tc.expectedOutput.trim() == ""
        )

        if (hasEmpty) {
            toast.error("Please fill all test cases.");
            return false;
        }
        return true;
    }

    const submit = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/v1/admin/addAllTestCases/${problemID}`,
                { testCases },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )

            toast.success("Test cases added successfully.", {
                onClose: () => {
                    navigate(`/admin/myProblems`, { replace: true });
                }, autoClose: 2000
            });
        } catch (err) {
            console.log(err.message);
            toast.error("Failed to add test cases.", { autoClose: 3000 });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        Swal.fire({

            title: "Are you sure?",
            text: "Have you verified the test cases?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3b82f6",
            confirmButtonText: "Yes, Add it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                submit();
            }

        })

        console.log(testCases);
        // axios.post(...)
    };

    return (
        <div className="min-h-screen bg-[#111827] text-white py-10 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Heading */}

                <div className="text-yellow-300 border border-yellow-500 flex justify-center text-[20px] mb-10 py-2">
                    Add Test Cases
                </div>

                {/* Cards */}

                <div className="space-y-8">

                    {testCases.map((testCase, index) => (

                        <div
                            key={index}
                            className="bg-[#1f2937] rounded-xl shadow-lg border border-gray-700 p-6"
                        >

                            {/* Header */}

                            <div className="flex justify-between items-center mb-5">

                                <h2 className="text-xl font-semibold text-cyan-400">
                                    Test Case #{index + 1}
                                </h2>

                                {testCases.length > 1 && (
                                    <button
                                        onClick={() => deleteTestCase(index)}
                                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                                    >
                                        Delete
                                    </button>
                                )}

                            </div>

                            {/* Input */}

                            <div className="mb-5">
                                <label className="block mb-2 font-medium">
                                    Input
                                </label>

                                <textarea
                                    rows={6}
                                    value={testCase.input}
                                    onChange={(e) =>
                                        handleChange(index, "input", e.target.value)
                                    }
                                    className="w-full bg-cyan-50 border border-cyan-500  text-gray-950 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:border-2"
                                    placeholder="Enter test case input..."
                                />
                            </div>

                            {/* Output */}

                            <div>
                                <label className="block mb-2 font-medium">
                                    Expected Output
                                </label>

                                <textarea
                                    rows={4}
                                    value={testCase.expectedOutput}
                                    onChange={(e) =>
                                        handleChange(index, "expectedOutput", e.target.value)
                                    }
                                    className="w-full bg-cyan-50 text-gray-950 border border-cyan-500 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:border-2"
                                    placeholder="Enter expected output..."
                                />
                            </div>

                            <div className="flex justify-end pt-5 gap-2">
                                <input
                                    type="checkbox"
                                    onChange={(e) => handleChange(index, "isHidden", e.target.checked)}
                                    checked={testCase.isHidden}
                                />
                                <label className="text-gray-50">isHidden</label>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Buttons */}

                <div className="flex justify-between mt-10">

                    <button
                        onClick={addTestCase}
                        className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold transition"
                    >
                        + Add Test Case
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition"
                    >
                        Save All Test Cases
                    </button>

                </div>

            </div>
        </div>
    );
};

export default addTestCase;