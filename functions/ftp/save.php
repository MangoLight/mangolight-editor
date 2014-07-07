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

if(ftp_size($ftp,$_POST['file'])!=-1 && $_POST['content']==''){
    print '{"status":"error","message":"This file already exists"}';
    exit;
}

if(file_put_contents('../../tmp/tmp',$_POST['content'])===false){
    print '{"status":"error","message":"Impossible to save temporary file to upload"}';
    exit;
}

if(@ftp_put($ftp,$_POST['file'],'../../tmp/tmp',FTP_BINARY)){
    @ftp_chmod($ftp,0644,$_POST['file']);
    $folder = substr($_POST['file'],0,strrpos($_POST['file'],'/'));
    print '{"status":"success","file":"'.$_POST['file'].'","name":"'.substr($_POST['file'],strrpos($_POST['file'],'/')+1).'","folder":"'.$folder.'"}';
}else{
    print '{"status":"error","message":"Impossible to upload the file"}';
}

unlink('../../tmp/tmp');
ftp_close($ftp);

?>