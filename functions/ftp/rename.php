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

$file_array = explode('/',$_POST['new_file']);
$dir = '';

ftp_chdir($ftp,'/');
for($i=0;$i<count($file_array)-1;$i++){
    if($dir!=='') $dir .= '/';
    $dir .= $file_array[$i];
    @ftp_mkdir($ftp,$dir);
}

if(ftp_rename($ftp,$_POST['file'],$_POST['new_file'])){
    $folder = substr($_POST['new_file'],0,strrpos($_POST['new_file'],'/'));
    $name = $_POST['new_file'];
    if(strrpos($name,'/')!==false){
        $name = substr($name,strrpos($name,'/')+1);
    }
    print '{"status":"success","old_file":"'.$_POST['file'].'","file":"'.$_POST['new_file'].'","name":"'.$name.'","folder":"'.$folder.'"}';
}else{
    print '{"status":"error","message":"Impossible to rename the file/folder"}';
}

ftp_close($ftp);

?>