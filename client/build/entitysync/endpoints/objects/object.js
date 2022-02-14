import * as alt from "alt-client";
import { fillObjectPartially } from "../../../utils";
import * as natives from "natives";
import { asyncModel } from "./async-models";
export class DynamicObject {
    model;
    position;
    frozen;
    dynamic;
    rotation;
    lodDistance;
    textureVariation;
    visible;
    onFire;
    lightColor;
    velocity;
    handle;
    constructor(data) {
        fillObjectPartially(this, data);
    }
    async create() {
        let hash = alt.hash(this.model);
        await asyncModel.load(hash);
        this.handle = natives.createObjectNoOffset(hash, this.position.x, this.position.y, this.position.z, false, false, false);
        this.update();
    }
    update() {
        if (this.handle === null)
            return;
        this.setPosition();
        this.setRotation();
        this.setLodDistance();
        this.setTextureVariation();
        this.setLightColor();
        this.setDynamic();
        this.setVisible();
        this.setVelocity();
        this.setFrozen();
        this.setModel();
    }
    destroy() {
        let hash = alt.hash(this.model);
        if (this.handle === null) {
            asyncModel.cancel(hash);
            return;
        }
        asyncModel.removeLoadedModel(hash);
        natives.deleteObject(this.handle);
        this.handle = null;
    }
    setRotation() {
        if (typeof this.rotation !== 'undefined')
            natives.setEntityRotation(this.handle, this.rotation.x, this.rotation.y, this.rotation.z, 0, true);
    }
    setPosition() {
        if (typeof this.position !== 'undefined')
            natives.setEntityCoordsNoOffset(this.handle, this.position.x, this.position.y, this.position.z, true, true, true);
    }
    setDynamic() {
        if (typeof this.dynamic !== 'undefined')
            natives.setEntityDynamic(this.handle, this.dynamic);
    }
    setModel() {
        let currentHash = natives.getEntityModel(this.handle);
        let newHash = alt.hash(this.model);
        if (newHash !== currentHash) {
            this.destroy();
            this.create();
        }
    }
    setLodDistance() {
        if (this.lodDistance !== null)
            natives.setEntityLodDist(this.handle, this.lodDistance);
    }
    setTextureVariation() {
        if (this.textureVariation !== null)
            natives.setObjectTextureVariation(this.handle, this.textureVariation);
    }
    setLightColor() {
        if (this.lightColor !== null)
            natives.setObjectLightColor(this.handle, true, this.lightColor.r, this.lightColor.g, this.lightColor.b);
    }
    setVelocity() {
        if (typeof this.velocity !== 'undefined')
            natives.setEntityVelocity(this.handle, this.velocity.x, this.velocity.y, this.velocity.z);
    }
    setVisible() {
        if (typeof this.visible !== 'undefined') {
            natives.setEntityVisible(this.handle, this.visible, true);
            natives.setEntityCollision(this.handle, this.visible, true);
        }
    }
    setFrozen() {
        if (typeof this.frozen !== 'undefined')
            natives.freezeEntityPosition(this.handle, this.frozen);
    }
}
