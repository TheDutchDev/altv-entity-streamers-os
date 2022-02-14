import * as alt from 'alt-client';
import { EntitySyncFactory } from "./factory";
import { EndpointType } from "./enums/endpoints";
import { EntitySyncMarkerEndpoint } from "./endpoints/markers";
import { EntitySyncTextLabelEndpoint } from "./endpoints/textlabels";
import { EntitySyncObjectEndpoint } from "./endpoints/objects";
import { EntitySyncWorldObjectEndpoint } from "./endpoints/world-objects";

const entitySyncFactory = new EntitySyncFactory();
entitySyncFactory.registerEndpoint( EndpointType.Marker, new EntitySyncMarkerEndpoint() );
entitySyncFactory.registerEndpoint( EndpointType.TextLabel, new EntitySyncTextLabelEndpoint() );
entitySyncFactory.registerEndpoint( EndpointType.DynamicObject, new EntitySyncObjectEndpoint() );
entitySyncFactory.registerEndpoint( EndpointType.WorldObject, new EntitySyncWorldObjectEndpoint() );

// when an object is streamed in
alt.onServer( "entitySync:create", ( entityId: number, entityType: number, position: alt.Vector3, currEntityData: any ) => {
    entitySyncFactory.entityStreamIn( entityType, entityId, { ...currEntityData, position } );
} );

// when an object is streamed out
alt.onServer( "entitySync:remove", ( entityId: number, entityType: number ) => {
    entitySyncFactory.entityStreamOut( entityType, entityId );
} );

// when a streamed in object changes position data
alt.onServer( "entitySync:updatePosition", ( entityId: number, entityType: number, position: alt.Vector3 ) => {
    entitySyncFactory.entityUpdatePosition( entityType, entityId, position );
} );

// when a streamed in object changes data
alt.onServer( "entitySync:updateData", ( entityId: number, entityType: number, newEntityData: any ) => {
    entitySyncFactory.entityUpdateData( entityType, entityId, newEntityData );
} );

// when a streamed in object needs to be removed
alt.onServer( "entitySync:clearCache", ( entityId: number, entityType: number ) => {
    entitySyncFactory.entityRemove( entityType, entityId );
} );
