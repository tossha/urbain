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

function addTime($file) {
    return $file . '?t=' . filemtime($file);
}

function reorderScripts($files) {
    $reordered = [];
    $includedClasses = [];

    while ($files) {
        $delayed = [];
        foreach ($files as $file) {
            $contents = file_get_contents($file);

            preg_match('/class ([\S]+)/', $contents, $matches);
            $class = $matches[1];
            preg_match('/extends ([\S]+)/', $contents, $matches);
            $parentClass = $matches[1];

            // костыль :(
            if ($class === 'Camera') {
                $delayed[] = $file;
                continue;
            }

            if (!$parentClass || in_array($parentClass, $includedClasses)) {
                $includedClasses[] = $class;
                $reordered[] = $file;
            } else {
                $delayed[] = $file;
            }
        }
        if (count($files) === count($delayed)) {
            $reordered = array_merge($reordered, $delayed);
            break;
        }
        $files = $delayed;
    }

    return $reordered;
}


function generateToggleButton($name) {
    return '<button id="' . $name . 'ToggleButton" onclick="sim.ui.changeVisibility(\''
        . $name . '\')" class="toggleButton">Hide</button>';
}
