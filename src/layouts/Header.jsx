import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { getProfile } from "src/services/user";

export default function Header() {

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const toggleProfileDropdown = () => {

        setIsProfileDropdownOpen(!isProfileDropdownOpen);

    };

    const handleLogout = () => {

        Cookies.remove('accessToken');
        queryClient.invalidateQueries(['profile']);
        navigate("/");

    }

    const { data: profileData } = useQuery( ["profile"], getProfile );

    return <header className="flex justify-between items-center border-b-2 border-gray-300 py-2.5 mb-5" > 

        <div className="flex items-center ps-4" >

            <Link to="/" > <img src="divar.svg" alt="divar" className="w-12 ml-10" /> </Link>

        </div>

        <div className="flex items-center space-x-4" >

            { profileData && (

                    <div className="relative">
                        <button onClick={toggleProfileDropdown}>
                            <span className="flex items-center cursor-pointer">
                                <img src="profile.svg" alt="profile" />
                            </span>
                        </button>
                        {isProfileDropdownOpen && (
                            <div className="absolute top-full left-0 bg-white shadow-md rounded-md mt-2 w-32 z-10">
                                <ul className="py-2">
                                    <li>
                                        <Link
                                            to={profileData?.data?.Role === "ADMIN" ? "/admin" : "/dashboard"}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
                                        >
                                            {profileData?.data?.Role === "ADMIN" ? "داشبورد ادمین" : "داشبورد"}
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm w-full text-start cursor-pointer"
                                        >
                                            خروج
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )
                
            }

                <Link to="/dashboard" className="bg-primary text-white h-10 w-20 rounded-md flex items-center justify-center text-center ml-10" > ثبت آگهی </Link>

        </div>

    </header>

}