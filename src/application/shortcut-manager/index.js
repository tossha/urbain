class ShortcutManager {
    register({ key, handler, isCtrl = false }) {
        window.addEventListener("keydown", e => {
            if (e.key !== key) {
                return;
            }

            if (isCtrl === true && e.ctrlKey === false) {
                return;
            }

            handler();
        });
    }
}

export default ShortcutManager;
