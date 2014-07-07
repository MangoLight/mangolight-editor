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
if(!file_exists('config.php') || !is_writable('config.php')){
    print '<h1>MangoLight Editor Installation</h1>File config.php is missing or not writable.';
    exit;
}
if(!is_dir('tmp') || !is_writable('tmp')){
    print '<h1>MangoLight Editor Installation</h1>Directory /tmp is missing or not writable.';
    exit;
}
session_start();

$base_url = 'http'.(@$_SERVER['HTTPS']=='on'?'s':'').'://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
$base_url = substr($base_url,0,strrpos($base_url,'/'));

if(isset($_GET['logout'])){
    $_SESSION['logged'] = 'false';
    header('Location: '.$base_url);
}
?>

<!DOCTYPE html>
<html>
    <head>
        <title>MangoLight Editor</title>
        <link rel="stylesheet" href="public/styles/editor.css"/>
        <link rel="stylesheet" id="interface_theme" href="public/styles/themes/dark.css"/>
        <link rel="stylesheet" href="public/styles/font-awesome.min.css"/>
        <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
        <script type="text/javascript" src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
        <script type="text/javascript" src="public/js/editor.js"></script>
        <script type="text/javascript" src="public/js/ace/ace.js"></script>
        <script type="text/javascript" src="public/js/ace/ext-language_tools.js"></script>
        <script type="text/javascript">var base_url = "<?php print $base_url; ?>/";</script>
        <link rel="icon" href="public/img/logo.png"/>
    </head>
    <body>
        <div id="top_bar">
            <div id="logo"><img src="public/img/logo.png"/> <span>MangoLight Editor</span></div>
            <a class="logout" href="?logout"><i class="fa fa-sign-out"></i></a>
            <i class="about fa fa-info-circle"></i>
            <i class="settings fa fa-wrench"></i>
            <i class="browser fa fa-globe"></i>
        </div>
        <div id="project_selector"><select></select><i class="fa fa-refresh"></i></div>
        <i class="fa fa-search icon_search_files"></i><input type="text" class="search_box" id="search_files" autocomplete="off"/>
        <div id="browser"><ul></ul></div>
        <div id="tabs"><ul></ul></div>
        <div id="editors"><div class="container"></div></div>
        <div id="functions_search"><i class="fa fa-search icon_search_functions"></i><input type="text" class="search_box" autocomplete="off"/></div>
        <div id="functions"><ul></ul></div>
        <div id="log"></div>
        <div class="layer" id="layer"></div>
        <ul class="menu" id="folder_menu">
            <li class="rename"><i class="fa fa-edit"></i> Rename</li>
            <li class="delete_folder"><i class="fa fa-trash-o"></i> Delete</li>
            <li class="sep"></li>
            <li class="new_folder"><i class="fa fa-folder"></i> New folder</li>
            <li class="new_file"><i class="fa fa-file"></i> New file</li>
            <li class="sep"></li>
            <li class="upload"><i class="fa fa-upload"></i> Upload...</li>
        </ul>
        <ul class="menu" id="file_menu">
            <li class="rename"><i class="fa fa-edit"></i> Rename</li>
            <li class="delete_file"><i class="fa fa-trash-o"></i> Delete</li>
            <li class="sep"></li>
            <li class="download"><i class="fa fa-download"></i> Download</li>
        </ul>
        <form id="upload_form" enctype="multipart/form-data" action="functions/ftp/upload.php" method="post" target="upload_frame">
            <input type="file" name="upload"/>
            <input type="hidden" name="site"/>
            <input type="hidden" name="folder"/>
            <input type="hidden" name="MAX_FILES_SIZE" value="10000000"/>
        </form>
        <iframe id="upload_frame" name="upload_frame"></iframe>
        <div class="layer dark" id="settings_layer">
            <form class="window" id="settings_form">
                <fieldset class="user">
                    <legend>User</legend>
                    <label for="settings_login"><i class="fa fa-user"></i> Login: </label><input id="settings_login" type="text" name="settings_login"/><br/>
                    <label for="settings_password"><i class="fa fa-key"></i> Password: </label><input id="settings_password" type="text" name="settings_password"/>
                </fieldset>
                <fieldset class="theme">
                    <legend>Theme</legend>
                    <label for="interface_theme"><i class="fa fa-columns"></i> Interface: </label><select id="interface_theme" name="interface_theme"></select><br/>
                    <label for="code_theme"><i class="fa fa-code"></i> Code: </label><select id="code_theme" name="code_theme"></select>
                </fieldset>
                <fieldset>
                    <legend>FTP Connections</legend>
                    <table>
                        <tbody></tbody>
                    </table>
                    <button class="add_ftp"><i class="fa fa-plus-circle"></i> Add site</button>
                </fieldset>
        <fieldset>
            <button class="cancel"><i class="fa fa-caret-left"></i> Cancel</button>
                    <button class="save"><i class="fa fa-save"></i> Save</button>
        </fieldset>
            </form>
        </div>
        <div class="layer dark" id="login_layer">
            <form class="window" id="login_form">
                <label><i class="fa fa-user"></i> Login: <input type="text" name="login"/></label><br/>
                <label><i class="fa fa-key"></i> Password: <input type="password" name="password"/></label>
                <button><i class="fa fa-lock"></i> Login</button>
            </form>
        </div>
        <div class="layer dark" id="about_layer">
            <div class="window">
                <img src="public/img/logo.png"/>
                <p>MangoLight Editor 1.0<br/>by Nicolas Thomas from MangoLight.</p>
                <textarea rows="7" disabled>Copyright <?php print date('Y'); ?> MangoLight / http://www.mangolight.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.</textarea>
                <button class="cancel"><i class="fa fa-caret-left"></i> Ok</button>
            </div>
        </div>
    </body>
</html>