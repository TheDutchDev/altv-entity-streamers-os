import * as alt from 'alt-client';

import { IEntitySyncEndpoint } from "./interfaces";

export class EntitySyncFactory {
    private endpoints : Map<number, IEntitySyncEndpoint>;

    constructor( ) {
        this.endpoints = new Map();
    }

    registerEndpoint( entityType : number, endpoint : IEntitySyncEndpoint ) {
        if( this.endpoints.has( entityType ) )
            alt.logError( `[ERROR] EntitySyncFactory::registerEndpoint -> endpoint with type ${ entityType } already exists, overwriting...` );

        this.endpoints.set( entityType, endpoint );
    }

    unregisterEndpoint( entityType : number ) {
        this.endpoints.delete( entityType );
    }

    entityStreamIn( entityType : number, entityId : number, entityData : any ) {
        if( !this.endpoints.has( entityType ) )
            return;

        const endpoint = this.endpoints.get( entityType );
        endpoint.onStreamIn( entityId, entityData );
    }

    entityStreamOut( entityType : number, entityId : number ) {
        if( !this.endpoints.has( entityType ) )
            return;

        const endpoint = this.endpoints.get( entityType );
        endpoint.onStreamOut( entityId );
    }

    entityUpdatePosition( entityType : number, entityId : number, position : alt.Vector3 ) {
        if( !this.endpoints.has( entityType ) )
            return;

        const endpoint = this.endpoints.get( entityType );
        endpoint.onUpdatePosition( entityId, position );
    }

    entityUpdateData( entityType : number, entityId : number, data : any ) {
        if( !this.endpoints.has( entityType ) )
            return;

        const endpoint = this.endpoints.get( entityType );
        endpoint.onUpdateData( entityId, data );
    }

    entityRemove( entityType : number, entityId : number ) {
        if( !this.endpoints.has( entityType ) )
            return;

        const endpoint = this.endpoints.get( entityType );
        endpoint.onRemove( entityId );
    }
}