import { useState } from "react"

import CheckOtpForm from "components/templates/CheckOtpForm";
import SendOtpForm from "components/templates/SendOtpForm";


export default function AuthPage() {

    const [ step, setStep ] = useState(1);
    const [ phone, setPhone ] = useState("");
    const [ code, setCode ] = useState("");

    return (

        <div>

            { step === 1 && <SendOtpForm setStep={ setStep } phone = { phone } setPhone = { setPhone } /> }
            { step === 2 && <CheckOtpForm code={ code } setCode={ setCode } phone={ phone } setStep={ setStep } /> }

        </div>

    )

}