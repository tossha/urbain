<?php
require 'functions.php';

$scripts = array_merge(
    getDirScripts('vendor'),
    reorderScripts(array_merge(
        getDirScripts('core'),
        getDirScripts('visual'),
        getDirScripts('interface')
    )),
    ['algebra.js', 'const.js', 'ssdata.js']
);
$scripts = array_map('addTime', $scripts);
?>
<!DOCTYPE html>
<html>
    <head>
        <script src="https://threejs.org/build/three.min.js"></script>

        <?php foreach ($scripts as $script) { ?>
            <script src="<?= $script ?>"></script>
        <?php } ?>

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
                height: 35px;
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
        <script type="text/javascript" src="<?= addTime('builtin.js') ?>"></script>
        <script type="text/javascript" src="<?= addTime('main.js') ?>"></script>

        <div id="leftPanel"></div>
        <div id="viewport"></div>
        <div id="bottomPanel">
            <canvas id="timeLineCanvas"></canvas>
        </div>
    </body>
</html>
