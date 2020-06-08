/*
  Version: 0.0.1
  svgMotion, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE
  
  This is svgMotion (https://michaelsboost.github.io/svgMotion/), A vector animation tool
*/

// variables
var projectName = $("[data-project=name]")[0];
var projectSize = $("[data-project=size]");
var projectFPS  = $("[data-project=fps]").val();
var w, h, htmlCode = "", jsCode = "", projectJSON;
var saveImageFile = function(fileData, fileName) {
      // Get access to the file system
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        // Create the file.
        fileSystem.root.getFile(fileName, { create: true, exclusive: false }, function (entry) {
          // After you save the file, you can access it with this URL
          myFileUrl = entry.toURL();
          entry.createWriter(function(writer) {
            writer.onwriteend = function(evt) {
              swal(
                'Yay!',
                'You\'re character was successfully saved to ' + myFileUrl,
                'success'
              );
            };
            // Write to the file
            writer.write(fileData);
          }, function(error) {
            swal(
              'Oops!',
              'Could not create file writer, ' + error.code,
              'error'
            );
          });
        }, function(error) {
          swal(
            'Oops!',
            'Could not create file, ' + error.code,
            'error'
          );
        });
      }, function(evt) {
        swal(
          'Oops!',
          'Could not access file system, ' + evt.target.error.code,
          'error'
        );
      });
    };

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

