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
    <script src="http://code.jquery.com/jquery-3.2.1.min.js"></script>
    <!--    <script src="https://threejs.org/build/three.min.js"></script>-->

    <!--        --><?php //foreach ($scripts as $script) { ?>
    <!--            <script src="--><? //= $script ?><!--"></script>-->
    <!--        --><?php //} ?>

    <style type="text/css">
        html {
            width: 100%;
            height: 100%;
        }

        body {
            width: 100%;
            height: 100%;
            margin: 0;
            overflow: hidden;
        }

        canvas {
            width: 100%;
            height: 100%;
        }

        #leftPanel {
            position: absolute;
            left: 0;
            top: 0;
            margin-right: auto;
            margin-bottom: auto;
            background-color: black;
            opacity: 1;
            font: 13px/1.231 "Lucida Grande", Lucida, Verdana, sans-serif;
        }

        #bottomPanel {
            position: absolute;
            bottom: 0;
            left: 5%;
            margin-left: auto;
            margin-right: auto;
            width: 90%;
            /*height: 35px;*/
            /*background-color: black;*/
            opacity: 1;
            font: 13px/1.231 "Lucida Grande", Lucida, Verdana, sans-serif;
        }

        #timeLineCanvas {
            height: 35px;
        }

        /*#bottomPanel .property-name {*/
        /*width: 4%;*/
        /*}*/

        /*#bottomPanel .c {*/
        /*width: 96%;*/
        /*}*/

        /*#bottomPanel .slider {*/
        /*width: 92%;*/
        /*}*/

        /*#bottomPanel input {*/
        /*width: 7%;*/
        /*}*/

        .menuBlock {
            display: inline-block;
        }

        table {
            border: 1px solid black;
        }

        button {
            float: right;
        }

        #metricsPanel {
            position: absolute;
            top: 0;
            right: 0;
        }
    </style>
</head>

<body>
<!--<script type="text/javascript" src="--><? //= addTime('builtin.js') ?><!--"></script>-->
<!--<script type="text/javascript" src="--><? //= addTime('main.js') ?><!--"></script>-->

<script>
    function changeVisibility(name) {
        const selector = $('.' + name);
        const button = $(`#${name}ToggleButton`);
        button.attr('disabled', 'true');
        selector.fadeToggle(400, 'swing', () => {
            button.html(selector.is(':visible') ? 'Hide' : 'Show');
            button.removeAttr('disabled');
        });
    }

    function chooseButtonWidth(button, text1, text2) {
        button.html(text1);
        const firstWidth = button.outerWidth();
        button.html(text2);
        button.css('width', Math.max(firstWidth, button.outerWidth()) + 'px');
    }

    $(() => {
        const pauseButton = $('#pauseButton');
        pauseButton.on('click', () => {
            pauseButton.html(pauseButton.html() === 'Pause' ? 'Resume' : 'Pause');
        });
        chooseButtonWidth(pauseButton, 'Resume', 'Pause');

        for (const name of ['metrics', 'positionCoordinate', 'velocityCoordinate', 'timeBox', 'cameraBox']) {
            chooseButtonWidth($(`#${name}ToggleButton`), 'Show', 'Hide');
        }

        for (const name of ['metrics', 'timeBox', 'cameraBox']) {
            const table = $(`#${name}Header`);
            table.css('width', '100%');
            table.css('width', table.outerWidth() + 'px');
        }
    });
</script>

<div id="leftPanel"></div>
<div id="viewport"></div>
<div id="metricsPanel">
    <table id="metricsHeader">
        <tr>
            <td>
                Metrics
                <?= generateToggleButton('metrics') ?>
            </td>
        </tr>
    </table>

    <table class="metrics">
        <tr>
            <td><b>of</b></td>
            <td>Cassini</td>
        </tr>

        <tr>
            <td><b>relative to</b></td>
            <td>Sun</td>
        </tr>
    </table>

    <table class="metrics">
        <tr>
            <td colspan="3">
                Keplerian
            </td>
        </tr>

        <?php foreach ([
                           ['Ecc' , '0.4532', ''    ],
                           ['SMA' , '412'   , 'Mkm' ],
                           ['Inc' , '0.02'  , 'deg.'],
                           ['AoP' , '78'    , 'deg.'],
                           ['RAAN', '200'   , 'deg.'],
                           ['TA'  , '153'   , 'deg.'],
                       ] as $param) { ?>
            <tr>
                <td><?= $param[0] ?></td>
                <td align="right"><?= $param[1] ?></td>
                <td><?= $param[2] ?></td>
            </tr>
        <?php } ?>
    </table>

    <table class="metrics">
        <tr>
            <td colspan="6">Cartesian</td>
        </tr>

        <?php foreach (['Distance', 'Velocity'] as $type) { ?>
            <tr>
                <td colspan="2"><?= $type ?></td>
                <td colspan="2">0</td>
                <td colspan="2">
                    <?= generateToggleButton(strtolower($type) . "Coordinate") ?>
                </td>
            </tr>

            <?php foreach (['x', 'y', 'z'] as $coord) { ?>
                <tr class="<?= strtolower($type) ?>Coordinate">
                    <td colspan="3"><?= $coord ?></td>
                    <td colspan="3">0</td>
                </tr>
            <?php } ?>
        <?php } ?>
    </table>
</div>
<div id="bottomPanel">
    <div class="menuBlock">
        <table id="timeBoxHeader">
            <tr>
                <td align="center">
                    Time
                    <?= generateToggleButton('timeBox') ?>
                </td>
            </tr>
        </table>

        <table class="timeBox">

            <tr>
                <td><b>Current:</b></td>

                <td>14.05.2016 13:42:10</td>

                <td>
                    <button>Now</button>
                </td>
            </tr>

            <tr>
                <td><b>Rate:</b></td>
                <td>1.3 days per second</td>
                <td>
                    <button>Real</button>
                </td>
            </tr>

            <tr>
                <td colspan="2">
                    <input type="range" min="-2000" max="2000" style="width: 100%">
                </td>

                <td>
                    <button id="pauseButton">Pause</button>
                </td>
            </tr>
        </table>
    </div>

    <div class="menuBlock">
        <table id="cameraBoxHeader">
            <tr>
                <td align="center">
                    Camera
                    <?= generateToggleButton('cameraBox') ?>
                </td>
            </tr>
        </table>

        <table class="cameraBox">
            <tr>
                <td><b>Target:</b></td>
                <td colspan="2">Earth</td>
            </tr>

            <tr>
                <td><b>Mode:</b></td>
                <td>
                    <input id="inputModeOrbit" type="radio" name="inputMode">
                    <label for="inputModeOrbit" style="vertical-align: top;">Orbit</label>
                    <input id="inputModeFree" type="radio" name="inputMode">
                    <label for="inputModeFree" style="vertical-align: top;">Free</label>
                </td>
                <td>
                    <input type="number" value="60.0" step="0.1" min="0.0" max="360.0">
                </td>
            </tr>

            <tr>
                <td><b>Zoom:</b></td>
                <td colspan="2">
                    <input type="range" style="width: 100%">
                </td>
            </tr>
        </table>
    </div>

    <canvas id="timeLineCanvas"></canvas>
</div>
</body>
</html>
