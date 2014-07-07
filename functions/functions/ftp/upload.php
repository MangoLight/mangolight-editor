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

if(!move_uploaded_file($_FILES['upload']['tmp_name'], '../../tmp/upload')){
    $result = '{"status":"error","message":"Impossible to upload the file, error code '.$_FILES['upload']['error'].'"}';
}else{
    $file = $_POST['folder'].'/'.$_FILES['upload']['name'];
    //@TODO: check if file already exists
    if(ftp_size($ftp,$file)==-1){
        if(@ftp_put($ftp,$file,'../../tmp/upload',FTP_BINARY)){
            @ftp_chmod($ftp,0644,$file);
            $folder = substr($file,0,strrpos($file,'/'));
            $result = '{"status":"success","file":"'.$file.'","folder":"'.$folder.'"}';
        }else{
            $result = '{"status":"error","message":"Impossible to upload the file"}';
        }
    }else{
        $result = '{"status":"error","message":"File already exists on the server, delete it before."}';
    }
}

print '<script type="text/javascript">parent.file_uploaded(\''.$result.'\');</script>';

unlink('../../tmp/upload');
ftp_close($ftp);

?>