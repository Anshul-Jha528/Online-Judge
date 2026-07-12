import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; 
import Swal from "sweetalert2";

const EditTestCases = () => {
    document.title = "Admin Panel";

    const problemID = useParams().problemID;

    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        const fetchTCs = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URI}/v1/admin/getAllTestCases/${problemID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                // Map existing test cases to include an isEditing: false flag
                const fetchedData = (res.data.testCases || []).map(tc => ({
                    ...tc,
                    isEditing: false
                }));
                setTestCases(fetchedData);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchTCs();
    }, [problemID]);

    const handleChange = (index, field, value) => {
        const updated = [...testCases];
        updated[index][field] = value;
        setTestCases(updated);
    };

    const addTestCase = () => {
        setTestCases([
            ...testCases,
            {
                testCaseID: "",
                input: "",
                expectedOutput: "",
                isHidden: false,
                isEditing: true, 
                isNew: true 
            },
        ]);
    };

    const deleteTestCase = async (index) => {
        Swal.fire(
            {
                title: "Are you sure?",
                text: "Do you want to delete this test case? The action cannot be reversed.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#3b82f6",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!"
            }).then(async result=>{
                if(result.isConfirmed){
                    try{
                        const testCaseID = testCases[index].testCaseID;
                        if(!testCaseID){
                            throw new Error("Test case ID is required");
                        }
                        const res = await axios.delete(
                            `${import.meta.env.VITE_BACKEND_URI}/v1/admin/deleteTestCase/${testCaseID}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }
                        );
                        if (res.status === 201 || res.status === 200) {
                            toast.success("Test case deleted successfully", { autoClose: 2000 });
                            const updated = [...testCases];
                            updated.splice(index, 1);
                            setTestCases(updated);
                        }
                    }catch(err){
                        console.log(err.message);
                        toast.error("Failed to delete test case");
                    }
                }
            })
        
    };

    const validate = (index) => {
        const hasEmpty = !testCases[index].expectedOutput || testCases[index].expectedOutput.trim() === "";
        if (hasEmpty) {
            toast.error("Please complete the fields");
            return false;
        }
        return true;
    };

    const save = async (index) => {
        if (!validate(index)) return;
        // console.log(testCases[index].testCaseID+" 1");

        try {
            console.log(problemID);
            const data = {
                input: testCases[index].input,
                expectedOutput: testCases[index].expectedOutput,
                isHidden: testCases[index].isHidden
            };
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/v1/admin/addTestCase/${problemID}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.status === 201 || res.status === 200) {
                toast.success("Test case saved successfully", { autoClose: 2000 });
                const updated = [...testCases];
                updated[index].isEditing = false;
                delete updated[index].isNew;
                setTestCases(updated);
            }
        } catch (err) {
            console.log(err);
            const message = err.response?.data?.message || "Failed to save test case";
            toast.error(message,{autoClose: 3000});
        }
    };

    const update = async (index) => {
        if (!validate(index)) return;

        try {
            const data = {
                testCaseID: testCases[index].testCaseID,
                input: testCases[index].input,
                expectedOutput: testCases[index].expectedOutput,
                isHidden: testCases[index].isHidden
            };
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URI}/v1/admin/updateTestCase`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.status === 201 || res.status === 200) {
                toast.success("Test case updated successfully", { autoClose: 2000 });
                const updated = [...testCases];
                updated[index].isEditing = false;
                setTestCases(updated);
            }
        } catch (err) {
            console.log(err.response?.data?.message);
            const message = err.response?.data?.message;

            toast.error(message,{autoClose: 3000});
        }
    };

    const toggleEdit = (index) => {
        const updated = [...testCases];
        updated[index].isEditing = true;
        setTestCases(updated);
    };

    return (
        <div className="min-h-screen bg-[#111827] text-white py-10 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Heading */}
                <div className="text-yellow-300 border border-yellow-500 flex justify-center text-[20px] mb-10 py-2">
                    Edit/Add Test Cases
                </div>

                {
                    testCases.length == 0 && (
                        <div className="flex justify-center text-gray-500 mb-5">No test cases added yet.</div>
                    )
                }

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

                                <div className="flex gap-2">
                                    {/* Action Buttons Management */}
                                    {!testCase.isEditing ? (
                                        <button
                                            onClick={() => toggleEdit(index)}
                                            className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition"
                                        >
                                            Edit
                                        </button>
                                    ) : testCase.isNew ? (
                                        <button
                                            onClick={() => save(index)}
                                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => update(index)}
                                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                                        >
                                            Update
                                        </button>
                                    )}

                                    {testCases.length > 1 && (
                                        <button
                                            onClick={() => deleteTestCase(index)}
                                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Input */}
                            <div className="mb-5">
                                <label className="block mb-2 font-medium">Input</label>
                                <textarea
                                    rows={6}
                                    value={testCase.input}
                                    disabled={!testCase.isEditing}
                                    onChange={(e) => handleChange(index, "input", e.target.value)}
                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:border-2 ${
                                        testCase.isEditing 
                                        ? "bg-cyan-50 text-gray-950 border-cyan-500" 
                                        : "bg-gray-800 text-gray-50 border-gray-600 cursor-not-allowed"
                                    }`}
                                    placeholder="Enter test case input..."
                                />
                            </div>

                            {/* Output */}
                            <div>
                                <label className="block mb-2 font-medium">Expected Output</label>
                                <textarea
                                    rows={4}
                                    value={testCase.expectedOutput}
                                    disabled={!testCase.isEditing}
                                    onChange={(e) => handleChange(index, "expectedOutput", e.target.value)}
                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:border-2 ${
                                        testCase.isEditing 
                                        ? "bg-cyan-50 text-gray-950 border-cyan-500" 
                                        : "bg-gray-800 text-gray-50 border-gray-600 cursor-not-allowed"
                                    }`}
                                    placeholder="Enter expected output..."
                                />
                            </div>

                            <div className="flex justify-end pt-5 gap-2">
                                <input
                                    type="checkbox"
                                    disabled={!testCase.isEditing}
                                    onChange={(e) => handleChange(index, "isHidden", e.target.checked)}
                                    checked={testCase.isHidden}
                                />
                                <label className="text-gray-50">isHidden</label>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Add Button */}
                <div className="flex justify-between mt-10">
                    <button
                        onClick={addTestCase}
                        className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold transition"
                    >
                        + Add Test Case
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditTestCases;