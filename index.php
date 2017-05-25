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
        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

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
                height: 35px;
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
                width:  90%;
                /*height: 35px;*/
                background-color: black;
                opacity: 1;
                font: 13px/1.231 "Lucida Grande", Lucida, Verdana, sans-serif;
            }

            #bottomPanel .property-name {
                width: 4%;
            }

            .box {
                width: 500px;
                height: auto;
                background-color: white;
                display: inline-block;
            }

            #bottomPanel .c {
                width: 96%;
            }

            #bottomPanel .slider {
                width: 92%;
            }

            #bottomPanel input {
                height: 13px; /* На самом деле 20 */
            }

            .inputLine {
                height: 20px;
                vertical-align: top;
            }

            #bottomPanel button {
                height: 20px;
            }

            /* Черная магия CSS */
            #metricsContainer {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 0;

                /* Именно здесь */
                z-index: 0;
            }



            #metrics {
                background-color: white;
                width: 200px;
                float: right;
            }
        </style>
    </head>

    <body>
        <script type="text/javascript" src="<?= addTime('builtin.js') ?>"></script>
        <script type="text/javascript" src="<?= addTime('main.js') ?>"></script>

        <div id="leftPanel"></div>
        <div id="viewport"></div>

        <!-- Begin -->
        <div id="metricsContainer">
            <div id="metrics">
                Metrics
                <button name="buttonShowHideMetrics" style="float: right" onclick="toggleVisibility('Metrics')">Hide</button>

                <div name="blockShowHideMetrics">
                    <table>
                        <tr>
                            <td>
                                <b>of</b>
                            </td>

                            <td>
                                Cassini
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>relative to</b>
                            </td>

                            <td>
                                Sun
                            </td>
                        </tr>
                    </table>

                    Keplerian
                    <table>
                        <tr>
                            <td>Ecc:</td>
                            <td>0</td>
                        </tr>

                        <tr>
                            <td>SMA:</td>
                            <td>0</td>
                        </tr>

                        <tr>
                            <td>Inc:</td>
                            <td>0</td>
                        </tr>

                        <tr>
                            <td>AoP:</td>
                            <td>0</td>
                        </tr>

                        <tr>
                            <td>RAAN:</td>
                            <td>0</td>
                        </tr>

                        <tr>
                            <td>TA:</td>
                            <td>0</td>
                        </tr>
                    </table>

                    Cartessian
                    <table>
                        <tr>
                            <td>Distance:</td>
                            <td><span>285</span> <i>Mkm</i></td>
                            <td><button name="buttonShowHideDistance" onclick="toggleVisibility('Distance')">Hide</button></td>
                        </tr>

                        <tr name="blockShowHideDistance">
                            <td>x:</td>
                            <td>0</td>
                        </tr>

                        <tr name="blockShowHideDistance">
                            <td>y:</td>
                            <td>0</td>
                        </tr>

                        <tr name="blockShowHideDistance">
                            <td>z:</td>
                            <td>0</td>
                        </tr>

                        <tr>
                            <td>Velocity:</td>
                            <td><span>25</span> <i>km/sec</i></td>
                            <td><button name="buttonShowHideVelocity" onclick="toggleVisibility('Velocity')">Hide</button></td>
                        </tr>

                        <tr name="blockShowHideVelocity">
                            <td>x:</td>
                            <td>0</td>
                        </tr>

                        <tr name="blockShowHideVelocity">
                            <td>y:</td>
                            <td>0</td>
                        </tr>

                        <tr name="blockShowHideVelocity">
                            <td>z:</td>
                            <td>0</td>
                        </tr>

                    </table>
                </div>
            </div>
        </div>

        <div id="bottomPanel">
            <div class="box">
                <div align="center" class="inputLine">
                    <span>Time</span>
                    <button name="buttonShowHideTime" style="float: right" onclick="toggleVisibility('Time')">Hide</button>
                </div>

                <div name="blockShowHideTime">
                    <div class="inputLine">
                        <b>Current:</b>
                        <button style="float: right">Now</button>
                        <span id="currentTimeText" style="float: right">01.01.01 00:00:00</span>
                    </div>

                    <div class="inputLine">
                        <b>Rate:</b>
                        <button style="float: right">Real</button>
                        <span id="currentTimeRateText" style="float: right">
                            <span>1 day</span>
                            <i>per second</i>
                        </span>
                    </div>

                    <div class="inputLine">
                        <input type="range" style="width: 300px; height: 20px;">
                        <button style="float: right">Pause</button>
                        <button style="float: right">Now</button>
                    </div>
                </div>
            </div>

            <div class="box">
                <div align="center" class="inputLine">
                    <span>Camera</span>
                    <button name="buttonShowHideCamera" style="float: right" onclick="toggleVisibility('Camera')">Hide</button>
                </div>

                <div name="blockShowHideCamera">
                    <div class="inputLine">
                        <b>Target:</b>
                        <span id="currentCameraTargetText" style="float: right">Earth</span>
                    </div>

                    <div class="inputLine">
                        <b>Mode:</b>
                        <input type="radio" name="radio-1" id="radio-1">
                        <label for="radio-1">Orbit</label>
                        <input type="radio" name="radio-1" id="radio-2">
                        <label for="radio-2">Free</label>
                        <input id="spinner" type="number" max="360" min="0" value="0" style="float: right">
                    </div>

                    <div class="inputLine">
                        <b>Zoom:</b>
                        <input type="range" style="width: 300px; height: 20px;">
                    </div>
                </div>
            </div>
            <canvas id="timeLineCanvas"></canvas>
        </div>
        <!-- End-->
    </body>
</html>
