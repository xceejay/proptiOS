const Security  = {
    secureUser: (userObj) => {
        // prop blacklist
        let {
            password,
            email_verification_code,
            ...sendToBrowser
         } = userObj;
        return sendToBrowser
    }
}

module.exports = {
    Security
}