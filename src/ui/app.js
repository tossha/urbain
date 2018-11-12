import React from "react";

import { showWizard, wizardIds } from "./components/tutorials/index";
import Header from "./components/header/header";
import MainView from "./components/main-view/main-view";
import Footer from "./components/footer/footer";
import "./components/common/app-layout.scss";

class App extends React.Component {
    componentDidMount() {
        showWizard(wizardIds.GETTING_STARTED_WIZARD);
    }

    render() {
        return (
            <>
                <Header className="app-layout__header" />
                <MainView className="app-layout__main" />
                <Footer className="app-layout__footer" />
            </>
        );
    }
}

export default App;
