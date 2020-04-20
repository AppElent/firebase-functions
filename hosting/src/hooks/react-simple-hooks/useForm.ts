import { useState, useEffect, useCallback } from 'react';
import validate from 'validate.js';
import * as _ from 'lodash';

type TypeFormOptions = {
  localStorage?: any;
};

const get = (key: string, storage = window.localStorage): any => {
  const item = storage.getItem(key);
  // Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : undefined;
};

const set = (key: string, value: any, storage = window.localStorage): void => {
  // Allow value to be a function so we have same API as useState
  const valueToStore = value instanceof Function ? value(value) : value;
  // Save to local storage
  storage.setItem(key, JSON.stringify(valueToStore));
};

function useForm(stateSchema: any, validationSchema: {} = {}, callback: Function, options: TypeFormOptions = {}): any {
  const formatStateSchema = (schema: any): any => {
    const newSchema: any = {};
    const keys = Object.keys(schema);
    for (const key of keys) {
      newSchema[key] = {
        value: schema[key],
        error: '',
        touched: false,
      };
    }
    return newSchema;
  };

  const formatStateDate = (data: any): any => {
    const newSchema: any = {};
    const keys = Object.keys(data);
    for (const key of keys) {
      newSchema[key] = data[key].value;
    }
    return newSchema;
  };

  const [state, setState] = useState(formatStateSchema(stateSchema));

  // Used to disable submit button if there's an error in state
  // or the required field in state has no value.
  // Wrapped in useCallback to cached the function to avoid intensive memory leaked
  // in every re-render in component
  const validateState = useCallback(() => {
    if (_.isEmpty(validationSchema)) {
      return true;
    }
    const stateKeys = Object.keys(state);
    const validationState: any = {};
    for (const key of stateKeys) {
      validationState[key] = state[key].value;
    }
    const errors = validate(validationState, validationSchema);

    if (!errors) return true;
    return false;
  }, [state, validationSchema]);

  useEffect(() => {
    if (options.localStorage) {
      const lsdata = get(options.localStorage);
      if (lsdata) setState(formatStateSchema(lsdata));
    }
  }, []);

  const [hasError, setHasError] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Disable button in initial render.
  /*
  useEffect(() => {
    setHasError(true);
  }, []);
  */

  // For every changed in our state this will be fired
  // To be able to disable the button
  useEffect(() => {
    if (isDirty) {
      setHasError(!validateState());
    }
  }, [state, isDirty]);

  // Used to handle every changes in every input
  const handleOnChange = useCallback(
    event => {
      if (isDirty === false) setIsDirty(true);
      const name = event.target.name;
      let value = event.target.value;
      if (event.target.type === 'number') {
        value = parseInt(event.target.value);
      } else if (event.target.type === 'checkbox') {
        value = event.target.checked;
      }

      let error = '';
      const validateErrors = validate({ [name]: value }, validationSchema);
      if (validateErrors) {
        error = validateErrors[name];
      }
      if (options.localStorage) set(options.localStorage, formatStateDate({ ...state, [name]: { value } }));
      setState((prevState: any): void => ({
        ...prevState,
        [name]: { value, error, touched: true },
      }));
    },
    [validationSchema],
  );

  const handleOnValueChange = useCallback(
    name => (value: any): void => {
      if (isDirty === false) setIsDirty(true);

      let error = '';
      const validateErrors = validate({ [name]: value }, validationSchema);
      if (validateErrors) {
        error = validateErrors[name];
      }
      console.log(999, error, name, value);
      if (options.localStorage) set(options.localStorage, formatStateDate({ ...state, [name]: { value } }));
      setState((prevState: any) => ({
        ...prevState,
        [name]: { value, error, touched: true },
      }));
    },
    [validationSchema],
  );

  const setFormValue = useCallback(
    object => {
      if (isDirty === false) setIsDirty(true);
      let savedNewState = { ...state };
      let error = '';
      for (const name of Object.keys(object)) {
        const value = object[name];
        const validateErrors = validate({ [name]: value }, validationSchema);
        if (validateErrors) {
          error = validateErrors[name];
        }
        console.log(999, error, name, value);
        savedNewState = { ...savedNewState, [name]: { value } };
        if (options.localStorage) set(options.localStorage, formatStateDate(savedNewState));
        setState((prevState: any) => ({
          ...prevState,
          [name]: { value, error, touched: true },
        }));
      }
    },
    [validationSchema],
  );

  //Used to handle submit (with state showing submitting (true||false))
  const handleOnSubmit = useCallback(
    async event => {
      if (event) event.preventDefault();

      // Make sure that validateState returns true
      // Before calling the submit callback function
      if (validateState()) {
        setSubmitting(true);
        await callback(state);
        setSubmitting(false);
      }
    },
    [state],
  );

  //Function to set initial state after submitting
  const setInitial = useCallback(() => {
    setState(stateSchema);
  }, []);

  return {
    hasError,
    isDirty,
    state,
    handleOnChange,
    handleOnValueChange,
    setFormValue,
    handleOnSubmit,
    submitting,
    setInitial,
  };
}

export default useForm;