/**
 * Create a Image file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function savebase64AsImageFile(filename,content,contentType) {
  // Convert the base64 string in a Blob
  var DataBlob = b64toBlob(content,contentType);

  // Starting to write the file

  // if cordova.file is not available use instead :
  // var folderpath = "file:///storage/emulated/0/";
  var folderpath = cordova.file.externalRootDirectory;
  window.resolveLocalFileSystemURL(folderpath, function(dir) {
    // Access to the directory granted succesfully
    dir.getFile(filename, {create: true, exclusive: false}, function(file) {
      // After you save the file, you can access it with this URL
      myFileUrl = file.toURL();
      // File created succesfully
      file.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(evt) {
          swal(
            'Yay!',
            'You\'re character was successfully saved to ' + myFileUrl,
            'success'
          );
        };
        // Writing content to file
        fileWriter.write(DataBlob);
      }, function(){
        swal(
          'Oops!',
          'Unable to save file in path ' + folderpath,
          'error'
        );
      });
    });
  });
}

function isPhoneGapEnv() {
  // Alternate check to consider instead:
  //  document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1
  return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) ? true : false;
}

// Uncomment next line to disable new PhoneGap related code
//DisableInjectingPhoneGapCode = true;
var phoneGapJsFiles = ['cordova.js', 'js/phonegap-related.min.js'];

// If debugging, may have uncommented tags in index.html to load PhoneGap files so visible to Chrome
// In that case, auto skip loading PhoneGap related JS files here
if( typeof(PhoneGapRelatedJsLoaded) === "boolean" && PhoneGapRelatedJsLoaded ) {
  DisableInjectingPhoneGapCode = true;
} else {
  DisableInjectingPhoneGapCode = false;
}

// If currently running via PhoneGap, load related js code
if( !DisableInjectingPhoneGapCode ) {
  (function(){
    if ( isPhoneGapEnv() ) {
      // Load PhoneGap specific javascript files
      if( !DisableInjectingPhoneGapCode )
      var $head = $("head");
      phoneGapJsFiles.forEach(function (jsFile) {
        try // put here in case of exception due to conflict like if js file already added via html file
        {
          var s = document.createElement("script");
          s.type = "text/javascript";
          s.src = jsFile;
          $head.append(s);
        }
        catch(ex){
        }
      });
    }
  })();
}

function saveFile(content, fileName, onDone) {
  try {
    if( typeof(pgSaveFile) === "function" ) {
      // Assume PhoneGap environment where we use pgSaveFile() underlying function
      return pgSaveFile(content, fileName, function(fileEntry) {
        alert('File saved to: '+fileEntry.fullPath);
        if( typeof(onDone) === "function" ) onDone(true);
      },
      function(reason) {
        if( typeof(onDone) === "function" ) onDone(false);
        alert('File Save Aborted');
      });
    } else {
      saveAs(content, fileName);
      if( typeof(onDone) === "function" ) onDone(true);
    }
  } catch(ex) {
    if( typeof(onDone) === "function" ) onDone(false);
  }
}

// open demos
$("[data-loadJSON]").on("click", function() {
  if ($(".mdl-layout__obfuscator").is(":visible")) {
    $(".mdl-layout__obfuscator").click();
  }
  
  var JSONDemo = $(this)[0].getAttribute("data-loadJSON");
  
  var elm = $("[data-play=animation] .material-icons");
  if (elm.text() === "stop") {
    $("[data-play=animation]").click();
  }
  elm = $("[data-action=hideHubs] .material-icons");
  if (elm.text() === "check_box_outline_blank") {
    $("[data-action=hideHubs]").click();
  }

  var hubs = document.querySelector("[data-grab=hubs]");
  if (hubs.innerHTML) {
    swal({
      title: 'Project Detected!',
      text: "Are you sure you want to clear this?",
      type: 'question',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        loadedJSON = JSONDemos[JSONDemo];
        loadHubs();

        $("[data-file=loaded]").fadeIn();
        $(".vector-container > .table > .cell > h1").remove();

        $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
        $("[data-action=fadeOut]").fadeOut(400, function() {
          $("[data-action=fadeOut]").remove();
        });
      } else {
        return false;
      }
    })
  } else {
    loadedJSON = JSONDemos[JSONDemo];
    loadHubs();

    $("[data-file=loaded]").fadeIn();
    $(".vector-container > .table > .cell > h1").remove();

    $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
    $("[data-action=fadeOut]").fadeOut(400, function() {
      $("[data-action=fadeOut]").remove();
    });
  }
});

// project name show in document title
$("[data-project=name]").on("keyup", function() {
  document.title = "svgMotion: " + this.value;
});

// new/reload
function refresh() {
  swal({
    title: 'Are you sure you want to reload?',
    text: "You will loose all your work and you won't be able to revert this!",
    type: 'warning',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      window.location.href = "./index.html";
    }
  })
}

// enable color picker
$("[data-picker]").minicolors({
  format: "rgb",
  opacity: true,
  show: true,
  position: "bottom left"
}).minicolors("show", true);
document.querySelector("[for=menu-color-picker]").addEventListener("click", function(e) {
  e.stopPropagation();
});

// add a hub
$("[data-add=hub]").click(function(e) {
  if (this.hasAttribute("disabled")) {
    e.preventDefault();
    return false;
  } else {
    if (!$(".vector").html()) {
      alertify.error('Error: No svg file detected!');
    } else {
      var elm = $("[data-action=hideHubs] .material-icons");
      if (elm.text() === "check_box_outline_blank") {
        $("[data-action=hideHubs]").click();
      }
      
      var hubTitle, hubLink, hubDesc, hubSelector, hubSpeed, hubKeys;
      hubTitle = this.textContent.replace(/\n/g, "").replace(/ /g, "");
      hubLink = this.getAttribute("data-link");
      hubDesc = this.getAttribute("data-description");
      hubSelector = "svg > g";
      hubSpeed = "1.5";
      hubKeys = "";
      
      if (hubTitle === "TimelineMax") {
        var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ hubTitle +'</h2>&nbsp;<a href="'+ hubLink +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ hubDesc +'</div><div class="keyplace" data-place="key">'+ hubKeys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div></div>';
        $(this).fadeOut(400);
        $("[data-add=hub]").removeAttr('disabled');
      } else if (hubTitle === ".set") {
        var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ hubTitle +'</h2>&nbsp;<a href="'+ hubLink +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ hubDesc +'</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="'+ hubSelector +'" data-get="selector"></div></div></div><hr></div><div class="keyplace" data-place="key">'+ hubKeys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';
        $(this).fadeOut(400);
        $("[data-add=hub]").removeAttr('disabled');
      } else {
        var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ hubTitle +'</h2>&nbsp;<a href="'+ hubLink +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ hubDesc +'</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="'+ hubSelector +'" data-get="selector"></div></div></div><div class="mdl-cell mdl-cell--2-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="number" class="mdl-textfield__input number" placeholder="speed" min="0" value="'+ hubSpeed +'" data-get="speed"></div></div></div><hr></div><div class="keyplace" data-place="key">'+ hubKeys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';
      }
      
      // append hub
      $("[data-grab=hubs]").append(hubStr);
      draggableHub();
    }
  }
});

// hide Hubs
$("[data-action=hideHubs]").click(function() {
  var elm = $("[data-action=hideHubs] > .material-icons");

  if (elm.text() === "check_box") {
    // show see through icon
    elm.text("check_box_outline_blank");
    
    // hide hubs
    $("[data-grab=hubs] > div").hide();
  } else {
    // If animation is running stop it
    if ($("[data-play=animation] > .material-icons").text() === "stop") {
      $("[data-play=animation]").click();
    }
    
    // reset icon
    elm.text("check_box");
    
    // show hubs
    $("[data-grab=hubs] > div").show();
  }
});

// alert the user feature is coming soon
$("[data-action=comingsoon]").click(function() {
  alertify.log("coming soon...");
  return false;
});

// run hub code
$("[data-play=animation]").click(function() {
  if (!$("[data-grab=hubs]").html()) {
    alertify.error("Abort Operation: No hubs detected!");
    return false;
  }
  var elm = $("[data-play=animation] .material-icons");

  if (elm.text() === "play_arrow") {
    elm.text("stop");
    $("[data-detect=animation]").show();
    if ($("[data-action=hideHubs] .material-icons").text() === "check_box") {
      $("[data-action=hideHubs]").click();
    }
    $("[data-play=animation]").parent().children().not("[data-play=animation], [data-action=refresh]").attr("disabled", true);
    
    getCode();
    setTimeout(jsCode, 1);
    setTimeout(function() {
      var fps = projectFPS;
      var duration = tl.duration();
      var frames   = Math.ceil(duration / 1 * fps);
      var current  = 0;

      // canvas
      var svg  = document.querySelector(".vector svg");
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      if (!projectSize.val()) {
        projectSize.val("800x600");
      }

      var str = projectSize.val();
      w = str.substr(0, str.indexOf('x'));
      h = str.substring(str.length, str.indexOf('x') + 1);
      canvas.width = w;
      canvas.height = h;
      var jsonStr = [];

      function processImage() {
        tl.progress(current++ / frames);

        var xml  = new XMLSerializer().serializeToString(svg);
        var blob = window.btoa(xml);
        var img  = new Image();
        img.src  = "data:image/svg+xml;base64," + blob;

        img.crossOrigin = "Anonymous";
        img.onload = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(this, 0, 0);
          var imgType = canvas.toDataURL("image/png");
          var image = new Image();
          image.src = imgType;
          jsonStr.push(imgType);
          
          // export gif animation
          document.querySelector("[data-export=gif]").onclick = function() {
            if ($("[data-action=hideHubs] .material-icons").text() === "check_box") {
              $("[data-action=hideHubs]").click();
            }
            
            $("#menu-hub-types").attr("disabled", true);
            
            $(".vector").addClass("hide").parent().append('<div class="preloader" data-show="preloader"><svg viewBox="0 0 600 150"><text y="93.75" x="75" style="line-height:125%;" font-weight="400" font-size="80" font-family="Lato" letter-spacing="0" word-spacing="0" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><tspan>Creating GIF</tspan></text></svg></div>');

            gifshot.createGIF({
              images: jsonStr,
              gifWidth: canvas.width,
              gifHeight: canvas.height,
              interval: fps / 1000, // seconds
              progressCallback: function(captureProgress) { console.log('progress: ', captureProgress); },
              completeCallback: function() { console.log('completed!!!'); },
              numWorkers: 2,
              },function(obj) {
                if(!obj.error) {
//                var a = document.createElement("a");
//                a.href = obj.image;
//                var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
//                if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
//                  projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
//                }
//                a.download = projectname;
//                a.target = "_blank";
//                a.click();
                  
                  
                /** Process the type1 base64 string **/
                // var myBase64 = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                var myBase64 = obj.image;

                // Split the base64 string in data and contentType
                var block = myBase64.split(";");
                // Get the content type
                var dataType = block[0].split(":")[1]; // In this case "image/png"
                // get the real base64 content of the file
                var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

                var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
                if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
                  projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
                }
                savebase64AsImageFile(projectname,realData,dataType);
                
