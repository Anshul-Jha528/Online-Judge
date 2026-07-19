import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-slate-950 text-white overflow-x-hidden h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none"
        }}
      >
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute h-80 w-80 rounded-full bg-purple-600/25 blur-3xl top-10 -left-10 animate-pulse" />
          <div className="absolute h-96 w-96 rounded-full bg-pink-500/20 blur-3xl bottom-10 right-0 animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Hero */}
        <section className="sticky top-0 z-10 flex flex-col justify-center items-center text-center px-6 relative no-scrollbar">

          <span className="px-4 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-sm">
            Online Judge • AI Powered • Docker Sandbox
          </span>

          <div className="flex flex-row">

            <img src={logo} alt="logo" className="w-[40%]" />

            <div>
              <h1 className="mt-8 text-6xl text-purple-500 md:text-8xl font-black">
                CODE CLIMB
              </h1>

              <p className="mt-6 text-2xl md:text-3xl font-semibold text-slate-200">
                Practice. Learn. Improve. Repeat.
              </p>

              <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg">
                Code Climb is a modern online coding platform designed for aspiring
                programmers to master algorithms, improve problem-solving skills and
                receive AI-powered guidance while coding.
              </p>

              <div className="flex flex-wrap justify-center gap-5 mt-10">
                <button
                  onClick={() => { navigate("/allproblems", { replace: false }); }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 duration-300 font-semibold flex items-center gap-2">
                  Start Solving
                </button>
              </div>
            </div>
          </div>


        </section>

        <section className="flex flex-col justify-top pt-20 bg-slate-950 sticky z-20 items-center text-center px-6 relative no-scrollbar">

          <span className="text-5xl font-bold text-purple-500">
            Features
          </span>

          <p className="text-lg text-slate-400 mt-6 max-w-4xl">
            Code Climb provides everything you need to practice, learn and improve your
            programming skills through an interactive and secure coding experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-7xl w-full">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">💻</div>
              <h3 className="text-2xl font-semibold mb-4">Practice Problems</h3>
              <p className="text-slate-400 leading-7">
                Solve coding challenges ranging from beginner to advanced covering arrays,
                strings, graphs, trees, dynamic programming, greedy algorithms and more.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">⚡</div>
              <h3 className="text-2xl font-semibold mb-4">Online Compiler</h3>
              <p className="text-slate-400 leading-7">
                Write, compile and execute code instantly with support for multiple
                programming languages and custom input directly from your browser.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">🤖</div>
              <h3 className="text-2xl font-semibold mb-4">AI Assistant</h3>
              <p className="text-slate-400 leading-7">
                Get intelligent hints, concept explanations and debugging guidance to help
                you understand problems instead of simply revealing solutions.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">🛡️</div>
              <h3 className="text-2xl font-semibold mb-4">Secure Execution</h3>
              <p className="text-slate-400 leading-7">
                Every submission runs inside isolated Docker container with predefined
                execution time and memory limits for safe and reliable evaluation.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">📊</div>
              <h3 className="text-2xl font-semibold mb-4">Verdicts</h3>
              <p className="text-slate-400 leading-7">
                Receive comprehensive feedback including Accepted, Wrong Answer,
                Compilation Error, Runtime Error, Time Limit Exceeded and Memory Limit
                Exceeded.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">🏆</div>
              <h3 className="text-2xl font-semibold mb-4">Track Progress</h3>
              <p className="text-slate-400 leading-7">
                Monitor your coding journey by solving increasingly challenging problems
                and continuously improving your problem-solving abilities.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">🚀</div>
              <h3 className="text-2xl font-semibold mb-4">Leaderboard</h3>
              <p className="text-slate-400 leading-7">
                Find where you stand in your coding journey among peers.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">📚</div>
              <h3 className="text-2xl font-semibold mb-4">Submissions tracking</h3>
              <p className="text-slate-400 leading-7">
                Analyze your past submissions and improve your weak areas.
              </p>
            </div>

          </div>
        </section>

        <section className="flex flex-col pt-30 pb-10 justify-center bg-slate-950 sticky z-30 items-center text-center px-6">

          <span className="text-5xl font-bold text-purple-500">
            Powerful Admin Panel
          </span>

          <p className="text-lg text-slate-400 mt-6 max-w-4xl">
            Code Climb provides administrators with a streamlined interface to create,
            manage and maintain high-quality coding problems. From AI-assisted problem
            generation to automated verification, every tool is designed to reduce
            manual effort while ensuring consistency and correctness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-7xl w-full">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">📝</div>

              <h3 className="text-2xl font-semibold mb-4">
                Simplified Problem Creation
              </h3>

              <p className="text-slate-400 leading-7">
                Create coding problems through an intuitive interface with support for
                statements, constraints, examples, difficulty levels, topics and limits.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">🤖</div>

              <h3 className="text-2xl font-semibold mb-4">
                AI Assisted Authoring
              </h3>

              <p className="text-slate-400 leading-7">
                Generate problem descriptions, improve wording, create examples and
                receive intelligent suggestions while preparing coding challenges.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">✅</div>

              <h3 className="text-2xl font-semibold mb-4">
                AI Verification
              </h3>

              <p className="text-slate-400 leading-7">
                Every problem can be reviewed by AI to identify ambiguous statements,
                missing constraints, incorrect examples and potential logical issues.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">🧪</div>

              <h3 className="text-2xl font-semibold mb-4">
                Test Case Management
              </h3>

              <p className="text-slate-400 leading-7">
                Add, edit and organize sample as well as hidden test cases with ease to
                ensure accurate evaluation of every submission.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">⚙️</div>

              <h3 className="text-2xl font-semibold mb-4">
                Complete Problem Control
              </h3>

              <p className="text-slate-400 leading-7">
                Configure execution time, memory limits, topics and difficulty from one centralized dashboard.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-5">🚀</div>

              <h3 className="text-2xl font-semibold mb-4">
                Faster Publishing
              </h3>

              <p className="text-slate-400 leading-7">
                Reduce the time required to publish new coding challenges using AI
                assistance, automated validation and an efficient management workflow.
              </p>
            </div>

          </div>

        </section>

        <section className="flex flex-col justify-top pt-20 pb-30 bg-slate-950 sticky top-0 z-20 items-center text-center px-6 relative no-scrollbar">

          <span className="text-5xl font-bold text-purple-500">
            Developed and managed by
          </span>

          <p className="text-lg text-slate-300 mt-6 max-w-4xl">
            Anshul Jha
          </p>

          <p className="text-lg text-slate-300">
            IIIT Bhopal
          </p>
          <p className="text-lg text-yellow-300 mt-2">
            Guided by AlgoUniversity
          </p>

          <p className="text-lg text-slate-500 mt-2">
            &copy; 2026 Code Climb. All rights reserved
          </p>



        </section>


      </div>

    </>
  )
}

export default Home;