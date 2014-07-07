<?php
/* ==========================================================
 * MangoLight Editor 0.1
 * http://www.mangolight.com/labs/mangolight_editor
 * ==========================================================
 * Copyright 2014 MangoLight / http://www.mangolight.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
include('../config.php');

if(!isset($config)){
    $config = array();
    $config['user'] = array();
    $config['sites'] = array();
    $config['interface_theme'] = 'dark';
    $config['code_theme'] = 'mangolight';
    $config['not_set'] = true;
}else{
    $config['user']['password'] = '#########';
    for($i=0;$i<count($config['sites']);$i++){
        $config['sites'][$i]['password'] = '#########';
    }
}

$files = scandir('../public/js/ace/');
foreach($files as $f){
    if(strpos($f,'theme-')===0){
        $config['available_code_themes'][] = str_replace(array('theme-','.js'),'',$f);
    }
}

$files = scandir('../public/styles/themes/');
foreach($files as $f){
    if(strpos($f,'.css')!==false){
        $config['available_interface_themes'][] = str_replace('.css','',$f);
    }
}

print '{"status":"success","config":'.json_encode($config).'}';

?>