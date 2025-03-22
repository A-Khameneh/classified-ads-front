const setCookie = tokens => {

    document.cookie = ` accessToken = ${ tokens.accessToken }; SameSite=Lax; max-age = ${ 30 * 24 * 60 * 60 } `;
    //document.cookie = ` refreshToken = ${ tokens.refreshToken }; SameSite=Lax; max-age = ${ 90 * 24 * 60 * 60 } `;

}

// const setCookie = tokens => {

//     const setCookieValue = (name, value, days) => {
//       const date = new Date();
//       date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//       const expires = "expires=" + date.toUTCString();
//       document.cookie = `${name}=${value}; ${expires}; SameSite=Lax; path=/`;
//     };
  
//     setCookieValue("accessToken", tokens.accessToken, 1);
//     setCookieValue("refreshToken", tokens.refreshToken, 30);

// };

const getCookie = cookieName => {

    return document.cookie.split(";").find( token => token.trim().split("=")[0] === cookieName )?.split("=")[1];

}

export { setCookie, getCookie };