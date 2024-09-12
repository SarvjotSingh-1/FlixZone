// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuthStore } from "../store/authUser";

// const SignUpPage = () => {
//   const { searchParams } = new URL(document.location);
//   const emailValue = searchParams.get("email");

//   const [email, setEmail] = useState(emailValue || "");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const { signup, isSigningUp } = useAuthStore();

//   const handleSignUp = (e) => {
//     e.preventDefault();
//     signup({ email, username, password });
//   };

//   return (
//     <div className="h-screen w-full hero-bg">
//       <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
//         <Link to={"/"}>
//           <img src="/netflix-logo.png" alt="logo" className="w-52" />
//         </Link>
//       </header>

//       <div className="flex justify-center items-center mt-20 mx-3">
//         <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
//           <h1 className="text-center text-white text-2xl font-bold mb-4">
//             Sign Up
//           </h1>

//           <form className="space-y-4" onSubmit={handleSignUp}>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="text-sm font-medium text-gray-300 block"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
//                 placeholder="you@example.com"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="username"
//                 className="text-sm font-medium text-gray-300 block"
//               >
//                 Username
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
//                 placeholder="johndoe"
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="text-sm font-medium text-gray-300 block"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
//                 placeholder="••••••••"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <button
//               className="w-full py-2 bg-red-600 text-white font-semibold rounded-md
// 							hover:bg-red-700
// 						"
//               disabled={isSigningUp}
//             >
//               {isSigningUp ? "Loading..." : "Sign Up"}
//             </button>
//           </form>
//           <div className="text-center text-gray-400">
//             Already a member?{" "}
//             <Link to={"/login"} className="text-red-500 hover:underline">
//               Sign in
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default SignUpPage;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30); // Timer in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setError("OTP expired. Please request a new one.");
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    setError("");
    try {
      await axios.post("/api/v1/auth/signup", { email, username, password });

      await axios.post("/api/v1/otp/send-otp", { email });
      setIsOtpSent(true);
      setTimer(30); // Reset timer to 30 seconds
      setIsTimerActive(true); // Start timer
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");

      console.error("Sign-up error:", error);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    try {
      //      await axios.post("/api/v1/auth/signup", { email, username, password });

      await axios.post("/api/v1/otp/verify-otp", { email, otp });
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");

      // setError(
      //   `Signup failed: ${error.response?.data?.message || error.message}`
      // );

      console.error("Signup error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="h-screen w-full hero-bg">
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to={"/"}>
          <img
            src="/netflix-logo.png"
            alt="logo"
            className="w-52"
          />
          {/* FlixZone-removebg-preview1.png */}
          {/* netflix-logo.png */}
        </Link>
      </header>

      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
          <h1 className="text-center text-white text-2xl font-bold mb-4">
            {isOtpSent ? "Verify OTP" : "Sign Up"}
          </h1>

          {!isOtpSent ? (
            <form className="space-y-4" onSubmit={handleSignUp}>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300 block"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                  placeholder="you@example.com"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-300 block"
                >
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                  placeholder="johndoe"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300 block"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                  placeholder="••••••••"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                disabled={isSigningUp}
              >
                {isSigningUp ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleOtpVerification}>
              <div>
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-300 block"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                  placeholder="123456"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center">
                {isTimerActive && (
                  <p className="text-gray-300">Time left: {timer}s</p>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <button
                className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          <div className="text-center text-gray-400 mt-4">
            Already a member?{" "}
            <Link to={"/login"} className="text-red-500 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
