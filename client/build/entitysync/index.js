import * as alt from 'alt-client';
import { EntitySyncFactory } from "./factory";
import { EndpointType } from "./enums/endpoints";
import { EntitySyncMarkerEndpoint } from "./endpoints/markers";
import { EntitySyncTextLabelEndpoint } from "./endpoints/textlabels";
import { EntitySyncObjectEndpoint } from "./endpoints/objects";
import { EntitySyncWorldObjectEndpoint } from "./endpoints/world-objects";
const entitySyncFactory = new EntitySyncFactory();
entitySyncFactory.registerEndpoint(EndpointType.Marker, new EntitySyncMarkerEndpoint());
entitySyncFactory.registerEndpoint(EndpointType.TextLabel, new EntitySyncTextLabelEndpoint());
entitySyncFactory.registerEndpoint(EndpointType.DynamicObject, new EntitySyncObjectEndpoint());
entitySyncFactory.registerEndpoint(EndpointType.WorldObject, new EntitySyncWorldObjectEndpoint());
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
    entitySyncFactory.entityStreamIn(entityType, entityId, { ...currEntityData, position });
});
alt.onServer("entitySync:remove", (entityId, entityType) => {
    entitySyncFactory.entityStreamOut(entityType, entityId);
});
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    entitySyncFactory.entityUpdatePosition(entityType, entityId, position);
});
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    entitySyncFactory.entityUpdateData(entityType, entityId, newEntityData);
});
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    entitySyncFactory.entityRemove(entityType, entityId);
});
