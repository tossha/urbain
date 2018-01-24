<?php
require 'functions.php';
?>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="./ui.css"/>
    <script src="<?= addTime('app.bundle.js') ?>"></script>
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

        .dg.a {
            float: left;
        }

    </style>
</head>

<body>
<div id="leftPanel"></div>
<div id="viewport"></div>
<div id="metricsPanel" class="panel" data-panel-name="metrics">
    <table id="metricsHeader" class="panelHeader">
        <tr>
            <td>
                Metrics
                <button class="collapseButton" data-panel-name="metrics"></button>
            </td>
        </tr>
    </table>

    <table width="100%" style="border-bottom: blue solid 1px" class="panelContent" data-panel-name="metrics">
        <tr>
            <td style="width: 110px"><b>of</b></td>
            <td id="metricsOf"></td>
        </tr>
        <tr>
            <td><b>relative to</b></td>
            <td id="relativeTo"></td>
        </tr>
    </table>

    <table width="100%" style="border-bottom: blue solid 1px" class="panelContent" data-panel-name="metrics">
        <tr>
            <td>
                <label for="showAnglesOfSelectedOrbit">Show angles of selected orbit</label>
            </td>
            <td>
                <input type="checkbox" id="showAnglesOfSelectedOrbit" checked>
            </td>
        </tr>
    </table>

    <table width="100%" style="border-bottom: blue solid 1px" class="panelContent" data-panel-name="metrics">
        <tr>
            <td colspan="3">
                Keplerian
            </td>
        </tr>

        <?php foreach ([
               ['Ecc', ''],
               ['SMA', 'km'],
               ['Inc', 'deg.'],
               ['AoP', 'deg.'],
               ['RAAN', 'deg.'],
               ['TA', 'deg.'],
               ['Period', 'days'],
           ] as $param) { ?>
        <tr>
            <td style="width: 60px"><?= $param[0] ?></td>
            <td id="elements-<?= strtolower($param[0]) ?>" align="right"></td>
            <td style="width: 60px"><?= $param[1] ?></td>
        </tr>
        <?php } ?>
    </table>

    <table class="panelContent" data-panel-name="metrics">
        <tr>
            <td colspan="6">Cartesian</td>
        </tr>
    </table>

    <div class="panelContent" data-panel-name="metrics">
        <table data-panel-name="position_vector" width="100%">
            <tr>
                <td style="width: 65px">Position</td>
                <td class="vec-magnitude" align="right"></td>
                <td style="width: 60px">km</td>
                <td style="width: 49px">
                    <button class="collapseButton" data-panel-name="position_vector"></button>
                </td>
            </tr>

            <?php foreach (['x', 'y', 'z'] as $coord) { ?>
            <tr class="panelContent" data-panel-name="position_vector">
                <td><?= $coord ?></td>
                <td class="vec-<?= $coord ?>" align="right"></td>
                <td>km</td>
            </tr>
            <?php } ?>
        </table>
    </div>

    <div class="panelContent" data-panel-name="metrics">
        <table data-panel-name="velocity_vector" width="100%">
            <tr>
                <td style="width: 65px">Velocity</td>
                <td class="vec-magnitude" align="right"></td>
                <td style="width: 60px">km/s</td>
                <td style="width: 49px">
                    <button class="collapseButton" data-panel-name="velocity_vector"></button>
                </td>
            </tr>

            <?php foreach (['x', 'y', 'z'] as $coord) { ?>
            <tr class="panelContent" data-panel-name="velocity_vector">
                <td><?= $coord ?></td>
                <td class="vec-<?= $coord ?>" align="right"></td>
                <td>km/s</td>
            </tr>
            <?php } ?>
        </table>
    </div>
