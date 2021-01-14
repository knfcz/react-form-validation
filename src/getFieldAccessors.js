const { curry, isPlainObject } = require('js-utils');

const _getFieldValue = state => fieldName => {
    if(!isPlainObject(state[fieldName])) {
        return undefined;
    }

    return state[fieldName].value;
};
const _getFieldError = state => fieldName => state[fieldName].error;
const _setFieldValue = ([state, setState]) => curry((fieldName, value) =>
    setState({
        [fieldName]: {
            ...state.fieldName,
            value: value,
        },
    }));


const getFieldAccessors = (state, setState) => ({
    getFieldValue: _getFieldValue(state),
    getFieldError: _getFieldError(state),
    setFieldValue: _setFieldValue([state, setState]),
});

module.exports = getFieldAccessors;
