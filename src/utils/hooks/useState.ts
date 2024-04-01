const useState = <T>(defaultValue: T) => {
    let value = defaultValue;

    const getValue = () => value;
    const setValue = (newValue: T) => {
        value = newValue;
    };

    return [getValue, setValue];
};

export default useState;
