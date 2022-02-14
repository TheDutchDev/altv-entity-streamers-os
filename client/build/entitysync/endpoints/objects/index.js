import { fillObjectPartially } from "../../../utils";
import { DynamicObject } from "./object";
export class EntitySyncObjectEndpoint {
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
            entity = new DynamicObject(entityData);
        }
        entity.create();
        this.entities.set(entityId, entity);
    }
    onStreamOut(entityId) {
        if (!this.entities.has(entityId))
            return;
        const entity = this.entities.get(entityId);
        entity.destroy();
    }
    onUpdateData(entityId, data) {
        if (!this.entities.has(entityId))
            return;
        let entity = this.entities.get(entityId);
        fillObjectPartially(entity, data);
        entity.update();
    }
    onUpdatePosition(entityId, position) {
        if (!this.entities.has(entityId))
            return;
        const entity = this.entities.get(entityId);
        entity.position = position;
        entity.update();
    }
    onRemove(entityId) {
        if (!this.entities.has(entityId))
            return;
        this.entities.delete(entityId);
    }
}
