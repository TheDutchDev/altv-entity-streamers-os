import * as alt from 'alt-client';

import { IEntitySyncEndpoint } from "../../interfaces";
import { fillObjectPartially } from "../../../utils";
import { DynamicObject, IDynamicObject } from "./object";

export class EntitySyncObjectEndpoint implements IEntitySyncEndpoint
{
    private readonly entities : Map<number, IDynamicObject>;

    constructor( ) {
        this.entities = new Map();
    }

    onStreamIn( entityId: number, entityData: IDynamicObject ) {
        let entity = this.entities.get( entityId );

        if( entity ) {
            fillObjectPartially( entity, entityData );
        }
        else {
            entity = new DynamicObject( entityData );
        }

        entity.create( );
        this.entities.set( entityId, entity );
    }

    onStreamOut( entityId: number ) {
        if( !this.entities.has( entityId ) )
            return;

        const entity = this.entities.get( entityId );
        entity.destroy();
    }

    onUpdateData( entityId: number, data: IDynamicObject ) {
        if( !this.entities.has( entityId ) )
            return;

        let entity = this.entities.get( entityId );

        fillObjectPartially( entity, data );
        entity.update( );
    }

    onUpdatePosition( entityId: number, position: alt.Vector3 ) {
        if( !this.entities.has( entityId ) )
            return;

        const entity = this.entities.get( entityId );

        entity.position = position;
        entity.update( );
    }

    onRemove( entityId: number ) {
        if( !this.entities.has( entityId ) )
            return;

        this.entities.delete( entityId );
    }
}