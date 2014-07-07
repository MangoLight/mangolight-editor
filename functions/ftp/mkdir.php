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
include('../check_logged.php');
include('connect.php');

if(@ftp_mkdir($ftp,$_POST['folder'])){
    @ftp_chmod($ftp,0755,$_POST['folder']);
    $parent = substr($_POST['folder'],0,strrpos($_POST['folder'],'/'));
    print '{"status":"success","folder":"'.$_POST['folder'].'","parent":"'.$parent.'"}';
}else{
    print '{"status":"error","message":"Impossible to create the folder"}';
}

ftp_close($ftp);

?>