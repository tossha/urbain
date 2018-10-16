import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import "./index.scss";

export function showDialog(idRus, idEng) {
    let rootNode = document.createElement("div");
    document.body.appendChild(rootNode);

    const removeDialog = () => {
        if (rootNode) {
            unmountComponentAtNode(rootNode);
            rootNode.parentNode.removeChild(rootNode);
            rootNode = null;
        }
    };

    return new Promise(resolve => {
        const handleNextRus = () => {
            removeDialog();
            resolve(idRus);
        };

        const handleNextEng = () => {
            removeDialog();
            resolve(idEng);
        };

        render(
            <div className="language-selector-wrapper">
                <div className="language-selector">
                    <div className="language-selector__column">
                        <div className="language-selector__content">Привет!</div>

                        <button className="language-selector__button" onClick={handleNextRus}>
                            Далее
                        </button>
                    </div>
                    <div className="language-selector__column">
                        <div className="language-selector__content">Hello!</div>

                        <button className="language-selector__button" onClick={handleNextEng}>
                            Next
                        </button>
                    </div>
                </div>
            </div>,
            rootNode,
        );
    });
}
