import React from "react";

import "./common/global.css";
import "./common/app-layout.css";
import Header from "./header/header";
import MainView from "./main-view/main-view";
import Footer from "./footer/footer";

class App extends React.Component {
    render() {
        return (
            <div className="app-layout">
                <MainView className="app-layout__main">
                    <Header className="app-layout__header" />
                </MainView>
                <Footer className="app-layout__footer" />
            </div>
        );
    }
}

export default App;
