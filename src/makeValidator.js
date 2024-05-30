const { isPlainObject } = require('@knfcz/js-utils');
const { useState } = require('react');

const makeValidator =
    (options = {}) =>
    (validationRules, formState) => {
        const fieldNames = Object.keys(validationRules);
        const [errors, setErrors] = useState(_getInitialErrorState(fieldNames));

        const validateForm = () => {
            const [isFormValid, formErrors] = fieldNames.reduce(
                ([isFormValid, formErrors], fieldName) => {
                    const errorMessage = _getFieldError(
                        validationRules[fieldName],
                        formState[fieldName],
                        options,
                    );

                    if (errorMessage === false) {
                        formErrors[fieldName] = '';
                    } else {
                        isFormValid = false;
                        formErrors[fieldName] = errorMessage;
                    }

                    return [isFormValid, formErrors];
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

const _getFieldError = (rules, value, options) => {
    for (const ruleOrOptions of rules) {
        let applyRule;
        let getRuleErrorMessage;

        if (isPlainObject(ruleOrOptions)) {
            applyRule = ruleOrOptions.rule;
            getRuleErrorMessage = ruleOrOptions.getErrorMessage;
        } else {
            applyRule = ruleOrOptions;
        }

        if (typeof applyRule !== 'function') {
            continue;
        }

        const error = applyRule(value);

        if (!error) {
            continue;
        }

        const [ruleName, errorMessageParameters] = error;

        return _getValidationErrorMessage(ruleName, errorMessageParameters, {
            getRuleErrorMessage,
            getErrorMessage: options.getErrorMessage,
        });
    }

    return false;
};

const _getValidationErrorMessage = (
    ruleName,
    errorMessageParameters,
    { getRuleErrorMessage, getErrorMessage },
) => {
    if (typeof getRuleErrorMessage === 'function') {
        return getRuleErrorMessage(ruleName, errorMessageParameters);
    }

    if (typeof getErrorMessage === 'function') {
        return getErrorMessage(ruleName, errorMessageParameters);
    }

    return ruleName;
};

const _getInitialErrorState = fieldNames =>
    fieldNames.reduce((errors, fieldName) => {
        errors[fieldName] = '';

        return errors;
    }, {});

module.exports = makeValidator;
