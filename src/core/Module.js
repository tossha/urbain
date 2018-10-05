export default class Module
{
    constructor() {
        this._classes = {};
    }

    _addClass(alias, className) {
        this._classes[alias] = className;
    }

    getClass(alias) {
        if (this._classes[alias] === undefined) {
            throw new Error('Unknown module class: ' + alias);
        }
        return this._classes[alias];
    }

    init() {}
}
