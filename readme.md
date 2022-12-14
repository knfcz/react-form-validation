# react-form-validation

[![npm version](https://img.shields.io/npm/v/@knfcz/react-form-validation.svg?style=flat)](https://www.npmjs.com/package/@knfcz/react-form-validation)

The main goal of this package is to quickly setup basic form validation in your React projects

Features:

    - A form validation hook
    - An easily extendable set of validation rules
    - A quick way to generate validation error message to show to your end-user

However, this lib does not include any React component, so you'll have to use yours

Table of content:

-   [Installing](#installing)
-   [Setup](#setup)
-   [Usage](#usage)
-   [Available validation rules](#available-validation-rules)
-   [Creating your own validation rules](#creating-your-own-validation-rules)
-   [Some tips](#some-tips)

## Installing

Install it with:

> npm install @knfcz/react-form-validation

or

> yarn add @knfcz/react-form-validation

## Setup

Create a **useFormValidation.js** file in your project and initialize your custom hook

```js
// hooks/useFormValidation.js
import { makeValidator } from '@knfcz/react-form-validation';
import translate from '../utils/translate'; // <- Some custom translation function

export default makeValidator({
    // This function will be called to generate validation error messages 
    // that will be displayed to the end-user
    getErrorMessage: (ruleName, errorMessageParameters) =>
        translate(
            `form.validationError.${ruleName}`,
            errorMessageParameters,
        ),
});
```

There is currently one available option :angel:

| Option                  | Type/Signature                                               |                                                                  |
|-------------------------|--------------------------------------------------------------|------------------------------------------------------------------|
| options.getErrorMessage | (ruleName: string, errorMessageParameters: object) => string | Must return a validation error message to show to your end-users |


Note: if you use [@knfcz/translator](https://www.npmjs.com/package/@knfcz/translator), you can find some translation examples in the /translation-examples folder in this repo :^)

## Usage

In your form component, create a validationRules object and specify your validation rules

Example:

```js
// src/components/user/UserForm.jsx
import { rules } from '@knfcz/react-form-validation';

const validationRules = {
    firstName: [rules.required, rules.lengthBetween(2, 20)],
    lastName: [rules.required, rules.lengthBetween(2, 20)],
    email: [
        rules.required,
        // You can pass additional options by giving an object {rule, ...options}
        {
            rule: rules.isValidEmail,
            // Here you can specify another translation function
            getErrorMessage: (errorName, errorMessageParameters) => {
                // If the email is invalid, this function will be used to generate the error message
                return 'bruh';
            },
        },
    ],
};

// ...
```

Next, initialize your form state and use your custom validation hook:

```jsx
// components/user/UserForm.jsx
import useFormValidation from '../../hooks/useFormValidation';

const validationRules = {
    /* ... */
};

const UserForm = props => {
    // 1 - Create your form state
    const [formValues, setFormValues] = useState({
        firstName: 'Michel',
        lastName: 'Smith',
        email: 'supermichel@hotmail.com',
    });

    // 2 - Use the hook to get the validation function and the current form errors
    const { formErrors, validateForm } = useFormValidation(
        validationRules,
        formValues,
    );

    // 3 - Call validateForm in your form submit handler
    const onSubmit = async event => {
        event.preventDefault();

        // Calling validateForm will update the form errors and return a boolean
        if (!validateForm()) {
            // Form validation failed
            return;
        }

        // Form validation succeeded, yay
    };

    // 4 - Finally, pass the values/errors/onChange callback to your inputs
    return (
        <form onSubmit={onSubmit}>
            <Input
                value={formValues.firstName}
                errorMessage={formErrors.firstName}
                onChange={firstName =>
                    setFormValues({ ...formValues, firstName })
                }
            />

            <Input
                value={formValues.lastName}
                errorMessage={formErrors.lastName}
                onChange={lastName =>
                    setFormValues({ ...formValues, lastName })
                }
            />

            <Input
                value={formValues.email}
                errorMessage={formErrors.email}
                onChange={email => setFormValues({ ...formValues, email })}
            />
        </form>
    );
};
```

## Available validation rules

| Rule                                                        | Description                                             |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| required                                                    | Fails if the value is empty                             |
| lengthBetween(min, max)                                     | Fails if the value is too long/short                    |
| minLength(min)                                              | Fails if the value is too short                         |
| maxLength(max)                                              | Fails if the value is too long                          |
| match(regex, humanReadableFormat = '', errorName = 'match') | Fails if the values doesn't match the given regex       |
| validEmail                                                  | Fails if the value is not a valid email                 |
| validPhoneNumber                                            | Fails if the value is not a valid phone number          |
| validMobilePhoneNumber                                      | Fails if the value is not a valid mobile phone number   |
| validLandlinePhoneNumber                                    | Fails if the value is not a valid landline phone number |
| validPostalCode                                             | Fails if the value is not a valid postal code           |
| equals(targetValue, targetFieldName)                        | Fails if the value is different from targetValue        |
| numberBetween(min, max)                                     | Fails if the value is not between min and max           |
| numberAbove(min)                                            | Fails if the value is less or equal to min              |
| numberBelow(max)                                            | Fails if the value is greater or equal to max           |

## Creating your own validation rules

Validation rules always get a value as a param and should return:

-   If the value is valid: false
-   If invalid: A tuple containing the error name and parameters (if any)

```js
const atLeast6CharactersLong = value => {
    // You shoud always validate the value if it's empty, otherwise that will make the input required
    if (value === '') {
        return false;
    }

    if (value.length >= 6) {
        return false;
    }

    return ['atLeast6CharactersLong'];
};
```

If you want to pass additional parameters to your validation rule, just wrap it in a higher order function

```js
const minLength = min => value => {
    if (value === '' || value.length >= min) {
        return false;
    }

    return ['minLength', { min }];
};

// By using this method, you can easily make more specialized validation rules
const isValidArticleTitle = minLength(6);
```

These rules can be used like this

```js
// src/components/kitten/ArticleForm.jsx

const validationRules = {
    title: [atLeast6CharactersLong],
    // or
    title: [minLength(6)],
    // or
    title: [isValidArticleTitle],
};
```

## Some tips

One nice way to manage your validation rules is to centralize them somewhere in your project

```js
// hooks/useFormValidation.js
import {
    makeValidator,
    rules as defaultRules,
} from '@knfcz/react-form-validation';

// ...

export const rules = {
    ...defaultRules,
    // User rules
    isValidFirstName: defaultRules.minLength(2),
    isValidLastName: defaultRules.minLength(2),
    isAgeValid: defaultRules.numberBetween(18, 99),

    // Article rules
    isValidArticleTitle: defaultRules.lengthBetween(6, 80),
    // ...
};
```
