import React from "react";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core"
import { faExpand } from "@fortawesome/free-solid-svg-icons"
import { init } from "./main";

import AppComponent from "./components/app";

library.add(faExpand);

init();

ReactDOM.render(
    <AppComponent />,
    document.getElementById("root"),
);
