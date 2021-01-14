/**
 * Formate le state d'un formulaire en un objet au format {nomChamps: valeurChamp, ...}
 *
 * @param {object} formState     State crée avec createFormInitialState()
 *
 * @return {{}} Valeurs des champs du formulaire
 */
const getFormValues = formState =>
    Object.keys(formState).reduce((values, fieldName) => {
        values[fieldName] = formState[fieldName].value;

        return values;
    }, {});

module.exports = getFormValues;
