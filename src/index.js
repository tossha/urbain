import React from "react";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core"
import { faExpand, faPlay, faPause } from "@fortawesome/free-solid-svg-icons"
import { init } from "./main";

import AppComponent from "./components/app";

library.add(faExpand);
library.add(faPlay);
library.add(faPause);

init();

ReactDOM.render(
    <AppComponent />,
    document.getElementById("root"),
);
