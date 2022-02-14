import * as alt from "alt-client";
import { fillObjectPartially } from "../../../utils";
import * as natives from "natives";

export interface IMarker {
    markerType : number;
    position : alt.Vector3;
    direction : alt.Vector3;
    rotation : alt.Vector3;
    scale : alt.Vector3;
    color : alt.RGBA;
    bobUpDown : boolean;
    faceCam : boolean;
    rotate : boolean;
    textureDict ?: string;
    textureName ?: string;
    drawOnEnter : boolean;
    streamed : boolean;
}

export class Marker implements IMarker {
    bobUpDown: boolean;
    color: alt.RGBA;
    direction: alt.Vector3;
    drawOnEnter: boolean;
    faceCam: boolean;
    markerType: number;
    position: alt.Vector3;
    rotate: boolean;
    rotation: alt.Vector3;
    scale: alt.Vector3;
    streamed: boolean;
    textureDict: string;
    textureName: string;

    constructor( data : IMarker ) {
        fillObjectPartially( this, data );
    }

    draw( ) {
        natives.drawMarker(
            this.markerType,
            this.position.x, this.position.y, this.position.z,
            this.direction.x, this.direction.y, this.direction.z,
            this.rotation.x, this.rotation.y, this.rotation.z,
            this.scale.x, this.scale.y, this.scale.z,
            this.color.r, this.color.g, this.color.b, this.color.a,
            this.bobUpDown, this.faceCam, 2, this.rotate,
            this.textureDict, this.textureName, this.drawOnEnter
        );
    }
}