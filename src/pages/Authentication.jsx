// eslint-disable-next-line no-unused-vars
import React from 'react';
import logo from "../assets/images/vector.jpg";
import Footer from '../components/Footer';  // Corrected the typo in the path
import AuthButtonWithProvider from '../components/AuthButtonWithProvider';
import {FaGoogle,FaGithub} from "react-icons/fa6"
const Authentication = () => {
  return (
    <div className='auth-section'>
      {/* Top section */}
      <img src={logo} alt="vector image" className='w-12 h-auto object-contain' />
<br /><br /><br /><br /><br />
      {/* Main section */}
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-6 px-35">

<h1 className='text-3xl lg:text-4xl text-blue-700'>Welcome to Resume Boost</h1>
<p className='text-base text-gray-600'>Boost your Resume Fast</p>
<h2 className='text-2xl text-gray-600 font-semibold'>Authenticate</h2>
      <div>

      </div>
      <div className='w-full lg:w-96 rounded-md p-5 flex flex-col items-center justify-start gap-6'>


      </div>
      
      <AuthButtonWithProvider Icon={FaGoogle} 
      Label={"Signin with Google"} 
      Provider={"GoogleAuthProvider"}/>

      <AuthButtonWithProvider Icon={FaGithub} 
      Label={"Signin with GitHub"} 
      Provider={"GithubAuthProvider"}/>

      
      
      
      </div>
<br /><br />
<br />


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Authentication;
