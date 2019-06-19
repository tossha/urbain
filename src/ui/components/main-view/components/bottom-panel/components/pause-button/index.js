import { inject } from "mobx-react";
import PauseButton from "./pause-button";

export default inject(({ timeStore }) => ({
    isPaused: timeStore.currentTimeState.isPaused,
    onTogglePause: () => {
        timeStore.currentTimeState.togglePause();
    },
}))(PauseButton);
