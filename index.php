<?php
function getDirScripts($dir) {
    $scripts = glob($dir . '/*.js');

    foreach(scandir($dir) as $subDir) {
        if (($subDir{0} === '.')
            || !is_dir($dir . '/' . $subDir)
        ) {
            continue;
        }

        $scripts = array_merge($scripts, getDirScripts($dir . '/' . $subDir));
    }

    return $scripts;
}
$scripts = array_merge(
    getDirScripts('vendor'),
    getDirScripts('core'),
    getDirScripts('visual')
);
?>
<!DOCTYPE html>
<html manifest="manifest.appcache">
<head>
<script src="https://threejs.org/build/three.min.js"></script>
<script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>

<?php foreach ($scripts as $script) { ?>
<script src="<?= $script ?>"></script>
<?php } ?>

<script src="algebra.js"></script>
<script src="const.js"></script>
<style type="text/css">

    body {
        margin: 0;
        overflow: hidden;
    }

    canvas {
        width: 100%;
        height: 100%;
    }
    
    #leftPanel {
        position: absolute;
        left: 0%;
        top: 0%;
        margin-right: auto;
        margin-bottom: auto;
        background-color: black;
        opacity: 1;
        font: 13px/1.231 "Lucida Grande", Lucida, Verdana, sans-serif;
    }
    
    #bottomPanel {
        position: absolute;
        bottom: 0%;
        left: 5%;
        margin-left: auto;
        margin-right: auto;
        width:  90%;
        height: 45px;
        background-color: black;
        opacity: 1;
        font: 13px/1.231 "Lucida Grande", Lucida, Verdana, sans-serif;
    }

    #bottomPanel .property-name {
        width: 4%;
    }

    #bottomPanel .c {
        width: 96%;
    }

    #bottomPanel .slider {
        width: 92%;
    }

    #bottomPanel input {
        width: 7%;
    }
</style>
</head>
<body>
<script type="text/javascript" src="builtin.js"></script>
<script type="text/javascript" src="main.js"></script>
<div id="leftPanel"></div>
<div id="viewport"></div>
<div id="bottomPanel"></div>
</body>
</html>
