/**
 * @param {string} moduleName
 * @return {string}
 */
function createClassName(moduleName) {
    return "Module" + moduleName;
}

/**
 * @param {string} moduleName
 * @return {string}
 */
function getModuleFullPath(moduleName) {
    const className = createClassName(moduleName);

    return moduleName + "/" + className;
}

class ModuleManager {
    constructor() {
        this.modules = [];
    }

    /**
     * @param {string} moduleName
     * @param callback
     * @return {Promise}
     */
    async loadModule(moduleName, callback) {
        console.log(getModuleFullPath(moduleName));
        const module = await import(`./${getModuleFullPath(moduleName)}`);

        this.modules[moduleName] = new module.default();
        this.modules[moduleName].init();

        if (callback) {
            callback(this.modules[moduleName]);
        }
    }

    /**
     * @param {string} moduleName
     * @return {*}
     */
    getModule(moduleName) {
        if (this.modules[moduleName] === undefined) {
            throw new Error("Unknown module: " + moduleName);
        }

        return this.modules[moduleName];
    }

    /**
     * @param {string} moduleName
     * @return {boolean}
     */
    isModuleLoaded(moduleName) {
        return this.modules[moduleName] !== undefined;
    }
}

export default ModuleManager;