//                $("[data-show=preloader]").remove();
                $("#menu-hub-types").removeAttr("disabled");
                $(".vector").removeClass("hide");
              }
            });
          };
          
          // export image sequence
          document.querySelector("[data-export=sequence]").onclick = function() {
            var zip = new JSZip();

            for (var i = 0; i < jsonStr.length; i++) {
              zip.file("frame-"+[i]+".png", jsonStr[i].split('base64,')[1],{base64: true});
            }

            var content = zip.generate({type:"blob"});
            var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
            if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
              projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
            }
            saveFile(content, projectname + ".zip");
          };
        };

        if (current <= frames) {
          processImage();
        } else {
          tl.play(0).timeScale(1);
        }
      }
      processImage();
    }, 2);
  } else {
    $("[data-play=animation]").parent().children().not("[data-play=animation], [data-action=refresh]").attr("disabled", false);
    
    // stop animation
    // reset initial svg code
    $(".vector").html("").html(htmlCode);
    
    // reset icon
    elm.text("play_arrow");
    $("[data-detect=animation]").hide();
  }
});

// is disabled
$("[data-disabled]").click(function(e) {
  alertify.log('Not available in demos');
});

// delete a hub
function deleteHub(e) {
  $(e).parent().parent().remove();
}

// add key
function addKey(e) {
  if (e.hasAttribute("data-disabled")) {
    alertify.log('Not available in demos');
  } else {
    var val = $(e).parent().find("input").val();
    if (!val.replace(/ /g, "")) {
      // alertify.error("Error: Value is empty!");
    } else {
      val = val.replace(/ /g, "");
      // check if key already exists
      var str = $(e).parent().prev().find("span").text().toLowerCase();
      if (val === str.substr(0, str.length - 1)) {
        alertify.error("Error: Same key detected!");
        return false;
      } else {
        $(e).parent().prev().append('<div class="mdl-card__actions mdl-card--border">\n<div class="mdl-card__actions"><span>'+ val +':</span> &nbsp;\n<div class="mdl-textfield__input w100p tc" contenteditable></div>\n<div class="mdl-layout-spacer"></div>\n<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="deleteKey(this)">\n<i class="material-icons">clear</i>\n</button>\n</div>\n</div>');
        $(e).parent().find("input").val("");
        $(e).parent().prev().scrollTop($(e).parent().prev().prop("scrollHeight"));
//        $(window).scrollTop($(document).height());
        $(e).parent().prev().find("div[contenteditable]:last").focus();
        e.preventDefault();
      }
    }
  }
}
function enterKey(e) {
  // look for window.event in case event isn't passed in
  e = e || window.event;
  if (e.keyCode == 13) {
    e.target.parentNode.parentNode.querySelector("[data-action=addKey]").click();
    e.preventDefault();
    return false;
  }
  return true;
};

