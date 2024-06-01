import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import logo from "../assets/images/vector.jpg";
import Footer from "../components/Footer";
import AuthButtonWithProvider from "../components/AuthButtonWithProvider";
import useUser from "../hooks/useUser";
import MainSpinner from "../components/MainSpinner";

const Authentication = () => {
  const { data, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data, navigate]);

  if(isLoading){
    return <MainSpinner/>
  }

  return (
    <div className="auth-section">
      {/* Top section */}
      <img src={logo} alt="vector image" className="w-12 h-auto object-contain" />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* Main section */}
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-6 px-35">
        <h1 className="text-3xl lg:text-4xl text-blue-700">Welcome to Resume Boost</h1>
        <p className="text-base text-gray-600">Boost your Resume Fast</p>
        <h2 className="text-2xl text-gray-600 font-semibold">Authenticate</h2>
        <div className="w-full lg:w-96 rounded-md p-5 flex flex-col items-center justify-start gap-6">
          <AuthButtonWithProvider Icon={FaGoogle} Label={"Signin with Google"} Provider={"GoogleAuthProvider"} />
          <AuthButtonWithProvider Icon={FaGithub} Label={"Signin with GitHub"} Provider={"GithubAuthProvider"} />
        </div>
      </div>
      <br />
      <br />
      <br />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Authentication;
