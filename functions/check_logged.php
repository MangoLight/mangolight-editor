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
ini_set('max_execution_time',3600);
ini_set('memory_limit','500M');
ini_set('post_max_size','500M');
ini_set('upload_max_filesize','500M');
session_start();

include(dirname(__FILE__).'/../config.php');

if(@$_POST['login']){
    if(@$_POST['login']==$config['user']['login'] && @$_POST['password']==$config['user']['password']){
        $_SESSION['logged'] = 'true';
    }
}

if(@$_SESSION['logged']!='true'){
    print '{"status":"error","message":"Not logged"}';
    exit;
}else if(@$_GET['check']=='true' || @$_POST['login']){
    print '{"status":"success"}';
    exit;
}

?>