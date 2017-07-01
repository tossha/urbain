class Label {
    constructor(text, functionOfEpoch, parameters) {
        if (parameters === undefined){
            parameters = {};
        }
        this.parameters = {};
        this.parameters.fontface        = parameters.hasOwnProperty("fontface")        ? parameters["fontface"]        : "Arial";
        this.parameters.fontsize        = parameters.hasOwnProperty("fontsize")        ? parameters["fontsize"]        : 18000000;
        this.parameters.borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        this.parameters.borderColor     = parameters.hasOwnProperty("borderColor")     ? parameters["borderColor"]     : { r:0, g:0, b:0, a:1.0 };
        this.parameters.backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
        this.parameters.textColor       = parameters.hasOwnProperty("textColor")       ? parameters["textColor"]       : { r:0, g:0, b:0, a:1.0 };

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = "Bold " + this.parameters.fontsize + "px " + this.parameters.fontface;
        let metrics = context.measureText( text );
        let textWidth = metrics.width;

        context.fillStyle   = "rgba(" + 
                              this.parameters.backgroundColor.r + "," + 
                              this.parameters.backgroundColor.g + "," + 
                              this.parameters.backgroundColor.b + "," + 
                              this.parameters.backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + 
                              this.parameters.borderColor.r + "," + 
                              this.parameters.borderColor.g + "," + 
                              this.parameters.borderColor.b + "," + 
                              this.parameters.borderColor.a + ")";

        context.lineWidth = this.parameters.borderThickness;
        this.roundRect(
            context,
            this.parameters.borderThickness / 2,
            this.parameters.borderThickness / 2,
            (textWidth + this.parameters.borderThickness) * 1.1,
            this.parameters.fontsize * 1.4 + this.parameters.borderThickness,
            8
        );

        context.fillStyle = "rgba(" + 
                            this.parameters.textColor.r + ", " + 
                            this.parameters.textColor.g + ", " + 
                            this.parameters.textColor.b + ", 1.0)";
        context.fillText(
            text, 
            this.parameters.borderThickness,
            this.parameters.fontsize + this.parameters.borderThickness
        );

        let texture = new THREE.Texture(canvas);

        let spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
        this.sprite = new THREE.Sprite( spriteMaterial );
        this.sprite.scale.set(
            0.5 * this.parameters.fontsize,
            0.25 * this.parameters.fontsize,
            0.75 * this.parameters.fontsize
        );

        scene.add(this.sprite);
        this.positionAtEpoch = functionOfEpoch;
        let pos = (new THREE.Vector3).fromArray(
            this.positionAtEpoch.evaluate(time.epoch)
                .sub(camera.lastPosition)
        );
        this.sprite.position.set(
            pos.x,
            pos.y,
            pos.z
        );

        this.onRenderListener = this.onRender.bind(this);
        document.addEventListener('vr_render', this.onRenderListener);
    }

    roundRect(ctx, x, y, w, h, r) { 
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke(); 
    }

    onRender(event) {
        let pos = (new THREE.Vector3).fromArray(
            this.positionAtEpoch.evaluate(event.detail.epoch)
                //.sub(camera.lastPosition)
        );
        this.sprite.position.set(
            pos.x,
            pos.y,
            pos.z
        );
        console.log(this.sprite.position);
        console.log(App.getTrajectory(settings.trackingObject).getPositionByEpoch(time.epoch, RF_BASE))
    }
}