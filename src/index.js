import React from "react";
import ReactDOM from "react-dom";

import { init } from "./main";

import AppComponent from "./components/app";

init();

ReactDOM.render(
    <AppComponent />,
    document.getElementById("root"),
);