// delete key
function deleteKey(e) {
  $(e).parent().parent().remove();
}

// clone a hub
function cloneHub(e) {
  $(e).parent().parent().clone().appendTo(".mdl-layout__content [data-grab=hubs]");
  draggableHub();

  $("[contenteditable]").blur(function(){
    var $element = $(this);
    if ($element.html().length && !$element.text().trim().length) {
      $element.empty();
    }
  });
}

// make hub draggable
function draggableHub() {
  $("[data-action=draggable]").draggable({
    handle: "[data-action=move]",
    stack: $("[data-action=draggable]")
  });
}
draggableHub();
$("[data-grab=hubs] div").on("mousedown touchstart", function() {
  $("[data-grab=hubs] div").css("z-index", "0");
  $(this).css("z-index", $("[data-grab=hubs]").length);
});

// for contenteditable placeholders
$("[contenteditable]").blur(function(){
  var $element = $(this);
  if ($element.html().length && !$element.text().trim().length) {
    $element.empty();
  }
});

// extra dropdown menu options
var loadedJSON = {};
function loadHubs() {
  $(".vector-container > .table > .cell > h1").remove();
  $("[data-grab=hubs]").empty();
  
  for (var i = 0; i < loadedJSON.hubs.length; i++) {
    if (loadedJSON.hubs[i].title === "TimelineMax") {
      var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ loadedJSON.hubs[i].title +'</h2>&nbsp;<a href="'+ loadedJSON.hubs[i].link +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ loadedJSON.hubs[i].description +'</div><div class="keyplace" data-place="key">'+ loadedJSON.hubs[i].keys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div></div>';
    } else if (loadedJSON.hubs[i].title === ".set") {
      var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ loadedJSON.hubs[i].title +'</h2>&nbsp;<a href="'+ loadedJSON.hubs[i].link +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ loadedJSON.hubs[i].description +'</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="'+ loadedJSON.hubs[i].selector +'" data-get="selector"></div></div></div><hr></div><div class="keyplace" data-place="key">'+ loadedJSON.hubs[i].keys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';
    } else {
      var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ loadedJSON.hubs[i].title +'</h2>&nbsp;<a href="'+ loadedJSON.hubs[i].link +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ loadedJSON.hubs[i].description +'</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="'+ loadedJSON.hubs[i].selector +'" data-get="selector"></div></div></div><div class="mdl-cell mdl-cell--2-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="number" class="mdl-textfield__input number" placeholder="speed" min="0" value="'+ loadedJSON.hubs[i].speed +'" data-get="speed"></div></div></div><hr></div><div class="keyplace" data-place="key">'+ loadedJSON.hubs[i].keys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';
    }

    // append hub
    $("[data-grab=hubs]").append(hubStr);

    if (loadedJSON.MotionPathPlugin === "enabled") {
      $("#toggleMotionPathPlugin").attr("checked", false).click();
    } else {
      $("#toggleMotionPathPlugin").attr("checked", true).click();
    }
    
    $(".vector").html(loadedJSON.svg);
    projectName.value = loadedJSON.settings[0].name;
    projectSize[0].value = loadedJSON.settings[0].size;
    $("[data-project=fps]")[0].value = loadedJSON.settings[0].fps;
    $("[data-project=notepad]")[0].value = loadedJSON.settings[0].notepad;
    draggableHub();

    // add key via enterkey
    $("[data-enter=click]").on("keydown", function(e) {
      // look for window.event in case event isn't passed in
      e = e || window.event;
      if (e.keyCode == 13) {
        this.parentNode.parentNode.querySelector("[data-action=addKey]").click();
        return false;
      }
      return true;
    });
  }
  
  // remove TimelineMax hub after hubs have been loaded in
  if ($("[data-add=hub]")[0].textContent.trim() === "TimelineMax") {
    $("[data-add=hub]")[0].remove();
  }
  $("[data-add=hub]").removeAttr('disabled');
  
  setTimeout(function() {
    $("[data-project=name]").trigger("keyup");
  }, 1);
}
function getProjectJSON() {
  if (toggleMotionPathPlugin.checked) {
    pluginStatus = "enabled";
  } else {
    pluginStatus = "disabled";
  }

  projectJSON = {
    "MotionPathPlugin": pluginStatus,
    "svg": $(".vector").html(),
    "settings": [{
      "name": projectName.value,
      "size": projectSize[0].value,
      "fps": $("[data-project=fps]")[0].value,
      "notepad": $("[data-project=notepad]")[0].value
    }],
    "hubs" : []
  };

  $("[data-grab=hubs] > div").each(function() {
    projectJSON.hubs.push({
      "title": $(this).find(".mdl-card__title-text").html(),
      "link": $(this).find(".mdl-card__title > a").attr('href'),
      "description": $(this).find(".mdl-card__supporting-text").text(),
      "selector": $(this).find("[data-get=selector]").val(),
      "speed": $(this).find("[data-get=speed]").val(),
      "keys": $(this).find("[data-place=key]").html()
    });
  });
};

