// eslint-disable-next-line no-unused-vars
import React from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import { auth } from '../config/firebase.config'
import { GithubAuthProvider, GoogleAuthProvider, signInWithRedirect,  } from 'firebase/auth'

// eslint-disable-next-line react/prop-types
const AuthButtonWithProvider = ({ Icon, Label, Provider }) => {
   const googleAuthProvider = new GoogleAuthProvider() 
   const githubAuthProvider = new GithubAuthProvider() 

    
    const handleClick= async ()=>{
        switch(Provider){
            case 'GoogleAuthProvider':
              await signInWithRedirect(auth,googleAuthProvider)
              .then((result)=>{
                console.log(result)
              })
              .catch((err)=>{
                console.log(`Error:${err.Message}`)
              })
                break;
            case 'GithubAuthProvider':
                await signInWithRedirect(auth,githubAuthProvider)
              .then((result)=>{
                console.log(result)
              })
              .catch((err)=>{
                console.log(`Error:${err.Message}`)
              })
                break;
                default:
                    await signInWithRedirect(auth,googleAuthProvider)
                    .then((result)=>{
                      console.log(result)
                    })
                    .catch((err)=>{
                      console.log(`Error:${err.Message}`)
                    })
                    break;

        }
    }







return <div onClick={handleClick} className='w-25 px-4 py-3 rounded-md border-2 border-blue-700 flex items-center
 justify-between cursor-pointer group hover:bg-blue-700 
active:scale-95 duration-150 hover:shadow-md' > 
    <Icon className="text-txtPrimary text-xl group-hover:text-white"/> 
    <p className="text-txtPrimary text-lg group-hover:text-white ml-10">{Label}</p>
    <FaChevronRight className="text-txtPrimary text-xl group-hover:text-white ml-10"/>
</div>
}

export default AuthButtonWithProvider