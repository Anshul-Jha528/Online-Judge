import React, { useEffect, useRef } from "react";
import axios from "axios";

const AIChatBot = ({
    problemID,
    problemData,
    code,
    messages,
    setMessages,
    inputText,
    setInputText,
    loading,
    setLoading
}) => {
    const messagesEndRef = useRef(null);
    // Track the timestamp of the last request
    const lastRequestTimeRef = useRef(0); 
    const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URI}/v1/ai/askAI`;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSendMessage = async (textToSend) => {
        if (!textToSend?.trim() || loading) return;

        // --- RATE LIMIT CONSTRAINT (1 MINUTE) ---
        const now = Date.now();
        const cooldownMs = 60000; // 1 minute in milliseconds
        const timePassed = now - lastRequestTimeRef.current;

        if (timePassed < cooldownMs) {
            const secondsLeft = Math.ceil((cooldownMs - timePassed) / 1000);
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: `⚠️ Please wait ${secondsLeft} second(s) before making another request.` }
            ]);
            return;
        }
        // ----------------------------------------

        const userMessage = textToSend.trim();
        setInputText("");
        setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setLoading(true);

        try {
            const history = messages
                .slice(1)
                .map((m) => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`)
                .join("\n");

            const promptText = `
Problem: ${problemData?.title || "Unknown"} - ${problemData?.statement || ""}
Code: \`\`\`\n${code}\n\`\`\`
${history ? `History:\n${history}\n` : ""}
User Request: ${userMessage}
`;

            const res = await axios.post(
                BACKEND_URL,
                { prompt: promptText, problemID },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            // Update timestamp ONLY on successful request generation initiation
            lastRequestTimeRef.current = Date.now();

            const aiResponse = res.data?.answer || res.data?.explanation || res.data?.hint || res.data?.review || res.data?.complexity || "No response received.";
            setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
        } catch (error) {
            console.error("AI chat error:", error);
            const errMsg = error.response?.data?.message || "Failed to get AI response. Try again.";
            setMessages((prev) => [...prev, { sender: "ai", text: `Error: ${errMsg}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputText);
        }
    };

    const triggerQuickAction = (text) => handleSendMessage(text);

    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-100 rounded-lg overflow-hidden border border-gray-800">
            {/* Quick Actions Header */}
            <div className="p-3 bg-gray-900 border-b border-gray-800 flex flex-wrap gap-2 justify-center">
                <button disabled={loading} onClick={() => triggerQuickAction("Explain the problem statement for me.")} className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border border-emerald-600/40 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50">📖 Explain</button>
                <button disabled={loading} onClick={() => triggerQuickAction("Give me Hint 1 (approach / general strategy).")} className="px-3 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-200 border border-yellow-600/40 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50">💡 Hint 1</button>
                <button disabled={loading} onClick={() => triggerQuickAction("Give me Hint 2 (edge cases / pseudo-code pointers).")} className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 border border-amber-600/40 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50">🔑 Hint 2</button>
                <button disabled={loading} onClick={() => triggerQuickAction("Review my current code and suggest improvements.")} className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-600/40 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50">✨ Review Code</button>
                <button disabled={loading} onClick={() => triggerQuickAction("Analyze why my code fails pointing to specific error or edge case miss,")} className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-600/40 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50">✨ Why my code fails</button>
                <button disabled={loading} onClick={() => triggerQuickAction("Analyze the time and space complexity of my code.")} className="px-3 py-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 border border-violet-600/40 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50">📊 Complexity</button>
                <button disabled={loading} onClick={() => triggerQuickAction("Generate a detailed report for my code considering aspects like time complexity, space complexity, coding style, and suggest possible improvements and optimizations.")} className="px-3 py-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 border border-violet-600/40 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50">📊 Generate Report</button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col" style={{ scrollbarWidth: "none" }}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col max-w-[85%] rounded-lg p-3 ${msg.sender === "user" ? "self-end bg-cyan-800 text-white rounded-br-none" : "self-start bg-slate-800 text-gray-100 rounded-bl-none border border-slate-700/50"}`}>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase mb-1">{msg.sender === "user" ? "You" : "Code Climb AI"}</span>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    </div>
                ))}
                
                {loading && (
                    <div className="self-start bg-slate-800 text-gray-100 rounded-lg rounded-bl-none border border-slate-700/50 p-3 max-w-[85%] flex flex-col">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase mb-2">Code Climb AI</span>
                        <div className="flex space-x-1 py-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-gray-800 flex items-center space-x-2">
                <textarea
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask AI for help with this problem..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none min-h-[40px] max-h-[120px]"
                />
                <button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={loading || !inputText.trim()}
                    className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AIChatBot;