$.fn.ignore = function(sel) {
  return this.clone().find(sel||">*").remove().end();
};
function onlyNumbers(e) {
  var x = event.charCode || event.keyCode;
  if (isNaN(String.fromCharCode(e.which)) && x!=46 || x===32 || x===13 || (x===46 && event.currentTarget.innerText.includes('.'))) e.preventDefault();
}

// load svg file on click
$("[data-call=openfile]").on("click", function() {
  $("[data-input=openfile]").trigger("click");
});

// load svg file functions
function loadfile(input) {
  var reader = new FileReader();
  var path = input.value;
  reader.onload = function(e) {
    if (path.toLowerCase().substring(path.length - 4) === ".svg") {
      var elm = $("[data-play=animation] .material-icons");
      if (elm.text() === "stop") {
        $("[data-play=animation]").click();
      }
      elm = $("[data-action=hideHubs] .material-icons");
      if (elm.text() === "check_box_outline_blank") {
        $("[data-action=hideHubs]").click();
      }
      
      var hubs = document.querySelector("[data-grab=hubs]");
      if (hubs.innerHTML) {
        swal({
          title: 'Hubs Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            hubs.innerHTML = "";
            $("[data-add=hub]").show().not("[data-add=hub]:first").attr('disabled', "true");
          }
        })
      }

      document.querySelector("[data-output=svg]").innerHTML = e.target.result;
      imageLoaded();
    } else if (path.toLowerCase().substring(path.length - 5) === ".json") {
      var elm = $("[data-play=animation] .material-icons");
      if (elm.text() === "stop") {
        $("[data-play=animation]").click();
      }
      elm = $("[data-action=hideHubs] .material-icons");
      if (elm.text() === "check_box_outline_blank") {
        $("[data-action=hideHubs]").click();
      }
      
      var hubs = document.querySelector("[data-grab=hubs]");
      if (hubs.innerHTML) {
        swal({
          title: 'Project Detected!',
          text: "Are you sure you want to clear this?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            loadedJSON = JSON.parse(e.target.result);
            loadHubs();
      
            $("[data-file=loaded]").fadeIn();
            $(".vector-container > .table > .cell > h1").remove();

            $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
            $("[data-action=fadeOut]").fadeOut(400, function() {
              $("[data-action=fadeOut]").remove();
            });
          } else {
            return false;
          }
        })
      } else {
        loadedJSON = JSON.parse(e.target.result);
        loadHubs();
      
        $("[data-file=loaded]").fadeIn();
        $(".vector-container > .table > .cell > h1").remove();

        $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
        $("[data-action=fadeOut]").fadeOut(400, function() {
          $("[data-action=fadeOut]").remove();
        });
      }
    } else {
      alertify.error("Sorry that file type is not supported. .svg and .json files only!");
    }
  };
  reader.readAsText(input.files[0]);
};
function dropfile(file) {
  var reader = new FileReader();  
  reader.onload = function(e) {
    if (file.type === "image/svg+xml") {
      var elm = $("[data-play=animation] .material-icons");
      if (elm.text() === "stop") {
        $("[data-play=animation]").click();
      }
      elm = $("[data-action=hideHubs] .material-icons");
      if (elm.text() === "check_box_outline_blank") {
        $("[data-action=hideHubs]").click();
      }
      
      var hubs = document.querySelector("[data-grab=hubs]");
      if (hubs.innerHTML) {
        swal({
          title: 'Hubs Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            hubs.innerHTML = "";
            $("[data-add=hub]").show().not("[data-add=hub]:first").attr('disabled', "true");
          }
        })
      }

      document.querySelector("[data-output=svg]").innerHTML = e.target.result;
      imageLoaded();
    } else if (file.type === "application/json") {
      var elm = $("[data-play=animation] .material-icons");
      if (elm.text() === "stop") {
        $("[data-play=animation]").click();
      }
      elm = $("[data-action=hideHubs] .material-icons");
      if (elm.text() === "check_box_outline_blank") {
        $("[data-action=hideHubs]").click();
      }
      
      var hubs = document.querySelector("[data-grab=hubs]");
      if (hubs.innerHTML) {
        swal({
          title: 'Project Detected!',
          text: "Are you sure you want to clear this?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            loadedJSON = JSON.parse(e.target.result);
            loadHubs();
      
            $("[data-file=loaded]").fadeIn();
            $(".vector-container > .table > .cell > h1").remove();

            $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
            $("[data-action=fadeOut]").fadeOut(400, function() {
              $("[data-action=fadeOut]").remove();
            });
          } else {
            return false;
          }
        })
      } else {
        loadedJSON = JSON.parse(e.target.result);
        loadHubs();
      
        $("[data-file=loaded]").fadeIn();
        $(".vector-container > .table > .cell > h1").remove();

        $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
        $("[data-action=fadeOut]").fadeOut(400, function() {
          $("[data-action=fadeOut]").remove();
        });
      }
    } else {
      alertify.error("Sorry that file type is not supported. .svg and .json files only!");
    }
  }        
  reader.readAsText(file,"UTF-8"); 
};
function imageLoaded() {
  // locate SVG
  if (document.querySelector("[data-output=svg] > svg")) {
    // remove width/height attributes if detected
    if (document.querySelector("[data-output=svg] > svg").getAttribute("width") || document.querySelector("[data-output=svg] > svg").getAttribute("height")) {
      w = document.querySelector("[data-output=svg] > svg").getAttribute("width");
      w = parseFloat(w, 10);
      h = document.querySelector("[data-output=svg] > svg").getAttribute("height");
      h = parseFloat(h, 10);
      projectSize.val(w + "x" + h).trigger('change');
      document.querySelector("[data-output=svg] > svg").removeAttribute("width");
      document.querySelector("[data-output=svg] > svg").removeAttribute("height");
      alertify.log("Width/Height attributes removed for background display.");
    }
    
    $("[data-output=svg] > svg *").removeAttr("vector-effect");
    
    $("[data-file=loaded]").fadeIn();
    $(".vector-container > .table > .cell > h1").remove();

    $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
    $("[data-action=fadeOut]").fadeOut(400, function() {
      $("[data-action=fadeOut]").remove();
    });
    $("[data-project=name]").trigger("keyup");
  } else {
    alertify.error("Error: No svg element detected!");
  }
}

