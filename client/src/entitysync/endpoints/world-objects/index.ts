import * as alt from 'alt-client';

import { IEntitySyncEndpoint } from "../../interfaces";
import { fillObjectPartially } from "../../../utils";
import { IWorldObject, WorldObject } from "./worldObject";

export class EntitySyncWorldObjectEndpoint implements IEntitySyncEndpoint
{
    private readonly entities : Map<number, IWorldObject>;

    constructor( ) {
        this.entities = new Map();
    }

    onStreamIn( entityId: number, entityData: IWorldObject ) {
        let entity = this.entities.get( entityId );

        if( entity ) {
            fillObjectPartially( entity, entityData );
        }
        else {
            entity = new WorldObject( entityData );
        }

        entity.streamIn( );
        this.entities.set( entityId, entity );
    }

    onStreamOut( entityId: number ) {
        if( !this.entities.has( entityId ) )
            return;

        const entity = this.entities.get( entityId );
        entity.streamOut();
    }

    onUpdateData( entityId: number, data: IWorldObject ) {
        if( !this.entities.has( entityId ) )
            return;

        let entity = this.entities.get( entityId );
        fillObjectPartially( entity, data );
    }

    onUpdatePosition( entityId: number, position: alt.Vector3 ) {
        if( !this.entities.has( entityId ) )
            return;

        const entity = this.entities.get( entityId );
        entity.position = position;
    }

    onRemove( entityId: number ) {
        if( !this.entities.has( entityId ) )
            return;

        this.entities.delete( entityId );
    }
}