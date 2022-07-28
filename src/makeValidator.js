const { isPlainObject } = require('@knfcz/js-utils');
const { useState } = require('react');

const makeValidator = (options = {}) => {
    // Retourne un hook gérant la validation et les messages d'erreurs
    return (validationRules, formState) => {
        const fieldNames = Object.keys(validationRules);
        const [errors, setErrors] = useState(initErrorsState(fieldNames));

        // On crée la fonction de validation de formulaire
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
            ({ rule: applyRule, getErrorMessage: getRuleErrorMessage } =
                ruleOrOptions);
        } else {
            applyRule = ruleOrOptions;
        }

        if (typeof applyRule !== 'function') {
            return errorMessages;
        }

        const [errorName, errorMessageParameters] = applyRule(value);

        if (!errorName) {
            return errorMessages;
        }

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
    let errorMessage = errorName;

    if (typeof getRuleErrorMessage === 'function') {
        errorMessage = getRuleErrorMessage(errorName, errorMessageParameters);
    } else if (typeof getErrorMessage === 'function') {
        errorMessage = getErrorMessage(errorName, errorMessageParameters);
    }

    return errorMessage;
};

const initErrorsState = fieldNames =>
    fieldNames.reduce((errors, fieldName) => {
        errors[fieldName] = '';

        return errors;
    }, {});

module.exports = makeValidator;
