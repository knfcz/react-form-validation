const curry = require('js-utils/curry');

const _getFieldValue = (state, fieldName) => state[fieldName].value;
const _getFieldError = (state, fieldName) => state[fieldName].error;
const _setFieldValue = ([state, setState]) => curry((fieldName, value) =>
    setState({
        [fieldName]: {
            ...state.fieldName,
            value: value,
        },
    }));


const getFieldAccessors = (state, setState) => ({
    getFieldValue: _getFieldValue,
    getFieldError: _getFieldError,
    setFieldValue: _setFieldValue([state, setState]),
});

module.exports = getFieldAccessors;
