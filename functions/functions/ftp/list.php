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

if($_POST['folder']=='' || $_POST['folder']=='/') $_POST['folder'] = $site['path'];
if($_POST['folder']=='') $_POST['folder'] = '/';

$content = build_content($ftp,$_POST['folder']);

function build_content($ftp,$dir){
    $content_array = array();
    $dirs_array = array();
    $files_array = array();
    $files = ftp_nlist($ftp,$dir);
    
    foreach($files as $filename){
        $filename = explode('/',$filename);
        $filename = $filename[count($filename)-1];
        if($filename=='.' || $filename=='..') continue;
        $fullname = $filename;
        if($dir!='') $fullname = $dir.'/'.$fullname;
        
        $filename = utf8_encode($filename);
        if(ftp_size($ftp,$fullname)==-1){
            $fullname = utf8_encode($fullname);
            $dirs_array[] = array('name'=>$filename,'file'=>$fullname,'is_folder'=>'true');
        }else{
            $fullname = utf8_encode($fullname);
            $files_array[] = array('name'=>$filename,'file'=>$fullname,'icon'=>get_icon($filename));
        }
    }
    usort($dirs_array,'cmp');
    usort($files_array,'cmp');
    $content_array = array_merge($dirs_array,$files_array);
    return $content_array;
}

function cmp($a,$b){
    if($a['name']==$b['name']){
        return 0;
    }
    return ($a['name']<$b['name']) ? -1 : 1;
}

function get_icon($filename){
    $ext = strtolower(substr($filename,strrpos($filename,'.')+1));
    if(!is_file('../../public/img/icons/'.$ext.'.png')){
        return '_blank';
    }
    return $ext;
}

print '{"status":"success","folder":"'.$_POST['folder'].'","files":'.json_encode($content).'}';

unset($ftp);

?>