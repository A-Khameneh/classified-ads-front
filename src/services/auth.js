import api from "configs/api";

const sendOtp = async ( phone ) => {

    try {

        const res = await api.post( "auth/sendOtp", { phone } )
        return { res };
        
    } catch (err) {

        return { err };
        
    }

}

const checkOtp = async ( phone, code ) => {

    try {

        const res = await api.post( "auth/checkOtp", { phone, code } )
        return { res }
        
    } catch (err) {

        return { err }
        
    }

}

export { sendOtp, checkOtp };