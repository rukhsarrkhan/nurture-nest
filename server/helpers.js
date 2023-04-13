//moment = require("moment");
const { ObjectId } = require("mongodb");

const validateInput = async (str, fieldName) => {
    if (str === undefined || str === null || str === "")
        throw { statusCode: 400, message: `No parameter was passed in the ${fieldName} field of the function.` };
    if (typeof str != "string") throw { statusCode: 400, message: `${fieldName} is not a string.` };
};

const validateStringLength = async (str, fieldName) => {
    if (!(str.length > 0)) throw { statusCode: 400, message: `${fieldName} is not a valid string.` };
};

const checkIfNum = async (str, fieldName) => {
    //NaN cannot handle '' string.. so ensure to handle empty string before
    if (isNaN(str)) throw { statusCode: 400, message: `${fieldName} is not a number.` };
};

const execValdnAndTrim = async (str, fieldName) => {
    await validateInput(str, fieldName);
    str = str.trim();
    await validateStringLength(str, fieldName);
    return str;
};

const execValdnForArr = async (arr, fieldName) => {
    if (arr === undefined || arr === null || arr === "")
        throw { statusCode: 400, message: `No parameter was passed in the ${fieldName} field of the function` };
    if (!Array.isArray(arr)) throw { statusCode: 400, message: `${fieldName} must be an array.` };
    if (!arr.length > 0) throw { statusCode: 400, message: `Length of ${fieldName} must be more than 0.` };
};

const isDateValid = async (str, fieldName) => {
    if (new Date(str) == "Invalid Date" || isNaN(new Date(str)) || !moment(str, "MM/DD/YYYY", true).isValid())
        throw { statusCode: 400, message: `${fieldName} is an invalid date.` };
};

const isUserLoggedIn = async (req) => {
    if (req.session.user) return true;
    else return false;
};

const isNameValid = async (name, fieldName) => {
    if (name.trim().length < 3) throw { statusCode: 400, message: `${fieldName} should atleast have 3 characters` };
    if (!/^[a-zA-Z ,.'-]+$/.test(name)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isProfileValid = async (profile, fieldName) => {
    if (profile.trim() != "PARENT" && profile.trim() != "NANNY" ) throw { statusCode: 400, message: `${fieldName} should be either PARENT or NANNY` };
};

const isAgeValid = async (age, fieldName) => {
    if (isNaN(age)) {
        throw { statusCode: 400, message: `${fieldName} should be a number` };
    } else {
        if (age < 14) throw { statusCode: 400, message: `User must be 14 or older` };
    }
};

const isEmailValid = async (email) => {
    let emailConstraints = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
    if (!email.match(emailConstraints)) throw { statusCode: 400, message: `Email is invalid. Please enter a valid Email` };
};

const isUsernameValid = async (username) => {
    let usernameAlphaNumCheck = /^[A-Za-z0-9]+$/;
    if (!username.match(usernameAlphaNumCheck)) throw { statusCode: 400, message: `Username should be alpha-numeric` };
    else if (/\s/.test(username)) throw { statusCode: 400, message: `Username should not contain empty spaces` };
    else if (username.trim().length < 4) throw { statusCode: 400, message: `Username should have more than 4 characters` };
};

const isPasswordValid = async (password) => {
    let passwordCheck = /^(?=.[A-Z])(?=.\d)(?=.[#$@!%&?])[A-Za-z\d#$@!%&*?-]{6,}$/;
    if (!password.match(passwordCheck))
        throw { statusCode: 400, message: `Password should have atleast 1 Uppercase letter, 1 number and 1 special character` };
    else if (/\s/.test(password)) throw { statusCode: 400, message: `Password should not contain empty spaces` };
    else if (password.trim().length < 6) throw { statusCode: 400, message: `Password should have more than 6 characters` };
};

const onlyNumbers = (str, fieldName) => {
   let numberCheck = /^[0-9]*$/
   if(!str.match(numberCheck)) 
   throw {statusCode : 400, message:  `${fieldName} should only be numbers`}
    // return /^[0-9]*$/.test(str);
};

const onlyLettersNumbersAndSpaces = (str,fieldName) => {
    let numLetCheck = /^[a-zA-Z0-9 ]*$/ 
    if(!str.match(numLetCheck))
    throw {statusCode : 400, message:  `${fieldName} should only be numbers and letters`}
    // return /^[a-zA-Z0-9 ]*$/.test(str);
};

const onlyLettersAndSpaces = (str,fieldName) => {
    let letCheck = /^[a-zA-Z ]*$/
    if(!str.match(letCheck))
    throw {statusCode : 400, message:  `${fieldName} should only be letters and spaces`}
    // return /^[a-zA-Z ]*$/.test(str);
};

const isIdValid = (id,fieldName) => {
    if(!ObjectId.isValid(id))
    throw {statusCode : 400, message: 'invalid object id'}
    // return /^[a-zA-Z ]*$/.test(str);
};

const onlyLettersSpacesAndPunctuation = (str) => {
    return /^[a-zA-Z .,"'-]*$/.test(str);
};

const onlyNumbersAndSlashes = (str) => {
    return /^[0-9/]*$/.test(str);
};

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
    isIdValid
};
