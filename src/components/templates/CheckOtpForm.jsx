import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { checkOtp } from "services/auth";
import { getProfile } from "services/user";
import { setCookie } from "utils/cookie";

export default function CheckOtpForm({ code, setCode, setStep, phone }) {

    const { refetch } = useQuery( ["profile"], getProfile );

    const navigate = useNavigate();

    const submitHandler = async (e) => {

        e.preventDefault();
        if ( code.length !== 5 ) return;

        const { res, err } = await checkOtp( phone, code )
        if ( res ) {

            setCookie( res.data );
            navigate("/");
            refetch();

        }

        if ( err ) {

            console.log(err.response.data.message);

        }

    }

    return (

        <form onSubmit={ submitHandler } className="max-w-md mx-auto flex flex-col mt-[100px] border border-gray-300 rounded-md p-7.5" > 

            <p className="text-xl font-normal mb-5" > تایید کد پیامکی </p> 
            <span className="text-gray-500 text-sm mb-5" > کد پیامک شده به شماره { phone } را وارد کنید. </span> 

            <label htmlFor="input" className="block text-sm mb-2.5" > کد تایید را وارد کنید. </label> 
            <input type="text" id="input" placeholder="کد تایید" value={ code } onChange={ e => setCode( e.target.value ) } className="block mx-0 my-2.5 p-1.5 border border-solid border-gray-300 rounded-md outline-none" /> 

            <button type="submit" className="w-[70px] px-2.5 py-1.5 border-none bg-primary text-white rounded-md cursor-pointer" > ورود </button> 
            <button onClick={ () => setStep(1) } className="bg-white text-primary border border-primary w-[150px] mt-7.5" > تغییر شماره موبایل </button> 

        </form>

    )

}