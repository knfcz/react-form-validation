/**
 * Renvoie un objet à utiliser comme state d'un formulaire
 *
 * @param defaultValues     objet au format {nomChamp: valeurParDefaut, nomChamp2: valeurParDefaut2}
 *
 * @return {{}}
 */
const createFormInitialState = (defaultValues = {}) =>
    Object.keys(defaultValues).reduce((initialState, fieldName) => {
        initialState[fieldName] = {
            value: defaultValues[fieldName],
            error: '',
        };

        return initialState;
    }, {});

module.exports = createFormInitialState;
