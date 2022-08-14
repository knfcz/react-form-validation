const { isPlainObject } = require('@knfcz/js-utils');
const { useState } = require('react');

const makeValidator = (options = {}) => {
    // Returns a custom form validation hook
    return (validationRules, formState) => {
        const fieldNames = Object.keys(validationRules);
        const [errors, setErrors] = useState(_initErrorsState(fieldNames));

        const validateForm = () => {
            const [isFormValid, formErrors] = fieldNames.reduce(
                ([formValid, formErrors], fieldName) => {
                    const errorMessages = _validateField(
                        validationRules[fieldName],
                        formState[fieldName],
                        options,
                    );

                    if (errorMessages.length) {
                        formValid = false;
                        formErrors[fieldName] = errorMessages[0];
                    } else {
                        formErrors[fieldName] = '';
                    }

                    return [formValid, formErrors];
                },
                [true, {}],
            );

            setErrors(formErrors);

            return isFormValid;
        };

        return {
            validateForm,
            formErrors: errors,
        };
    };
};

const _validateField = (rules, value, options) =>
    rules.reduce((errorMessages, ruleOrOptions) => {
        let applyRule;
        let getRuleErrorMessage;

        if (isPlainObject(ruleOrOptions)) {
            applyRule = ruleOrOptions.rule;
            getRuleErrorMessage = options.getErrorMessage;
        } else {
            applyRule = ruleOrOptions;
        }

        if (typeof applyRule !== 'function') {
            return errorMessages;
        }

        const error = applyRule(value);

        if (!error) {
            return errorMessages;
        }

        const [errorName, errorMessageParameters] = error;

        errorMessages.push(
            _getRuleErrorMessage(errorName, errorMessageParameters, {
                getRuleErrorMessage,
                getErrorMessage: options.getErrorMessage,
            }),
        );

        return errorMessages;
    }, []);

const _getRuleErrorMessage = (
    errorName,
    errorMessageParameters,
    { getRuleErrorMessage, getErrorMessage },
) => {
    if (typeof getRuleErrorMessage === 'function') {
        return getRuleErrorMessage(errorName, errorMessageParameters);
    }

    if (typeof getErrorMessage === 'function') {
        return getErrorMessage(errorName, errorMessageParameters);
    }

    return errorName;
};

const _initErrorsState = fieldNames =>
    fieldNames.reduce((errors, fieldName) => {
        errors[fieldName] = '';

        return errors;
    }, {});

module.exports = makeValidator;
