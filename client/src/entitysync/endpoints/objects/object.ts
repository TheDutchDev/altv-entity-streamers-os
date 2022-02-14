import * as alt from "alt-client";
import { fillObjectPartially } from "../../../utils";
import * as natives from "natives";
import { asyncModel } from "./async-models";

export interface LightColor {
    r : number;
    g : number;
    b : number;
}

export interface IDynamicObject {
    model: string;
    position: alt.Vector3;
    frozen ?: boolean;
    dynamic ?: boolean
    rotation: alt.Vector3;
    lodDistance ?: number;
    textureVariation ?: number;
    visible ?: boolean;
    onFire ?: boolean;
    lightColor ?: LightColor;
    velocity ?: alt.Vector3;
    handle ?: number;

    create();
    update();
    destroy();
}

export class DynamicObject implements IDynamicObject {
    model: string;
    position: alt.Vector3;
    frozen ?: boolean;
    dynamic ?: boolean
    rotation: alt.Vector3;
    lodDistance ?: number;
    textureVariation ?: number;
    visible ?: boolean;
    onFire ?: boolean;
    lightColor ?: LightColor;
    velocity ?: alt.Vector3;
    handle ?: number;

    constructor( data : IDynamicObject ) {
        fillObjectPartially( this, data );
    }

    async create() {
        let hash = alt.hash( this.model );

        await asyncModel.load( hash );

        this.handle = natives.createObjectNoOffset( hash, this.position.x, this.position.y, this.position.z, false, false, false );

        this.update();
    }

    update( ) {
        if( this.handle === null )
            return;

        this.setPosition( );
        this.setRotation( );
        this.setLodDistance( );
        this.setTextureVariation( );
        this.setLightColor( );
        this.setDynamic( );
        this.setVisible( );
        this.setVelocity( );
        // this.setOnFire( obj.entityId, obj.onFire );
        this.setFrozen( );
        this.setModel();
    }

    destroy() {
        let hash = alt.hash( this.model );

        if( this.handle === null )
        {
            asyncModel.cancel( hash );
            return;
        }

        asyncModel.removeLoadedModel( hash );
        natives.deleteObject( this.handle );
        this.handle = null;
    }

    private setRotation( ) {
        if( typeof this.rotation !== 'undefined' )
            natives.setEntityRotation( this.handle, this.rotation.x, this.rotation.y, this.rotation.z, 0, true );
    }

    private setPosition( ) {
        if( typeof this.position !== 'undefined' )
            natives.setEntityCoordsNoOffset( this.handle, this.position.x, this.position.y, this.position.z, true, true, true );
    }

    private setDynamic( ) {
        if( typeof this.dynamic !== 'undefined' )
            natives.setEntityDynamic( this.handle, this.dynamic );
    }

    private setModel( ) {
        let currentHash = natives.getEntityModel( this.handle );
        let newHash = alt.hash( this.model );

        if( newHash !== currentHash ) {
            this.destroy();
            this.create();
        }
    }

    private setLodDistance( ) {
        if( this.lodDistance !== null )
            natives.setEntityLodDist( this.handle, this.lodDistance );
    }

    private setTextureVariation( ) {
        if( this.textureVariation !== null )
            natives.setObjectTextureVariation( this.handle, this.textureVariation );
    }

    private setLightColor( ) {
        if( this.lightColor !== null )
            natives.setObjectLightColor( this.handle, true, this.lightColor.r, this.lightColor.g, this.lightColor.b );
    }

    private setVelocity( ) {
        if( typeof this.velocity !== 'undefined' )
            natives.setEntityVelocity( this.handle, this.velocity.x, this.velocity.y, this.velocity.z );
    }

    private setVisible( ) {
        if( typeof this.visible !== 'undefined' )
        {
            natives.setEntityVisible( this.handle, this.visible, true );
            natives.setEntityCollision( this.handle, this.visible, true );
        }
    }

    private setFrozen( ) {
        if( typeof this.frozen !== 'undefined' )
            natives.freezeEntityPosition( this.handle, this.frozen );
    }
}