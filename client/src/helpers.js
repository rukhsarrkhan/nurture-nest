//moment = require("moment");
// const { ObjectId } = require("mongodb");

const validateInput = async (str, fieldName) => {
    if (str === undefined || str === null || str === "")
        return { statusCode: 400, message: `No parameter was passed in the ${fieldName} field of the function.` };
    if (typeof str != "string") return { statusCode: 400, message: `${fieldName} is not a string.` };
};

const validateStringLength = async (str, fieldName) => {
    if (!(str.length > 0)) return { statusCode: 400, message: `${fieldName} is not a valid string.` };
};

const checkIfNum = async (str, fieldName) => {
    //NaN cannot handle '' string.. so ensure to handle empty string before
    if (isNaN(str)) return { statusCode: 400, message: `${fieldName} is not a number.` };
};

const execValdnAndTrim = async (str, fieldName) => {
    await validateInput(str, fieldName);
    str = str.trim();
    await validateStringLength(str, fieldName);
    return str;
};

const execValdnForArr = async (arr, fieldName) => {
    if (arr === undefined || arr === null || arr === "")
        return { statusCode: 400, message: `No parameter was passed in the ${fieldName} field of the function` };
    if (!Array.isArray(arr)) return { statusCode: 400, message: `${fieldName} must be an array.` };
    if (!arr.length > 0) return { statusCode: 400, message: `Length of ${fieldName} must be more than 0.` };
};

const isDateValid = async (str, fieldName) => {
    // if (new Date(str) == "Invalid Date" || isNaN(new Date(str)) || !moment(str, "MM/DD/YYYY", true).isValid())
    if (new Date(str) === "Invalid Date" || isNaN(new Date(str)))
        return { statusCode: 400, message: `${fieldName} is an invalid date.` };
};

const isUserLoggedIn = async (req) => {
    if (req.session.user) return true;
    else return false;
};

const isNameValid = async (name, fieldName) => {
    if (name.trim().length < 3) return { statusCode: 400, message: `${fieldName} should atleast have 3 characters` };
    if (!/^[a-zA-Z ,.'-]+$/.test(name)) return { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isProfileValid = async (profile, fieldName) => {
    if (profile.trim() !== "PARENT" && profile.trim() !== "NANNY" ) return { statusCode: 400, message: `${fieldName} should be either PARENT or NANNY` };
};

const isAgeValid = async (age, fieldName) => {
    if (isNaN(age)) {
        return { statusCode: 400, message: `${fieldName} should be a number` };
    } else {
        if (age < 14) return { statusCode: 400, message: `User must be 14 or older` };
    }
};

const isEmailValid = async (email) => {
    let emailConstraints = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$$/;
    if (!email.match(emailConstraints)) return { statusCode: 400, message: `Email is invalid. Please enter a valid Email` };
};

const isUsernameValid = async (username) => {
    let usernameAlphaNumCheck = /^[A-Za-z0-9]+$/;
    if (!username.match(usernameAlphaNumCheck)) return { statusCode: 400, message: `Username should be alpha-numeric` };
    else if (/\s/.test(username)) return { statusCode: 400, message: `Username should not contain empty spaces` };
    else if (username.trim().length < 4) return { statusCode: 400, message: `Username should have more than 4 characters` };
};

const isPasswordValid = async (password) => {
    let passwordCheck = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/;
    if (!password.match(passwordCheck))
        return { statusCode: 400, message: `Password should have atleast 1 Uppercase letter, 1 number and 1 special character` };
    else if (/\s/.test(password)) return { statusCode: 400, message: `Password should not contain empty spaces` };
    else if (password.trim().length < 6) return { statusCode: 400, message: `Password should have more than 6 characters` };
};

const onlyNumbers = (str, fieldName) => {
   let numberCheck = /^[0-9]*$/
   if(!str.match(numberCheck)) 
   return {statusCode : 400, message:  `${fieldName} should only be numbers`}
};

const onlyLettersNumbersAndSpaces = (str,fieldName) => {
    let numLetCheck = /^[a-zA-Z0-9 ]*$/ 
    if(!str.match(numLetCheck))
    return {statusCode : 400, message:  `${fieldName} should only be numbers and letters`}
};

const onlyLettersAndSpaces = (str,fieldName) => {
    let letCheck = /^[a-zA-Z ]*$/
    if(!str.match(letCheck))
    return {statusCode : 400, message:  `${fieldName} should only be letters and spaces`}
};

// const isIdValid = (id,fieldName) => {
//     if(!ObjectId.isValid(id))
//     return {statusCode : 400, message: 'invalid object id'}
//     // return /^[a-zA-Z ]*$/.test(str);
// };

module.exports = {
    description: "This is the helper function",
    validateInput,
    execValdnAndTrim,
    validateStringLength,
    checkIfNum,
    execValdnForArr,
    isDateValid,
    isUserLoggedIn,
    isNameValid,
    isProfileValid,
    isAgeValid,
    isEmailValid,
    isUsernameValid,
    isPasswordValid,
    onlyNumbers,
    onlyLettersNumbersAndSpaces,
    onlyLettersAndSpaces,
    // isIdValid
};
