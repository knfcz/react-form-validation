const isPlainObject = require('js-utils/isPlainObject');
const deepMerge = require('js-utils/deepMerge');

/**
 * Applique les regles de validations aux valeurs des champs du formulaire, et ajoute les message d'erreur corres
 *
 * @param options   Objet de config pour le validator, peut contenir:
 *                  - getErrorMessage: (func) Récupère le nom de la regle ayant échoué, et ses arguments,
 *                                     et doit renvoyer le message d'erreur correspondant
 *
 * @return {function(*=, [*, *]): {}}
 */
const makeValidator = (options = {}) => (fieldsValidationRules, [formState, setFormState]) => {
    const [isFormValid, newFormState] = Object.keys(fieldsValidationRules).reduce(
        ([formValid, newFormState], fieldName) => {
            if(!isPlainObject(newFormState[fieldName])) {
                throw new Error(`Field "${fieldName}" has some validation rules but is not set in the form state.`);
            }

            const errorMessages = _validateField(
                fieldsValidationRules[fieldName],
                newFormState[fieldName].value,
                options,
            );

            if (errorMessages.length) {
                formValid = false;
                newFormState[fieldName].error = errorMessages[0];
            } else {
                newFormState[fieldName].error = '';
            }

            return [formValid, newFormState];
        },
        [true, deepMerge({}, formState)],
    );

    setFormState(newFormState);

    return isFormValid;
};

/**
 * Teste chaques règles de validation pour la valeur donnée,
 * et renvoie les messages d'erreurs des regles ayant échouées
 *
 * @params rules                            Tableau de fonctions ou d'objet au format { rule: $function, ...options }
 * @params {string|number|boolean} value    Valeur à tester
 * @param {object} options                  Options de traduction du message d'erreur
 * @param options.getErrorMessage           Renvoie un message d'erreur à afficher dans le champs
 *
 * @return {array}  Message d'erreurs des règles ayant échouées
 */
const _validateField = (rules, value, options) =>
    rules.reduce((errorMessages, ruleOrOptions) => {
        let applyRule;
        let getRuleErrorMessage;

        if (isPlainObject(ruleOrOptions)) {
            ({ rule: applyRule, getErrorMessage: getRuleErrorMessage } = ruleOrOptions);
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

/**
 * Renvoie un message d'erreur traduit en fonction d'un code erreur
 *
 * Si une fonction de traduction est spécifiée pour la règle, elle sera utilisée,
 * sinon, celle passée dans les options du validateur, si aucune erreur n'est définie, le code erreur sera renvoyé
 *
 * @param errorName                      Nom de la règle ayant échoué
 * @param errorMessageParameters         Variables à utiliser dans les messages d'erreurs
 * @param options.getRuleErrorMessage    Fonction de traduction passé dans les paramètres de la regle de validation
 * @param options.getErrorMessage        Fonction de traduction passé dans les paramètres du validateur
 *
 * @return {string}
 */
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

module.exports = makeValidator;