// load svg file once clicked
$("[data-input=openfile]").on("change", function() {
  loadfile(this);
});

// load svg file on drop
document.addEventListener("dragover", function(e) {
  e.preventDefault();
});
document.addEventListener("drop", function(e) {
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  dropfile(file);
});

// open/close project settings
TweenMax.set("[data-projectSettings]", {xPercent:-50, left:"50%", yPercent:-50, top:"50%", position: "absolute"});
$("[data-open=projectSettings]").click(function() {
  var elm = $("[data-play=animation] .material-icons");
  if (elm.text() === "stop") {
    $("[data-play=animation]").click();
  }
  
  $(".projectsettingsbg").fadeIn();
  $("[data-projectSettings]").fadeIn();
});
$("[data-close=projectSettings]").click(function() {
  $(".projectsettingsbg").fadeOut();
  $("[data-projectSettings]").fadeOut();
});

// open/close selector dialog
$("[data-open=selector]").click(function() {
  var elm = $("[data-play=animation] .material-icons");
  if (elm.text() === "stop") {
    $("[data-play=animation]").click();
  }
  elm = $("[data-action=hideHubs] .material-icons");
  if (elm.text() === "check_box") {
    $("[data-action=hideHubs]").click();
  }
  
  $("[data-selector]").show().css({
    "bottom": "50%"
  });
  $(".vector-container").css({
    "top": "50%"
  });
  
  $(".mdl-layout__container, .mdl-layout, .mdl-layout__content").hide();
  if (!$("[data-selected]").is(":visible")) {
    if ($("[data-set=class]").val()) {
      $(".vector ." + $("[data-set=class]").val()).attr("data-selected", "");
    } else {
      $(".vector svg").find(":first").attr("data-selected", "");
    }
    selectionSurroundings();
  }
});
$("[data-close=selector]").click(function() {
  $("[data-selector]").hide().css({
    "bottom": "0"
  });
  $(".mdl-layout__container, .mdl-layout, .mdl-layout__content").show();
  $(".vector-container").css({
    "top": 0
  });
  $(".vector [data-selected]").removeAttr("data-selected");
});

