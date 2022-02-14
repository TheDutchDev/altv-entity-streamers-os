import * as alt from "alt-client";
import { fillObjectPartially } from "../../../utils";
import * as natives from "natives";
export class TextLabel {
    text;
    scale;
    color;
    position;
    rmlElement;
    streamed;
    constructor(data, rmlDoc) {
        fillObjectPartially(this, data);
        this.onCreate(rmlDoc);
    }
    onCreate(rmlDoc) {
        this.rmlElement = rmlDoc.createElement("div");
        this.rmlElement.addClass("label");
        this.rmlElement.addClass('hide');
        this.rmlElement.innerRML = this.text.replaceAll('\n', '<br />');
        this.rmlElement.setProperty('color', `rgba( ${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a} );`);
    }
    streamIn() {
        this.rmlElement.removeClass('hide');
        this.streamed = true;
    }
    streamOut() {
        this.rmlElement.addClass('hide');
        this.streamed = false;
    }
    onUpdate() {
        this.rmlElement.innerRML = this.text.replaceAll('\n', '<br />');
        this.rmlElement.setProperty('color', `rgba( ${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a} );`);
    }
    draw() {
        if (natives.isSphereVisible(this.position.x, this.position.y, this.position.z, 0.0099999998)) {
            if (this.rmlElement.hasClass('hide'))
                this.rmlElement.removeClass('hide');
            const screen = alt.worldToScreen(this.position.x, this.position.y, this.position.z);
            let left = screen.x - (this.rmlElement.clientWidth / 2);
            let top = screen.y - (this.rmlElement.clientHeight / 2);
            this.rmlElement.setProperty("left", `${left}px`);
            this.rmlElement.setProperty("top", `${top}px`);
        }
        else {
            if (!this.rmlElement.hasClass('hide'))
                this.rmlElement.addClass('hide');
        }
    }
}
