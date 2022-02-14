import * as alt from 'alt-client';

export interface IEntitySyncEndpoint {
    onStreamIn( entityId : number, entityData : any );
    onStreamOut( entityId : number );
    onUpdatePosition( entityId : number, position : alt.Vector3 );
    onUpdateData( entityId : number, data : any );
    onRemove( entityId : number );
}