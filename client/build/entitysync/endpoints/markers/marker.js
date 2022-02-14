import { fillObjectPartially } from "../../../utils";
import * as natives from "natives";
export class Marker {
    bobUpDown;
    color;
    direction;
    drawOnEnter;
    faceCam;
    markerType;
    position;
    rotate;
    rotation;
    scale;
    streamed;
    textureDict;
    textureName;
    constructor(data) {
        fillObjectPartially(this, data);
    }
    draw() {
        natives.drawMarker(this.markerType, this.position.x, this.position.y, this.position.z, this.direction.x, this.direction.y, this.direction.z, this.rotation.x, this.rotation.y, this.rotation.z, this.scale.x, this.scale.y, this.scale.z, this.color.r, this.color.g, this.color.b, this.color.a, this.bobUpDown, this.faceCam, 2, this.rotate, this.textureDict, this.textureName, this.drawOnEnter);
    }
}