// function to see if selection has any surrounding elements
function selectionSurroundings() {
  // is first child
  if ($("[data-selected]").is(":visible")) {
    if (!$("[data-selected]").is(":first-child")) {
      $("[data-find=prev]").prop("disabled", false);
    } else {
      $("[data-find=prev]").prop("disabled", true);
    }

    // is last child
    if (!$("[data-selected]").is(":last-child")) {
      $("[data-find=next]").prop("disabled", false);
    } else {
      $("[data-find=next]").prop("disabled", true);
    }

    // check parent
    if ($("[data-selected]").parent().prop("tagName").toLowerCase() != "svg") {
      $("[data-find=parent]").prop("disabled", false);
    } else {
      $("[data-find=parent]").prop("disabled", true);
    }
    
    // check children
    if ($("[data-selected]")[0].hasChildNodes()) {
      $("[data-find=child]").prop("disabled", false);
    } else {
      $("[data-find=child]").prop("disabled", true);
    }
    
    $("[data-getTag]").text($("[data-selected]").prop("tagName"));
    $("[data-set=class]").val($("[data-selected]").attr("class"));
    getAttributes("[data-selected]");
  }
};
$("[data-find=prev]").click(function() {
  $("[data-selected]").prev().addClass("svgMotion-selected");
  $("[data-selected]").removeAttr("data-selected");
  $(".svgMotion-selected").attr("data-selected", "").removeClass("svgMotion-selected");
  
  selectionSurroundings();
});
$("[data-find=next]").click(function() {
  $("[data-selected]").next().addClass("svgMotion-selected");
  $("[data-selected]").removeAttr("data-selected");
  $(".svgMotion-selected").attr("data-selected", "").removeClass("svgMotion-selected");
  
  selectionSurroundings();
});
$("[data-find=parent]").click(function() {
  $("[data-selected]").parent().addClass("svgMotion-selected");
  $("[data-selected]").removeAttr("data-selected");
  $(".svgMotion-selected").attr("data-selected", "").removeClass("svgMotion-selected");
  
  selectionSurroundings();
});
$("[data-find=child]").click(function() {
  $("[data-selected]").children(":first").addClass("svgMotion-selected");
  $("[data-selected]").removeAttr("data-selected");
  $(".svgMotion-selected").attr("data-selected", "").removeClass("svgMotion-selected");
  
  selectionSurroundings();
});

// get selected objects attributes
function getAttributes(e) {
  $("[data-attributes]").empty();
  $(e).each(function() {
    $.each(this.attributes, function() {
      // this.attributes is not a plain object, but an array
      // of attribute nodes, which contain both the name and value
      if(this.specified) {
        if (this.name === "data-selected") {
          // don't do anything if this attribute is found, move to next
        } else if (this.name === "class") {
          // don't do anything if this attribute is found, move to next
        } else {
          $("[data-attributes]").append('<h2 class="headline-secondary--grouped nomar"><span>'+ this.name +':&nbsp;</span>\n<span>'+ this.value +'</span><hr></h2>');
        }
      }
    });
  });
}

// select vector object
$(".vector svg").on("click mouseup touchend", function(e) {
  $("[data-selected]").removeAttr("data-selected");
  $(e.target).attr("data-selected", "");
  selectionSurroundings();
  return false;
});

