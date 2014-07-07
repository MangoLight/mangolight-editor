/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/theme/mangolight', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-mangolight";
exports.cssText = ".ace-mangolight .ace_gutter {\
background-image: url(\"public/img/bg.png\");\
background-color:#111;\
color: #777;\
}\
.ace-mangolight .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-mangolight .ace_scroller {\
background-color: #1A1A1A\
}\
.ace-mangolight .ace_text-layer {\
color: #F8F8F2;\
background-image: url(\"public/img/bg.png\");\
}\
.ace-mangolight .ace_cursor {\
border-left: 2px solid #F8F8F0\
}\
.ace-mangolight .ace_overwrite-cursors .ace_cursor {\
border-left: 0px;\
border-bottom: 1px solid #F8F8F0\
}\
.ace-mangolight .ace_marker-layer .ace_selection {\
background: yellow;\
opacity:0.3\
}\
.ace-mangolight.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #272822;\
border-radius: 2px\
}\
.ace-mangolight .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-mangolight .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E;\
box-shadow:0 0 4px yellow;\
}\
.ace-mangolight .ace_marker-layer .ace_active-line {\
background: #292929!important;\
}\
.ace-mangolight .ace_gutter-active-line {\
background-color: #292929;\
}\
.ace-mangolight .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E;\
box-shadow:0 0 4px yellow\
}\
.ace-mangolight .ace_invisible {\
color: #49483E\
}\
.ace_operator,.ace_php_tag{\
color:red;\
}\
.ace-mangolight .ace_entity.ace_name.ace_tag,\
.ace-mangolight .ace_meta,\
.ace-mangolight .ace_storage {\
color: #193596;\
font-weight:bold;\
}\
.ace-mangolight .ace_keyword{\
color: /*#fbf0ab*/#1965CB;\
font-weight:bold;\
font-style:italic;\
}\
.ace-mangolight .ace_constant.ace_character,\
.ace-mangolight .ace_constant.ace_language,\
.ace-mangolight .ace_constant.ace_other {\
color: #AE81FF\
}\
.ace-mangolight .ace_constant.ace_numeric{\
color:#AE81FF;\
}\
.ace-mangolight .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-mangolight .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-mangolight .ace_support.ace_function {\
color: #e6bc75\
}\
.ace-mangolight .ace_support.ace_constant{\
color:#ba8617;\
}\
.ace_constant{\
color:#F2F200;\
}\
.ace-mangolight .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-mangolight .ace_storage.ace_type,\
.ace-mangolight .ace_support.ace_class{\
color: #214CBC\
}\
.ace-mangolight .ace_support.ace_type {\
color:#666;\
}\
.ace-mangolight .ace_entity.ace_name.ace_function,\
.ace-mangolight .ace_entity.ace_other.ace_attribute-name{\
color: #F2F200;\
}\
.ace_identifier{\
color:#e6bc75;\
}\
.ace-mangolight .ace_variable {\
color: #FF3300;\
font-weight:bold;\
font-style:italic;\
}\
.ace-mangolight .ace_variable.ace_parameter {\
font-style: italic;\
color: #FD971F\
}\
.ace-mangolight .ace_string {\
color: #CB650E\
}\
.ace-mangolight .ace_comment {\
color: #1D811D;\
font-stretch: condensed;\
}\
.ace-mangolight .ace_markup.ace_underline {\
text-decoration: underline\
}\
.ace-mangolight .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNQ11D6z7Bq1ar/ABCKBG6g04U2AAAAAElFTkSuQmCC) right repeat-y\
}\
.ace-mangolight.ace_autocomplete{\
background:#222;\
border-top:1px solid #666;\
border-left:1px solid #666;\
border-right:1px solid #111;\
border-bottom:1px solid #111;\
box-shadow:1px 1px 5px black;\
max-width:400px!important;\
}\
.ace-mangolight .ace_text-layer{\
color:#666;\
}\
.ace-mangolight.ace_editor.ace_autocomplete .ace_completion-highlight{\
color:#888;\
}\
.ace-mangolight .ace_rightAlignedText{\
display:none;\
}\
.ace-mangolight.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line{\
background-color:#333;\
}\
.ace_line-hover{\
border:none!important;\
background:#444!important;\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
