import * as alt from 'alt-client';
export class EntitySyncFactory {
    endpoints;
    constructor() {
        this.endpoints = new Map();
    }
    registerEndpoint(entityType, endpoint) {
        if (this.endpoints.has(entityType))
            alt.logError(`[ERROR] EntitySyncFactory::registerEndpoint -> endpoint with type ${entityType} already exists, overwriting...`);
        this.endpoints.set(entityType, endpoint);
    }
    unregisterEndpoint(entityType) {
        this.endpoints.delete(entityType);
    }
    entityStreamIn(entityType, entityId, entityData) {
        if (!this.endpoints.has(entityType))
            return;
        const endpoint = this.endpoints.get(entityType);
        endpoint.onStreamIn(entityId, entityData);
    }
    entityStreamOut(entityType, entityId) {
        if (!this.endpoints.has(entityType))
            return;
        const endpoint = this.endpoints.get(entityType);
        endpoint.onStreamOut(entityId);
    }
    entityUpdatePosition(entityType, entityId, position) {
        if (!this.endpoints.has(entityType))
            return;
        const endpoint = this.endpoints.get(entityType);
        endpoint.onUpdatePosition(entityId, position);
    }
    entityUpdateData(entityType, entityId, data) {
        if (!this.endpoints.has(entityType))
            return;
        const endpoint = this.endpoints.get(entityType);
        endpoint.onUpdateData(entityId, data);
    }
    entityRemove(entityType, entityId) {
        if (!this.endpoints.has(entityType))
            return;
        const endpoint = this.endpoints.get(entityType);
        endpoint.onRemove(entityId);
    }
}
