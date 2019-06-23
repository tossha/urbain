import React, { Suspense } from "react";

import { config } from "../../configuration";
import { showWizard, wizardIds } from "../tutorials";
import Header from "./header";
import MainView from "./main-view";
import "./common/app-layout.scss";

const IS_FOOTER_VISIBLE = config.isFooterVisible;
const Footer = React.lazy(() => import("./footer"));

class App extends React.Component {
    componentDidMount() {
        showWizard({ wizardId: wizardIds.GETTING_STARTED_WIZARD });
    }

    render() {
        return (
            <>
                <Header className="app-layout__header" />
                <MainView className="app-layout__main" />
                {IS_FOOTER_VISIBLE && (
                    <Suspense fallback={<div />}>
                        <Footer className="app-layout__footer" />
                    </Suspense>
                )}
            </>
        );
    }
}

export default App;
