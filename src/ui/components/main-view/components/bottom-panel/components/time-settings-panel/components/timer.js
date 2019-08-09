import React from "react";
import { inject } from "mobx-react";

const Timer = inject(({ timeSettingsPanelStore }) => ({
    formattedDate: timeSettingsPanelStore.formattedDate,
}))(({ formattedDate = "01.01.2000 12:00:00" }) => {
    return <time dateTime={formattedDate}>{formattedDate}</time>;
});

export default Timer;
