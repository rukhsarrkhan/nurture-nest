moment = require("moment");
const { ObjectId } = require("mongodb");
const phoneUtil = require("libphonenumbers").PhoneNumberUtil.getInstance();
const validatePhoneNumber = async (phoneNumber, fieldName) => {
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, "US");
    if (!phoneUtil.isValidNumber(number, "US")) throw { statusCode: 400, message: `${fieldName} is not a valid number` };
};
require("dotenv").config();

const isCityParentValid = async (city, fieldName) => {
    if (city.trim().length < 5) throw { statusCode: 400, message: `${fieldName} should atleast have 5 characters` };
    if (!/^[a-zA-Z ]+(?:[\s-][a-zA-Z]+)*$/.test(city)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isDistanceInputValid = async(distance,fieldName) => {
    if (distance < 0) throw { statusCode: 400, message: `${fieldName} should atleast have 5 characters` };
    if (!/^[0-9. ]+$/.test(distance)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
}


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
    return arr;
};

const isDateValid = async (str, fieldName) => {
    // if (new Date(str) == "Invalid Date" || isNaN(new Date(str)) || !moment(str, "MM/DD/YYYY", true).isValid())
    if (new Date(str) === "Invalid Date" || isNaN(new Date(str))) throw { statusCode: 400, message: `${fieldName} is an invalid date.` };
};

const isUserLoggedIn = async (req) => {
    if (req.session.user) return true;
    else return false;
};

const isSexValid = async (str) => {
    const validSexArr = ["male", "female", "non-binary", "transgender", "other"];
    if (!validSexArr.includes(str.toLowerCase())) {
        throw { statusCode: 400, message: `Invalid Gender` };
    }
};

const isNameValid = async (name, fieldName) => {
    if (name.trim().length < 3) throw { statusCode: 400, message: `${fieldName} should atleast have 3 characters` };
    if (!/^[a-zA-Z ,.'-]+$/.test(name)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isProfileValid = async (profile, fieldName) => {
    if (profile.trim() != "PARENT" && profile.trim() != "NANNY") throw { statusCode: 400, message: `${fieldName} should be either PARENT or NANNY` };
};

const isAgeValid = async (age, fieldName) => {
    if (isNaN(age)) {
        throw { statusCode: 400, message: `${fieldName} should be a number` };
    } else {
        if (age < 14) throw { statusCode: 400, message: `User must be 14 or older` };
    }
};

const isEmailValid = async (email) => {
    let emailConstraints = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$$/;
    if (!email.match(emailConstraints)) throw { statusCode: 400, message: `Email is invalid. Please enter a valid Email` };
};

const isUsernameValid = async (username) => {
    let usernameAlphaNumCheck = /^[A-Za-z0-9]+$/;
    if (!username.match(usernameAlphaNumCheck)) throw { statusCode: 400, message: `Username should be alpha-numeric` };
    else if (/\s/.test(username)) throw { statusCode: 400, message: `Username should not contain empty spaces` };
    else if (username.trim().length < 4) throw { statusCode: 400, message: `Username should hav e more than 4 characters` };
};

const isPasswordValid = async (password) => {
    let passwordCheck = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/;
    if (!password.match(passwordCheck))
        throw { statusCode: 400, message: `Password should have atleast 1 Uppercase letter, 1 number and 1 special character` };
    else if (/\s/.test(password)) throw { statusCode: 400, message: `Password should not contain empty spaces` };
    else if (password.trim().length < 6) throw { statusCode: 400, message: `Password should have more than 6 characters` };
};

const onlyNumbers = async (str, fieldName) => {
    let numberCheck = /^[0-9]*$/;
    if (!str.match(numberCheck)) throw { statusCode: 400, message: `${fieldName} should only be numbers` };
    // return /^[0-9]*$/.test(str);
};

const onlyLettersNumbersAndSpaces = async (str, fieldName) => {
    let numLetCheck = /^[a-zA-Z0-9 ]*$/;
    if (!str.match(numLetCheck)) throw { statusCode: 400, message: `${fieldName} should only be numbers and letters` };
    // return /^[a-zA-Z0-9 ]*$/.test(str);
};

const onlyLettersAndSpaces = async (str, fieldName) => {
    let letCheck = /^[a-zA-Z ]*$/;
    if (!str.match(letCheck)) throw { statusCode: 400, message: `${fieldName} should only be letters and spaces` };
    // return /^[a-zA-Z ]*$/.test(str);
};

const isIdValid = async (id, fieldName) => {
    if (!ObjectId.isValid(id)) throw { statusCode: 400, message: "invalid object id" };
    // return /^[a-zA-Z ]*$/.test(str);
};

const onlyLettersSpacesAndPunctuation = (str) => {
    return /^[a-zA-Z .,"'-]*$/.test(str);
};

const onlyNumbersAndSlashes = (str) => {
    return /^[0-9/]*$/.test(str);
};

const isSpecialcareParentValid = async (specialCare, fieldName) => {
    if (specialCare.trim().length < 2) throw { statusCode: 400, message: `${fieldName} should atleast have 2 characters` };
    if (!/^[a-zA-Z0-9 ,.'-:]+$/.test(specialCare)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isDescriptionParentValid = async (description, fieldName) => {
    if (description.trim().length < 25) throw { statusCode: 400, message: `${fieldName} should atleast have 25 characters` };
    if (description.trim().split(" ").length < 10) throw { statusCode: 400, message: `${fieldName} should atleast have 10 words` };
    if (!/^[a-zA-Z0-9 ,.'-:]+$/.test(description)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isAddressParentValid = async (address, fieldName) => {
    if (address.trim().length < 5) throw { statusCode: 400, message: `${fieldName} should atleast have 5 characters` };
    if (!/^[a-zA-Z0-9 ,.-]+$/.test(address)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isStateParentValid = async (state, fieldName) => {
    let allStates = [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
    ];
    if (state.trim().length < 4) throw { statusCode: 400, message: `${fieldName} should atleast have 4 characters` };
    if (!/^[a-zA-Z ]+$/.test(state)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
    if (!allStates.includes(state)) {
        throw { statusCode: 400, message: `${fieldName} contains a invalid state name selected` };
    }
};

const isZipCodeParentValid = async (zipCode, fieldName) => {
    if (zipCode.trim().length != 5) throw { statusCode: 400, message: `${fieldName} should have 5 characters` };
    if (!/^[0-9]+$/.test(zipCode)) throw { statusCode: 400, message: `${fieldName} contains invalid characters. Only numbers are allowed` };
};

const isSalaryParentValid = async (salary, fieldName) => {
    if (!/^[0-9,.]+$/.test(salary)) throw { statusCode: 400, message: `${fieldName} contains invalid characters.` };
    if (salary.trim() < 7.25) throw { statusCode: 400, message: `${fieldName} should legally be more than or equal to 7.25 USD per hour` };
};

const isTime1BeforeTime2 = async (time1, time2) => {
    if (new Date(time1) >= new Date(time2)) throw { statusCode: 400, message: `Shift-from time should be less than Shift-to time` };
};

const isShiftLimitValid = async (start, end, daysNum) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes * daysNum > 2400) {
        throw { statusCode: 400, message: `Shift times for a nanny cannot be more than 40hours per week` };
    }
    if (diffMinutes * daysNum < 120) {
        throw { statusCode: 400, message: `Shift times for a nanny cannot be less than 2 hours per week` };
    }
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
    isIdValid,
    isSexValid,
    isSpecialcareParentValid,
    isDescriptionParentValid,
    isAddressParentValid,
    isStateParentValid,
    isZipCodeParentValid,
    isSalaryParentValid,
    isTime1BeforeTime2,
    isShiftLimitValid,
    validatePhoneNumber,
    isCityParentValid,
    isDistanceInputValid
};
