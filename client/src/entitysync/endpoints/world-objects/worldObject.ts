import * as alt from "alt-client";
import { fillObjectPartially } from "../../../utils";
import * as natives from "natives";


export interface IWorldObject {
    model: string;
    position: alt.Vector3;
    radius: number;
    visible: boolean;

    streamIn();
    streamOut();
}

export class WorldObject implements IWorldObject {
    model: string;
    position: alt.Vector3;
    radius: number;
    visible: boolean;


    constructor( data : IWorldObject ) {
        fillObjectPartially( this, data );
    }

    streamIn( ) {
        if( this.visible )
            natives.removeModelHide( this.position.x, this.position.y, this.position.z, this.radius, alt.hash( this.model ), true );
        else
            natives.createModelHideExcludingScriptObjects( this.position.x, this.position.y, this.position.z, this.radius, alt.hash( this.model ), true );
    }

    streamOut( ) {
        if( this.visible )
            natives.createModelHideExcludingScriptObjects( this.position.x, this.position.y, this.position.z, this.radius, alt.hash( this.model ), true );
        else
            natives.removeModelHide( this.position.x, this.position.y, this.position.z, this.radius, alt.hash( this.model ), true );
    }
}