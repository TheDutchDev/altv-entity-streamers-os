import { fillObjectPartially } from "../../../utils";
import { WorldObject } from "./worldObject";
export class EntitySyncWorldObjectEndpoint {
    entities;
    constructor() {
        this.entities = new Map();
    }
    onStreamIn(entityId, entityData) {
        let entity = this.entities.get(entityId);
        if (entity) {
            fillObjectPartially(entity, entityData);
        }
        else {
            entity = new WorldObject(entityData);
        }
        entity.streamIn();
        this.entities.set(entityId, entity);
    }
    onStreamOut(entityId) {
        if (!this.entities.has(entityId))
            return;
        const entity = this.entities.get(entityId);
        entity.streamOut();
    }
    onUpdateData(entityId, data) {
        if (!this.entities.has(entityId))
            return;
        let entity = this.entities.get(entityId);
        fillObjectPartially(entity, data);
    }
    onUpdatePosition(entityId, position) {
        if (!this.entities.has(entityId))
            return;
        const entity = this.entities.get(entityId);
        entity.position = position;
    }
    onRemove(entityId) {
        if (!this.entities.has(entityId))
            return;
        this.entities.delete(entityId);
    }
}
