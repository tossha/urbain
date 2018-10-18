import LocalStorageWatchStatusService from "../local-storage-watch-status-service";

class FakeStorage {
    constructor(rawData) {
        this._data = rawData;
    }

    getItem(key) {
        return JSON.stringify(this._data);
    }

    setItem(key, value) {
        this._data = JSON.parse(value);
    }

    __getRawData() {
        return this._data;
    }
}

function createService(storage) {
    return new LocalStorageWatchStatusService(storage);
}

describe("LocalStorageWatchStatusService", () => {
    it("canWatch should return true if wizard wasn't watched", () => {
        const wizardId = "id";
        const storage = new FakeStorage([]);
        const service = createService(storage);

        const result = service.canWatch(wizardId);

        expect(result).toBe(true);
    });

    it("canWatch should return false if wizard was watched", () => {
        const wizardId = "id";
        const storage = new FakeStorage([wizardId]);
        const service = createService(storage);

        const result = service.canWatch(wizardId);

        expect(result).toBe(false);
    });

    it("markAsWatched should add wizard id in storage", () => {
        const wizardId = "id";
        const storage = new FakeStorage([]);
        const service = createService(storage);

        service.markAsWatched(wizardId);

        expect(storage.__getRawData()).toEqual([wizardId]);
    });

    it("markAsWatched should not mark wizard as watched twice", () => {
        const wizardId = "id";
        const storage = new FakeStorage([wizardId]);
        const service = createService(storage);

        service.markAsWatched(wizardId);

        expect(storage.__getRawData()).toEqual([wizardId]);
    });
});
