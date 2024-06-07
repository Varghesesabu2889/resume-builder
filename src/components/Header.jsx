import React, { useState } from "react";
import useUser from "../hooks/useUser";
import vector from "../assets/images/vector.jpg"; // Corrected import for image
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { HiLogout } from "react-icons/hi";
import { FadeInOutWithOpacity } from "../animation";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminIds } from "../utils/helpers";
import useFilters from "../hooks/useFilters";

const Header = () => {
  const { data, isLoading } = useUser();
  const { data: filterData } = useFilters();

  const [isMenu, setIsMenu] = useState(false);

  const queryClient = useQueryClient();

  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  const handleSearchTerm = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: e.target.value,
    });
  };

const clearFilter =()=>{
  queryClient.setQueryData("globalFilter", {
    ...queryClient.getQueryData("globalFilter"),
    searchTerm: "",
  });
}



  return (
    <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0">
      {/* logo */}
      <Link to="/">
        <img src={vector} alt="vector image" className="w-8 h-auto object-contain" />
      </Link>

      {/* input */}
      <div className="flex-1 border border-gray-300 px-4 py-1 rounded-b-md flex items-center justify-between bg-gray-200">
        <input
          type="text"
          placeholder="Search here..."
          value={filterData?.searchTerm || ""}
          onChange={handleSearchTerm}
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
        />
        <AnimatePresence>
          {filterData?.searchTerm?.length > 0 && (
            <motion.div 
            onClick={clearFilter}
            {...FadeInOutWithOpacity} className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150">
              <p className="text-2xl text-black">X</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* profile section */}
      <AnimatePresence>
        {isLoading ? (
          <ClipLoader color="#498FCD" size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div {...FadeInOutWithOpacity} className="relative" onClick={() => setIsMenu(!isMenu)}>
                {data.photoURL ? (
                  <div className="w-12 h-12 rounded-full relative flex items-center justify-center cursor-pointer">
                    <img
                      src={data.photoURL}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                    <p className="text-lg text-white">{data.email[0]}</p>
                  </div>
                )}
                {/* dropdown menu */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      {...FadeInOutWithOpacity}
                      className="absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                      onMouseLeave={() => setIsMenu(false)}
                    >
                      {data.photoURL ? (
                        <div className="w-20 h-20 rounded-full relative flex-col items-center justify-center cursor-pointer">
                          <img
                            src={data.photoURL}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                          <p className="text-3xl text-white">{data?.email[0]}</p>
                        </div>
                      )}
                      {data?.displayName && <p className="text-lg text-txtDark">{data?.displayName}</p>}
                      {/* menus */}
                      <div className="w-full flex-col items-start flex gap-8 pt-6">
                        <Link className="text-txtLight hover:text-txtDark text-base whitespace-nowrap" to={"/profile"}>
                          My Account
                        </Link>
                        {adminIds.includes(data?.uid) && (
                          <Link className="text-txtLight hover:text-txtDark text-base whitespace-nowrap" to={"/template/create"}>
                            Add New Template
                          </Link>
                        )}

                        <div className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group">
                          <p className="group-hover:text-txtDark text-txtLight cursor-pointer" onClick={signOutUser}>
                            Sign Out
                          </p>
                          <HiLogout
                            className="group-hover:text-txtDark text-txtLight cursor-pointer"
                            onClick={signOutUser}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to="/auth">
                <motion.button
                  className="px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150"
                  type="button"
                  {...FadeInOutWithOpacity}
                >
                  Login
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
