import * as alt from "alt-client";
import { fillObjectPartially } from "../../../utils";
import * as natives from "natives";
export class WorldObject {
    model;
    position;
    radius;
    visible;
    constructor(data) {
        fillObjectPartially(this, data);
    }
    streamIn() {
        if (this.visible)
            natives.removeModelHide(this.position.x, this.position.y, this.position.z, this.radius, alt.hash(this.model), true);
        else
            natives.createModelHideExcludingScriptObjects(this.position.x, this.position.y, this.position.z, this.radius, alt.hash(this.model), true);
    }
    streamOut() {
        if (this.visible)
            natives.createModelHideExcludingScriptObjects(this.position.x, this.position.y, this.position.z, this.radius, alt.hash(this.model), true);
        else
            natives.removeModelHide(this.position.x, this.position.y, this.position.z, this.radius, alt.hash(this.model), true);
    }
}
