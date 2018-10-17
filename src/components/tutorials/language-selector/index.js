import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import "./index.scss";

export function showLangSelectorDialog(langs) {
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
        render(
            <div className="language-selector-wrapper">
                <div className="language-selector">
                    {langs.map(({ id, description, buttonLabel }) => {
                        const handleNext = () => {
                            removeDialog();
                            resolve(id);
                        };

                        return (
                            <div key={id} className="language-selector__row">
                                <span className="language-selector__content">{description}</span>

                                <button className="language-selector__button" onClick={handleNext}>
                                    {buttonLabel}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>,
            rootNode,
        );
    });
}
