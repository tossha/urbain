class LocalStorageWatchStatusService {
    static KEY = "urbain-watched-wizards";

    constructor(storage) {
        this._storage = storage;
    }

    canWatch(wizardId) {
        return !this._getWatchedWizards().some(id => id === wizardId);
    }

    _getWatchedWizards() {
        const wizardIdsRawString = this._storage.getItem(LocalStorageWatchStatusService.KEY);

        if (!wizardIdsRawString) {
            return [];
        }

        return JSON.parse(wizardIdsRawString);
    }

    _saveStatuses(wizardIds) {
        this._storage.setItem(LocalStorageWatchStatusService.KEY, JSON.stringify(wizardIds));
    }
}

export default LocalStorageWatchStatusService;