</div>
<div id="bottomPanel">
    <div class="panel" id="timePanel" data-panel-name="time">
        <table id="timeBoxHeader" class="panelHeader">
            <tr>
                <td>
                    Time
                    <button class="collapseButton" data-panel-name="time"></button>
                </td>
            </tr>
        </table>

        <table class="panelContent"  data-panel-name="time" style="width: 100%">

            <tr>
                <td style="width: 65px"><b>Current:</b></td>

                <td id="currentDateValue">01.01.2000 12:00:00</td>

                <td style="width: 70px">
                    <button id="useCurrentTime">Now</button>
                </td>
            </tr>

            <tr>
                <td><b>Rate:</b></td>
                <td id="timeScaleValue"></td>
                <td>
                    <button id="setRealTimeScale">Real</button>
                </td>
            </tr>

            <tr>
                <td colspan="2">
                    <input id="timeScaleSlider" type="range" min="-1" max="1" step="0.001" value="0.001"
                           style="width: 100%">
                </td>

                <td>
                    <button id="pauseButton" tabindex="-1">Pause</button>
                </td>
            </tr>
        </table>
    </div>

    <div class="panel" id="cameraPanel" data-panel-name="camera">
        <table id="cameraBoxHeader" class="panelHeader">
            <tr>
                <td>
                    Camera
                    <button class="collapseButton" data-panel-name="camera"></button>
                </td>
            </tr>
        </table>

        <table class="panelContent" data-panel-name="camera">
            <tr>
                <td><b>Target:</b></td>
                <td colspan="2">
                    <select id="targetSelect">
                    </select>
                </td>
            </tr>
            <tr>
                <td><b>Frame type:</b></td>
                <td colspan="2">
                    <select id="rfTypeSelect">
                    </select>
                </td>
            </tr>
        </table>
    </div>

    <canvas id="timeLineCanvas"></canvas>
</div>

<div class="panel" id="lambertPanel" data-panel-name="lambert">
    <table id="lambertHeader" class="panelHeader">
        <tr>
            <td>
                Transfer calculation
                <button class="collapseButton" data-panel-name="lambert"></button>
            </td>
        </tr>
    </table>

    <table class="panelContent" data-panel-name="lambert" width="100%" style="border-bottom: blue solid 1px">
        <tr>
            <td><b>Origin:</b></td>
            <td>
                <select id="originSelect">
                </select>
            </td>
        </tr>
        <tr>
            <td><b>Target:</b></td>
            <td>
                <select id="targetSelect">
                </select>
            </td>
        </tr>
        <tr>
            <td><b>Transfer type:</b></td>
            <td>
                Ballistic
            </td>
        </tr>
    </table>

    <table class="panelContent"  data-panel-name="lambert" style="width: 100%; border-bottom: blue solid 1px">

        <tr>
            <td><b>Departure:</b></td>

            <td id="departureDateValue">01.01.2000 12:00:00</td>

            <td>
                <button id="useCurrentTime">Now</button>
            </td>
        </tr>

        <tr>
            <td><b>Transfer time:</b></td>
            <td id="transferTimeValue"></td>
            <td>
                <!--<button id="optimalTransferTime">Optimal</button>-->
            </td>
        </tr>

        <tr>
            <td colspan="3">
                <input id="transferTimeSlider" type="range" min="0" max="1" step="0.001" value="0.5"
                       style="width: 100%">
            </td>
        </tr>

    </table>

    <table class="panelContent" data-panel-name="lambert">
        <tr>
            <td><b>Ejection Delta-V:</b></td>
            <td id="deltaVEjection"></td>
        </tr>
        <tr>
            <td><b>Insertion Delta-V:</b></td>
            <td id="deltaVInsertion"></td>
        </tr>
        <tr>
            <td><b>Total Delta-V:</b></td>
            <td id="deltaVTotal"></td>
        </tr>
    </table>

</div>


<div id="dialogLambertResults" title="Lambert solver results" style="position: absolute; top: 500px; left: 0px; z-index: 10000">
    <canvas width="300" height="300" id="lambertCanvas"></canvas>
</div>

</body>
</html>