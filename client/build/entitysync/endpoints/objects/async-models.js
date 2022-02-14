import * as alt from 'alt-client';
import * as natives from 'natives';
class AsyncModel {
    loadingModels = new Set();
    loadedModels = new Map();
    cancel(hash) {
        this.loadingModels.delete(hash);
        this.removeLoadedModel(hash);
    }
    async load(hash) {
        return new Promise(resolve => {
            if (natives.hasModelLoaded(hash)) {
                return resolve(true);
            }
            this.loadingModels.add(hash);
            natives.requestModel(hash);
            const interval = alt.setInterval(() => {
                if (!this.loadingModels.has(hash)) {
                    return done(natives.hasModelLoaded(hash));
                }
                if (natives.hasModelLoaded(hash)) {
                    return done(true);
                }
            }, 25);
            const timeout = alt.setTimeout(() => {
                return done(natives.hasModelLoaded(hash));
            }, 3000);
            const done = result => {
                alt.clearInterval(interval);
                alt.clearTimeout(timeout);
                if (this.loadingModels.has(hash))
                    this.addLoadedModel(hash);
                this.loadingModels.delete(hash);
                return resolve(result);
            };
        });
    }
    addLoadedModel(hash) {
        let counter = 0;
        if (this.loadedModels.has(hash))
            counter = this.loadedModels.get(hash);
        this.loadedModels.set(hash, ++counter);
    }
    removeLoadedModel(hash) {
        if (!this.loadedModels.has(hash))
            natives.setModelAsNoLongerNeeded(hash);
        let count = this.loadedModels.get(hash);
        count--;
        if (count > 0) {
            this.loadedModels.set(hash, count);
            return;
        }
        natives.setModelAsNoLongerNeeded(hash);
        this.loadedModels.delete(hash);
    }
}
export const asyncModel = new AsyncModel();
