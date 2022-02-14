import * as alt from 'alt-client';
import { fillObjectPartially } from "../../../utils";
import { Marker } from "./marker";
export class EntitySyncMarkerEndpoint {
    tick;
    entities;
    constructor() {
        this.tick = null;
        this.entities = new Map();
    }
    onStreamIn(entityId, entityData) {
        let entity = this.entities.get(entityId);
        if (entity) {
            fillObjectPartially(entity, entityData);
        }
        else {
            entity = new Marker(entityData);
        }
        entity.streamed = true;
        this.entities.set(entityId, entity);
        if (this.tick === null)
            this.startTick();
    }
    onStreamOut(entityId) {
        if (!this.entities.has(entityId))
            return;
        const entity = this.entities.get(entityId);
        entity.streamed = false;
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
    startTick() {
        if (this.tick !== null)
            return;
        this.tick = alt.everyTick(() => {
            let count = 0;
            for (const [, entity] of this.entities) {
                if (entity.streamed) {
                    entity.draw();
                    count++;
                }
            }
            if (count === 0)
                this.clearTick();
        });
    }
    clearTick() {
        if (this.tick === null)
            return;
        alt.clearEveryTick(this.tick);
        this.tick = null;
    }
}
