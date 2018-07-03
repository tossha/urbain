<?php

function generateToggleButton($name) {
    return '<button id="' . $name . 'ToggleButton" onclick="sim.ui.changeVisibility(\''
        . $name . '\')" class="toggleButton">Hide</button>';
}
