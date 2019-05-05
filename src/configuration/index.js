export const config = {
    isProduction: process.env.NODE_ENV === "production",
    enableYandexMetrikaCounter: process.env.REACT_APP_ENABLE_YANDEX_METRIKA_COUNTER === "true",
    isFooterVisible: process.env.REACT_APP_IS_FOOTER_VISIBLE === "true",
    isUrbainDevToolsVisible: process.env.REACT_APP_SHOW_URBAIN_DEV_TOOLS === "true",
};
