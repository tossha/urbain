import React from "react";
import { shallow } from "enzyme";
import PauseButton from "../pause-button";

describe("<PauseButton />", () => {
    function createButton(isPaused = false) {
        return shallow(<PauseButton isPaused={isPaused} onTogglePause={jest.fn()} />);
    }

    it("should have 'noselect' class", () => {
        const wrapper = createButton();

        expect(wrapper.hasClass("noselect")).toEqual(true);
    });

    it("should have .pause-button--paused class when prop isPaused is present", () => {
        const wrapper = createButton(true);

        expect(wrapper.hasClass("pause-button--paused")).toEqual(true);
    });

    it("shouldn't have .pause-button--paused class when prop isPaused isn't exist", () => {
        const wrapper = createButton(false);

        expect(wrapper.hasClass("pause-button--paused")).toEqual(false);
    });
});
