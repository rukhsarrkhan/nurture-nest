//moment = require("moment");
// const { ObjectId } = require("mongodb");
const phoneUtil = require("libphonenumbers").PhoneNumberUtil.getInstance();
const validatePhoneNumber = async (phoneNumber, fieldName) => {
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, "US");
    if (!phoneUtil.isValidNumber(number, "US")) return { statusCode: 400, message: `${fieldName} is not a valid number` };
};

const validateInput = async (str, fieldName) => {
    if (str === undefined || str === null || str === "")
        return { statusCode: 400, message: `No parameter was passed in the ${fieldName} field of the function.` };
    if (typeof str !== "string") return { statusCode: 400, message: `${fieldName} is not a string.` };
};

const validateStringLength = async (str, fieldName) => {
    if (!(str.length > 0)) return { statusCode: 400, message: `${fieldName} is not a valid string.` };
};

const checkIfNum = async (str, fieldName) => {
    //NaN cannot handle '' string.. so ensure to handle empty string before
    if (isNaN(str)) return { statusCode: 400, message: `${fieldName} is not a number.` };
};

const execValdnAndTrim = async (str, fieldName) => {
    let val_res = await validateInput(str, fieldName);
    if (val_res && val_res.statusCode === 400) {
        return val_res;
    }
    str = str.trim();
    val_res = await validateStringLength(str, fieldName);
    if (val_res && val_res.statusCode === 400) {
        return val_res;
    }
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
    if (new Date(str) === "Invalid Date" || isNaN(new Date(str))) return { statusCode: 400, message: `${fieldName} is an invalid date.` };
};

const isUserLoggedIn = async (req) => {
    if (req.session.user) return true;
    else return false;
};

const isNameValid = async (name, fieldName) => {
    if (name.trim().length < 3) return { statusCode: 400, message: `${fieldName} should atleast have 3 characters` };
    if (!/^[a-zA-Z ,.'-]+$/.test(name)) return { statusCode: 400, message: `${fieldName} contains invalid characters` };
};
const isAddressValid = async (name, fieldName) => {
    if (name.trim().length < 3) return { statusCode: 400, message: `${fieldName} should atleast have 3 characters` };
};

const isProfileValid = async (profile, fieldName) => {
    if (profile.trim() !== "PARENT" && profile.trim() !== "NANNY")
        return { statusCode: 400, message: `${fieldName} should be either PARENT or NANNY` };
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

const onlyNumbers = async (str, fieldName) => {
    let numberCheck = /^[0-9]*$/;
    if (!str.match(numberCheck)) return { statusCode: 400, message: `${fieldName} should only be numbers` };
};

const onlyLettersNumbersAndSpaces = async (str, fieldName) => {
    let numLetCheck = /^[a-zA-Z0-9 ]*$/;
    if (!str.match(numLetCheck)) return { statusCode: 400, message: `${fieldName} should only be numbers and letters` };
};

const onlyLettersAndSpaces = async (str, fieldName) => {
    let letCheck = /^[a-zA-Z ]*$/;
    if (!str.match(letCheck)) return { statusCode: 400, message: `${fieldName} should only be letters and spaces` };
};

const isSpecialcareParentValid = async (specialCare, fieldName) => {
    if (specialCare.trim().length < 2) return { statusCode: 400, message: `${fieldName} should atleast have 2 characters` };
    if (!/^[a-zA-Z0-9 ,.'-:]+$/.test(specialCare)) return { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isDescriptionParentValid = async (description, fieldName) => {
    if (description.trim().length < 25) return { statusCode: 400, message: `${fieldName} should atleast have 25 characters` };
    if (description.trim().split(" ").length < 10) return { statusCode: 400, message: `${fieldName} should atleast have 10 words` };
    if (!/^[a-zA-Z0-9 ,.'-:]+$/.test(description)) return { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isAddressParentValid = async (address, fieldName) => {
    if (address.trim().length < 5) return { statusCode: 400, message: `${fieldName} should atleast have 5 characters` };
    if (!/^[a-zA-Z0-9 ,.-]+$/.test(address)) return { statusCode: 400, message: `${fieldName} contains invalid characters` };
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
    if (state.trim().length < 4) return { statusCode: 400, message: `${fieldName} should atleast have 4 characters` };
    if (!/^[a-zA-Z ]+$/.test(state)) return { statusCode: 400, message: `${fieldName} contains invalid characters` };
    if (!allStates.includes(state)) {
        return { statusCode: 400, message: `${fieldName} contains a invalid state name selected` };
    }
};

const isZipCodeParentValid = async (zipCode, fieldName) => {
    if (zipCode.trim().length !== 5) return { statusCode: 400, message: `${fieldName} should have 5 characters` };
    if (!/^[0-9]+$/.test(zipCode)) return { statusCode: 400, message: `${fieldName} contains invalid characters. Only numbers are allowed` };
};

const isSalaryParentValid = async (salary, fieldName) => {
    if (!/^[0-9,.]+$/.test(salary)) return { statusCode: 400, message: `${fieldName} contains invalid characters.` };
    if (salary.trim() < 7.25) return { statusCode: 400, message: `${fieldName} should legally be more than or equal to 7.25 USD per hour` };
};

const isTime1BeforeTime2 = async (time1, time2) => {
    if (new Date(time1) >= new Date(time2)) {
        return { statusCode: 400, message: `Shift-from time should be less than Shift-to time` };
    } else {
        return "";
    }
};

const isShiftLimitValid = async (start, end, daysNum) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes * daysNum > 2400) {
        return { statusCode: 400, message: `Shift times for a nanny cannot be more than 40hours per week` };
    }
    if (diffMinutes * daysNum < 120) {
        return { statusCode: 400, message: `Shift times for a nanny cannot be less than 2 hours per week` };
    }
    return "";
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
    isSpecialcareParentValid,
    isDescriptionParentValid,
    isAddressParentValid,
    isStateParentValid,
    isZipCodeParentValid,
    isSalaryParentValid,
    isTime1BeforeTime2,
    isShiftLimitValid,
    isAddressValid,
    validatePhoneNumber,
};
