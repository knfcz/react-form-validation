# react-form-validation

## Validation de formulaires

Dans ce repo se trouvent des fonctions à utiliser pour valider rapidement des formulaires avec react

> makeValidator({object} options) =>  {function} validate

> validate({object} validationRules, [{object} state, {function} setState]) => {boolean} formValid

Utilisez makeValidator() en lui filant vos options pour créer votre propre fonction de validation à utiliser dans vos formulaires

### Options du validateur

> getErrorMessage: function({string} errorName, {object} errorMessageParameters) => {string} errorMessage

Reçoit le nom et les paramètres d'une règle ayant échoué et renvoie un message d'erreur à afficher dans le formulaire

### Créer un validateur

Dans un fichier à part, dans votre projet, exportez la fonction renvoyée par makeValidator()

```js
// validate.js
import { makeValidator } from 'react-form-validation';

const options = {
    getErrorMessage: (errorName, errorMessageParameters) =>
        translate(`form.validation.errors.${errorName}`, errorMessageParameters),
};

export default makeValidator(options);
```


### Règles de validation

> required

Aucun argument, échoue si le champ est vide.

> lengthBetween(min, max)

Récupère une longueur min et max, rejette si la chaine est trop longue ou trop courte

> minLength(min)

Récupère une longueur min, rejette si la chaine est trop courte

> maxLength(max)

Récupère une longueur max, rejette si la chaine est trop longue

> match(regex, humanReadableFormat = '', errorName = 'match')

Récupère une regex et échoue si la chaine de caractère ne correspond pas

> validEmail

Échoue si la chaine de caractère n'est pas un email valide

> validPhoneNumber

Échoue si la chaine de caractère n'est pas un numéro de téléphone (fixe ou mobile) valide

> validMobilePhoneNumber

Échoue si la chaine de caractère n'est pas un numéro de téléphone mobile valide

> validLandlinePhoneNumber

Échoue si la chaine de caractère n'est pas un numéro de téléphone fixe valide

> validPostalCode

Échoue si la chaine de caractère n'est pas un code postal valide

> equals(targetValue, targetFieldName)

Échoue si la valeur est différente de "targetValue"

> numberBetween(min, max)

Échoue si le nombre n'est pas entre "min" et "max"

> numberAbove(min)

Échoue si le nombre est strictement inférieur à "min"

> numberBelow(max)

Échoue si le nombre est strictement supérieur à "max"

### Utilisation

Définissez les règles de validation de vos champs dans un objet, des règles prêtes à être utilisées sont dans react-form/rules.js

```js
// UserForm.js
import { rules } from 'react-form-validation';
...
const validationRules = {
    firstName: [rules.required, rules.lengthBetween(2, 20)],
    lastName: [rules.required, rules.lengthBetween(2, 20)],
    email: [
        rules.required(),

        // Vous pouvez passer des options supplémentaires
        // en déclarant votre règle dans un objet au format {rule, ...options}
         {
            rule: rules.isValidEmail,
            getErrorMessage: (errorName, errorMessage) => {
            // Si la regle isValidEmail() échoue, cette fonction sera utilisée pour générer le message d'erreur

            return "Message d'erreur personnalisé"
        }
    }]
};
...
```


Créez le state de votre formulaire en passant un objet contenant les valeurs par defaut de vos champs à createFormInitialState()

```js
// UserForm.js
import { createFormInitialState } from 'react-form-validation';

...
const [formState, setFormState] = useSetState(
    createFormInitialState({
        firstName: 'Michel',
        lastName: 'Smith',
        email: 'supermichel@hotmail.fr',
    })
);
...
```

Puis passez les valeurs et les messages d'erreur de vos champs à vos composants TextInput, etc...

```js
// UserForm.js
...
<TextInput
    value={formState.firstName.value}
    errorMessage={formState.firstName.error}
    ...
/>
...
```

Pour valider le formulaire, vous n'avez qu'a appeler votre fonction validate() crée plus haut,
si des champs sont invalides, les messages d'erreurs associés seront enregistrés dans le state et vos composants seront mis à jour

```js
// UserForm.js
import { getFormValues } from 'react-form-validation';
...
const onSubmit = async () => {
    if(!validate(validationRules, [formState, setFormState])) {
        // Formulaire invalide

        return;
    }

    // Formulaire bueno

    // Note: Pour récupérer les données du form dans un objet au format {nomChamp: valeurChamp},
    // passez le state de votre formulaire à getFormValues();
    await Http.post('https://michel3000.com/users/', getFormValues(formState))
}
...
```

### Créer de nouvelles règles de validation

Les règles de validation reçoivent une valeur à tester et renvoient un tableau au format [nomErreur, parametresMessageErreur],
si la valeur est valide, nomErreur devra être false et parametresMessageErreur pourra être omis

Note: Pensez à accepter une valeur vide comme valide, sinon les champs testés avec votre règle ne pourront être laissés vide

Exemple:

```js
export const minLength = min => val => {
   if(val !== '' && val.length < min) {
       return ['minLength', { min }];
   }

   return [false];
}

export const minLengthForUsername = minLength(2);
export const minLengthForEmail = minLength(6);
```

Note: Si votre règle doit récupérer d'autres arguments, renvoyer une [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) récupérant la valeur à tester en argument permettra aux autre de créer facilement des versions plus spécialisées de vos règles, et rendra la définition des règles de validation plus lisible

Example avec et sans closure

```js
// validation.js

// Cette fonction ne nécessite pas d'arguments autres que "val"
export const validEmail = val => {
   ...
};

// En revanche, celle ci a besoin d'un paramètre "min",
// nous pouvons soit la définir comme ceci, une fonction qui récupère deux arguments
export const minLength = (min, val) => {
    ...
};

// ou comme ceci, une fonction qui récupèrera la valeur "min", et qui renverra une fonction qui 
// récupèrera "val", avant d'executer notre logique de validation
export const curriedMinLength = min => val => {
    ...
};

// SomeForm.js

...

const validationRules = {
    email: [validEmail],
    label: [
        // Si nous souhaitons passer des arguments autres que la valeur à tester
        // à notre règle de validation, nous devrons créer une fonction intermédiaire
        // qui recevra la valeur et appelera notre règle en lui passant les arguments supplémentaires
        val => minLength(2, val),

        // Ce qui est équivalent à
        curriedMinLength(2),
    ]
};

...

```

### Conseils

Il peut être intéressant de créer votre propre fichier de validation dans votre projet,
afin d'y créer vos règles et de leur fournir éventuellement des arguments prédéfinis

```js
// src/utils/validation.js
import { rules as defaultRules } from 'react-form-validation';

export const rules = {
    ...defaultRules,

    // Vous pouvez facilement créer des règles de validation génériques
    validNameLength: defaultRules.lengthBetween(2, 20),
    validAge: defaultRules.numberBetween(12, 99),
    ...
};

...

// ChristianHipHopGroupAdmissionForm.js
import { rules } from 'utils/validation';

// Ici, aucune fonction n'est crée
const getValidationRules = formValues => ({
    age: [rules.required, rules.validAge],
    name: [rules.required, rules.validNameLength],
    parentName: [rules.requiredIf(formValues.age < 18), rules.validNameLength],
    ...
});

...
```

