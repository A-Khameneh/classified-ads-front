import api from "configs/api";

const sendOtp = async ( mobile ) => {

    try {

        const res = await api.post( "auth/sendOtp", { mobile } )
        return { res };
        
    } catch (err) {

        return { err };
        
    }

}

const checkOtp = async ( mobile, code ) => {

    try {

        const res = await api.post( "auth/checkOtp", { mobile, code } )
        return { res }
        
    } catch (err) {

        return { err }
        
    }

}

export { sendOtp, checkOtp };