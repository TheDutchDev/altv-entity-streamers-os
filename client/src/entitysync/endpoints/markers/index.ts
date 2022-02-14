import * as alt from 'alt-client';
import * as natives from 'natives';

import { IEntitySyncEndpoint } from "../../interfaces";
import { fillObjectPartially } from "../../../utils";
import { IMarker, Marker } from "./marker";

export class EntitySyncMarkerEndpoint implements IEntitySyncEndpoint
{
    private tick : any;
    private readonly entities : Map<number, Marker>;

    constructor( ) {
        this.tick = null;
        this.entities = new Map();
    }

    onStreamIn( entityId: number, entityData: IMarker ) {
        let entity = this.entities.get( entityId );

        if( entity ) {
            fillObjectPartially( entity, entityData );
        }
        else {
            entity = new Marker( entityData );
        }

        entity.streamed = true;
        this.entities.set( entityId, entity );

        if( this.tick === null )
            this.startTick( );
    }

    onStreamOut( entityId: number ) {
        if( !this.entities.has( entityId ) )
            return;

        const entity = this.entities.get( entityId );
        entity.streamed = false;
    }

    onUpdateData( entityId: number, data: IMarker ) {
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

    private startTick( ) {
        if( this.tick !== null )
            return;

        this.tick = alt.everyTick( ( ) => {
            let count = 0;

            for( const [ , entity ] of this.entities ) {
                if( entity.streamed ) {
                    entity.draw( );
                    count++;
                }
            }

            if( count === 0 )
                this.clearTick();
        } );
    }

    private clearTick( ) {
        if( this.tick === null )
            return;

        alt.clearEveryTick( this.tick );
        this.tick = null;
    }
}