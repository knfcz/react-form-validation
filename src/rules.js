// eslint-disable-next-line no-control-regex
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const PHONE_REGEX = /^((\+)33|0)[1-9](\d{2}){4}$/;
const MOBILE_PHONE_REGEX = /^((\+)33|0)[6-7](\d{2}){4}$/;
const LANDLINE_PHONE_REGEX = /^((\+)33|0)[1-58-9](\d{2}){4}$/;
const POSTAL_CODE_REGEX = /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/;

const _canSkipValidation = val => val === '';

const required = (val = false) => {
    if (!val || val.toString().length === 0) {
        return ['required'];
    }

    return [false];
};

const requiredIf = bool => (bool ? required : null);

const lengthBetween = (min, max = 999) => (val = '') => {
    if (_canSkipValidation(val) || (val.length >= min && val.length <= max)) {
        return [false];
    }

    return ['lengthBetween', { min, max }];
};

const minLength = min => val => {
    if (_canSkipValidation(val) || val.length >= min) {
        return [false];
    }

    return ['minLength', { min }];
};

const maxLength = max => val => {
    if (_canSkipValidation(val) || val.length <= max) {
        return [false];
    }

    return ['maxLength', { max }];
};

const match = (regex, humanReadableFormat = '', errorName = 'match') => val => {
    if (_canSkipValidation(val) || regex.test(val)) {
        return [false];
    }

    return [errorName, { humanReadableFormat }];
};

const validEmail = match(EMAIL_REGEX, 'abc@example.com', 'validEmail');

const validPhoneNumber = match(PHONE_REGEX, '', 'validPhoneNumber');

const validMobilePhoneNumber = match(MOBILE_PHONE_REGEX, '', 'validMobilePhoneNumber');

const validLandlinePhoneNumber = match(LANDLINE_PHONE_REGEX, '', 'validLandlinePhoneNumber');

const validPostalCode = match(POSTAL_CODE_REGEX, '123456', 'validPostalCode');

const equals = (targetValue, targetFieldName) => val => {
    if (val === targetValue) {
        return [false];
    }

    return ['equals', { targetValue, targetFieldName }];
};

const numberBetween = (min, max) => val =>
    _canSkipValidation(val) || (val >= min && val <= max)
        ? [false]
        : ['numberBetween', { min, max }];

const numberBelow = max => val => {
    if (_canSkipValidation(val) || val < max) {
        return [false];
    }

    return ['numberBelow', { max }];
};

const numberAbove = min => val => {
    if (_canSkipValidation(val) || val > min) {
        return [false];
    }

    return ['numberAbove', { min }];
};

module.exports = {
    required,
    requiredIf,
    lengthBetween,
    minLength,
    maxLength,
    match,
    validPhoneNumber,
    validMobilePhoneNumber,
    validLandlinePhoneNumber,
    validEmail,
    validPostalCode,
    equals,
    numberBetween,
    numberBelow,
    numberAbove,
};