// set/change selected object's class
$("[data-set=class]").on("keyup", function(e) {
  if ($("[data-selected]").is(":visible")) {
    this.value = this.value.replace(/ /g, "");
    $("[data-selected]").attr("class", this.value);
  } else {
    alertify.error("Error: Selected object not found");
  }
});
$("[data-set=class]").on("keydown", function(e) {
  // classes cannot start with a number
  if (e.which >= 48 && e.which <= 57) {
    if (!this.value) {
      alertify.error("Error: Classes cannot start with a number!");
      e.preventDefault();
    }
  }
});

// export files
function getCode() {
  // clear full code string
  jsCode = "";

  // play animation
  htmlCode = $(".vector").html();
  
  // check if MotionPathPlugin is enabled
  if (toggleMotionPathPlugin.checked) {
    var placePlugin = "gsap.registerPlugin(MotionPathPlugin)\n\n";
  } else {
    var placePlugin = "";
  }

  var hubs = document.querySelectorAll("[data-grab=hubs] > div");
  if (hubs[0].querySelector("h2").textContent != "TimelineMax") {
    alertify.error('Abort Operation: First hub MUST be "TimelineMax"!');
    return false;
  }

  for (var i = 0; i < hubs.length; i++) {
    var hubType = hubs[i].querySelector("h2").textContent;
    var hubKeyStr = hubs[i].querySelector("[data-place=key]").textContent.toString().replace(/\n/g, "").replace(/clear/g, ",\n");
    var hubKeys = hubKeyStr.substr(0, hubKeyStr.length - 2);
    if (hubType === ".set") {
      var hubSelector = hubs[i].querySelector("[data-get=selector]").value;
      var codeStr = hubType + '(".vector '+ hubSelector +'", { '+ hubKeys +' }, 0)\n';
    } else if (i > 0) {
      var hubSelector = hubs[i].querySelector("[data-get=selector]").value;
      var hubSpeed = hubs[i].querySelector("[data-get=speed]").value;
      var codeStr = hubType + '(".vector '+ hubSelector +'", '+ hubSpeed +', { '+ hubKeys +' }, 0)\n';
    } else {
      var codeStr = placePlugin + 'var tl = new TimelineMax({ '+ hubKeys +' })\n';
    }
    jsCode += codeStr;
  }
}
function saveCode(filename) {
  JSZipUtils.getBinaryContent("zips/gsap-public.zip", function(err, data) {
    if(err) {
      throw err // or handle err
    }

    var zip = new JSZip();

    // Put all application files in subfolder for shell script
    var zipFolder = zip.folder("libraries");
    zipFolder.load(data);

    zip.file("index.html", '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1">\n  </head>\n  <body>\n    <div class="vector">'+ htmlCode +'</div>\n    \n    <script src="libraries/gsap-public/minified/gsap.min.js"></script>\n    <script src="libraries/gsap-public/minified/EasePack.min.js"></script>\n    <script src="libraries/gsap-public/minified/MotionPathPlugin.min.js"></script>\n    <script src="libraries/gsap-public/minified/TextPlugin.min.js"></script>\n    <script src="libraries/gsap-public/minified/CSSRulePlugin.min.js"></script>\n    <script src="js/animation.js"></script>\n  </body>\n</html>');

    var endCodeStr = 'var fps = '+ projectFPS +';\nvar duration = tl.duration();\nvar frames   = Math.ceil(duration / 1 * fps)\ntl.play(0).timeScale(1);'
    jsCode += endCodeStr;

    zip.file("js/animation.js", jsCode);
    var content = zip.generate({type:"blob"});
    saveFile(content, filename + ".zip");
  });
}
$("[data-export=zip]").click(function() {
  // if animation is playing stop it
  var elm = $("[data-play=animation] .material-icons");
  if (elm.text() === "stop") {
    // stop animation from playing...
    $("[data-play=animation]").trigger("click");
    getCode();
    var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
    if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
      projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
    }
  } else {
    getCode();
    var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
    if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
      projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
    }
    saveCode(projectname);
  }
});
$("[data-export=json]").click(function() {
  // if animation is playing stop it
  var elm = $("[data-play=animation] .material-icons");
  if (elm.text() === "stop") {
    // stop animation from playing...
    $("[data-play=animation]").trigger("click");
    getProjectJSON();
    var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
    if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
      projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
    }
  } else {
    getProjectJSON();
    var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
    if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
      projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
    }
    var blob = new Blob([JSON.stringify(projectJSON)], {type: "application/json;charset=utf-8"});
    saveFile(blob, projectname + ".json");
  }
});