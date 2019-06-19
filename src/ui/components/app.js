import React from "react";
import PropTypes from "prop-types";

import { config } from "../../configuration";
import { showWizard, wizardIds } from "../tutorials";
import Header from "./header";
import MainView from "./main-view";
import Footer from "./footer";
import "./common/app-layout.scss";

const IS_FOOTER_VISIBLE = config.isFooterVisible;

class App extends React.Component {
    static propTypes = {
        viewportId: PropTypes.string.isRequired,
    };

    componentDidMount() {
        showWizard({ wizardId: wizardIds.GETTING_STARTED_WIZARD });
    }

    render() {
        return (
            <>
                <Header className="app-layout__header" />
                <MainView className="app-layout__main" viewportId={this.props.viewportId} />
                {IS_FOOTER_VISIBLE && <Footer className="app-layout__footer" />}
            </>
        );
    }
}

export default App;
