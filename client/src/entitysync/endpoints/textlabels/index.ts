import * as alt from 'alt-client';

import { IEntitySyncEndpoint } from "../../interfaces";
import { fillObjectPartially } from "../../../utils";
import { ITextLabel, TextLabel } from "./textlabel";

export class EntitySyncTextLabelEndpoint implements IEntitySyncEndpoint
{
    private tick : any;
    private readonly entities : Map<number, TextLabel>;

    private rmlDocument !: alt.RmlDocument;
    private rmlContainer !: alt.RmlElement;

    constructor( ) {
        this.tick = null;
        this.entities = new Map();

        this.rmlDocument = new alt.RmlDocument( './labels.rml' );
        this.rmlContainer = this.rmlDocument.getElementByID( 'label-container' );
    }

    onStreamIn( entityId: number, entityData: TextLabel ) {
        let entity = this.entities.get( entityId );

        if( entity ) {
            fillObjectPartially( entity, entityData );
        }
        else {
            entity = new TextLabel( entityData, this.rmlDocument );
            this.rmlContainer.appendChild( entity.rmlElement );
        }

        entity.streamIn();
        this.entities.set( entityId, entity );

        if( this.tick === null )
            this.startTick( );
    }

    onStreamOut( entityId: number ) {
        if( !this.entities.has( entityId ) )
            return;

        const entity = this.entities.get( entityId );
        entity.streamOut();
    }

    onUpdateData( entityId: number, data: ITextLabel ) {
        if( !this.entities.has( entityId ) )
            return;

        let entity = this.entities.get( entityId );
        fillObjectPartially( entity, data );
        entity.onUpdate( );
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

        const entity = this.entities.get( entityId );
        this.rmlContainer.removeChild( entity.rmlElement );

        this.entities.delete( entityId );
    }

    private startTick( ) {
        if( this.tick !== null )
            return;

        this.tick = alt.everyTick( ( ) => {
            let count = 0;

            for( const [ , entity ] of this.entities ) {
                if( entity.streamed ) {
                    entity.draw();
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