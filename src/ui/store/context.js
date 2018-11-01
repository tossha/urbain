import React from "react";

export function createContext(defaultValue) {
    const { Provider, Consumer } = React.createContext(defaultValue);

    return {
        Provider,
        Consumer,
    };
}
