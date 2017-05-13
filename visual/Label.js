class Label {
    constructor(text, parameters) {
        if ( parameters === undefined ) parameters = {};
        this.parameters.fontface        = parameters.hasOwnProperty("fontface")        ? parameters["fontface"]        : "Arial";
        this.parameters.fontsize        = parameters.hasOwnProperty("fontsize")        ? parameters["fontsize"]        : 18;
        this.parameters.borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        this.parameters.borderColor     = parameters.hasOwnProperty("borderColor")     ? parameters["borderColor"]     : { r:0, g:0, b:0, a:1.0 };
        this.parameters.backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
        this.parameters.textColor       = parameters.hasOwnProperty("textColor")       ? parameters["textColor"]       : { r:0, g:0, b:0, a:1.0 };

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        let metrics = context.measureText( message );
        let textWidth = metrics.width;

        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness / 2, borderThickness / 2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

        context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
        context.fillText(text, borderThickness, fontsize + borderThickness);

        let texture = new THREE.Texture(canvas);

        let spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
        this.sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    }
}