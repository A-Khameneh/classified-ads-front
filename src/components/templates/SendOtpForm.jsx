import { sendOtp } from "services/auth";

export default function SendOtpForm({ phone, setPhone, setStep }) {

    const submitHandler = async event => {

        event.preventDefault();
        if ( phone.length !== 11 ) return;

        const { res, err } = await sendOtp( phone );

        if ( res ) setStep(2);

        if ( err ) console.log( err.response.data.message );

    }

    return (

        <form onSubmit={ submitHandler } className="max-w-md mx-auto flex flex-col mt-[100px] border border-gray-300 rounded-md p-7.5" > 

            <p className="text-xl font-normal mb-5" > ورود به حساب کاربری </p> 

            <span className="text-gray-500 text-sm mb-5" > برای استفاده از امکانات دیوار ، لطفا شماره موبایل خود را وارد کنید. کد تایید به این شماره پیامک می شود. </span> 

            <label htmlFor="input" className="block text-sm mb-2.5" > شماره موبایل خود را وارد کنید. </label> 
            <input type="text" id="input" placeholder="شماره موبایل" value={ phone } onChange={ e => setPhone( e.target.value ) } className="block mx-0 my-2.5 p-1.5 border border-solid border-gray-300 rounded-md outline-none" /> 

            <button type="submit" className="w-[110px] px-2.5 py-1.5 border-none bg-primary text-white rounded-md cursor-pointer" > ارسال کد تایید </button> 

        </form>

    )

}