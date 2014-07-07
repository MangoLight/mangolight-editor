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

function recursive_delete($ftp,$path){
    $files = ftp_rawlist($ftp,$path);
    foreach($files as $file){
        $i = explode(' ',$file);
        $filename = $i[count($i)-1];
        if(strpos($file,'<DIR>')!==false){
            recursive_delete($ftp,$path.'/'.$filename);
        }else{
            if(!ftp_delete($ftp,$path.'/'.$filename)) return false;
        }
    }
    if(!ftp_rmdir($ftp,$path)) return false;
    return true;
}

if(!recursive_delete($ftp,$_POST['folder'])){
    print '{"status":"error","message":"Impossible to delete the folder"}';
}else{
    print '{"status":"success","folder":"'.$_POST['folder'].'"}';
}

ftp_close($ftp);

?>