import React from "react";

import Store from "./store";

export default React.createContext({
    stats: {},
    store: new Store(),
    updateStore() {},
    webApiServices: {
        satelliteFinder: {},
    },
});
