// variables
var w = 100, h = 100, htmlCode = "", jsCode = "";
var loadHubs = { 
  "svg": $(".vector").html(),
  "settings": [{
  	"width": "1080",
  	"height": "1080",
    "fps": "30"
  }],
  "hubs" : [{
    "title": ".from",
    "link": "https://greensock.com/docs/v2/TweenMax/static.from()",
    "description": "[static] Static method for creating a TweenMax instance that tweens backwards - you define the BEGINNING values and the current values are used as the destination values which is great for doing things like animating objects onto the screen because you can set them up initially the way you want them to look at the end of the tween and then animate in from elsewhere.",
    "selector": "svg > g > g",
    "speed": "1.5",
    "keys": ""
  }, {
    "title": ".to",
    "link": "https://greensock.com/docs/v2/TweenMax/static.to()",
    "description": "[static] Static method for creating a TweenMax instance that animates to the specified destination values (from the current values).",
    "selector": "svg > g > g:nth-child(4) > g",
    "speed": "2.0",
    "keys": ""
  }]
};
//loadHubs.settings[0].width
function loadHubsTest() {
  $("[data-grab=hubs]").empty();
  
  for (var i = 0; i < loadHubs.hubs.length; i++) {
    var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ loadHubs.hubs[i].title +'</h2>&nbsp;<a href="'+ loadHubs.hubs[i].link +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ loadHubs.hubs[i].description +'</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="'+ loadHubs.hubs[i].selector +'" data-get="selector"></div></div></div><div class="mdl-cell mdl-cell--2-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="number" class="mdl-textfield__input number" placeholder="speed" min="0" value="'+ loadHubs.hubs[i].speed +'" data-get="speed"></div></div></div><hr></div><div class="keyplace" data-place="key">'+ loadHubs.hubs[i].keys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';

    // append hub
    $("[data-grab=hubs]").append(hubStr);
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
}

$.fn.ignore = function(sel) {
  return this.clone().find(sel||">*").remove().end();
};
function onlyNumbers(e) {
  var x = event.charCode || event.keyCode;
  if (isNaN(String.fromCharCode(e.which)) && x!=46 || x===32 || x===13 || (x===46 && event.currentTarget.innerText.includes('.'))) e.preventDefault();
}

// load svg file on click
$("[data-call=openfile]").click(function() {
  $("[data-input=openfile]").trigger("click");
});

// load svg file functions
function loadfile(input) {
  var reader = new FileReader();
  var path = input.value;
  reader.onload = function(e) {
    if (path.toLowerCase().substring(path.length - 4 === ".svg")) {
      document.querySelector("[data-output=svg]").innerHTML = e.target.result;
      imageLoaded();
    } else {
      alertify.error("Sorry that file type is not supported. Please only load .svg files.");
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
    } else {
      alertify.error("Sorry that file type is not supported. Please only load .svg files.");
    }
  }        
  reader.readAsText(file,"UTF-8"); 
};
function imageLoaded() {
  // locate SVG
  if (document.querySelector("[data-output=svg] > svg")) {
    // remove width/height attributes if detected
    if (document.querySelector("[data-output=svg] > svg").getAttribute("width") || document.querySelector("[data-output=svg] > svg").getAttribute("height")) {
      document.querySelector("[data-output=svg] > svg").removeAttribute("width");
      document.querySelector("[data-output=svg] > svg").removeAttribute("height");
      alertify.log("Width/Height attributes removed for background display.");
    }
    
    $("[data-file=loaded]").fadeIn();
    $("[data-call=openfile]").parent().remove();

    $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
    $("[data-action=fadeOut]").fadeOut(400, function() {
      $("[data-action=fadeOut]").remove();
    });
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
    
    getCode();
    setTimeout(jsCode, 1);
    setTimeout(function() {
      var fps = 30;
      var duration = tl.duration();
      var frames   = Math.ceil(duration / 1 * fps);
      var current  = 0;

      // canvas
      var svg  = document.querySelector(".vector svg");
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
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
                  swal({
                    title: 'File name below!',
                    input: 'text',
                    inputPlaceholder: ".gif is added on save",
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    showLoaderOnConfirm: true
                  }).then((result) => {
                    if (result.value) {
                      var a = document.createElement("a");
                      a.href = obj.image;
                      a.download = result.value;
                      a.target = "_blank";
                      a.click();
                      
                      swal(
                        'Yay!',
                        'You\'re GreenSock Animation was successfully saved!',
                        'success'
                      );
                    } else {
                      swal(
                        'Oops!',
                        console.error().toString(),
                        'error'
                      );
                    }
                  });
                
                $("[data-show=preloader]").remove();
                $(".vector").removeClass("hide")
              }
            });
          };
          
          // export image sequence
          document.querySelector("[data-export=sequence]").onclick = function() {
            var zip = new JSZip();

            for (var i = 0; i < jsonStr.length; i++) {
              zip.file("frame-"+[i]+".png", jsonStr[i].split('base64,')[1],{base64: true});
            }

            // export zip
            swal({
              title: 'File name below!',
              input: 'text',
              inputPlaceholder: ".zip is added on save",
              showCancelButton: true,
              confirmButtonText: 'Save',
              showLoaderOnConfirm: true
            }).then((result) => {
              if (result.value) {
                var content = zip.generate({type:"blob"});
                saveAs(content, result.value + ".zip");

                swal(
                  'Yay!',
                  'You\'re GreenSock Animation was successfully saved!',
                  'success'
                );
              } else {
                swal(
                  'Oops!',
                  console.error().toString(),
                  'error'
                );
              }
            });
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
    // stop animation
    // reset initial svg code
    $(".vector").html("").html(htmlCode);
    
    // reset icon
    elm.text("play_arrow");
    $("[data-detect=animation]").hide();
  }
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
      } else {
        var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ hubTitle +'</h2>&nbsp;<a href="'+ hubLink +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ hubDesc +'</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="'+ hubSelector +'" data-get="selector"></div></div></div><div class="mdl-cell mdl-cell--2-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="number" class="mdl-textfield__input number" placeholder="speed" min="0" value="'+ hubSpeed +'" data-get="speed"></div></div></div><hr></div><div class="keyplace" data-place="key">'+ hubKeys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';
      }
      
      // append hub
      $("[data-grab=hubs]").append(hubStr);
      draggableHub();
    }
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

// for contenteditable placeholders
$("[contenteditable]").blur(function(){
  var $element = $(this);
  if ($element.html().length && !$element.text().trim().length) {
    $element.empty();
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
    // reset icon
    elm.text("check_box");
    
    // show hubs
    $("[data-grab=hubs] > div").show();
  }
});

// export files
function getCode() {
  // clear full code string
  jsCode = "";

  // play animation
  htmlCode = $(".vector").html();

  var hubs = document.querySelectorAll("[data-grab=hubs] > div");
  if (hubs[0].querySelector("h2").textContent != "TimelineMax") {
    alertify.error('Abort Operation: First hub MUST be "TimelineMax"!');
    return false;
  }

  for (var i = 0; i < hubs.length; i++) {
    var hubType = hubs[i].querySelector("h2").textContent;
    var hubKeyStr = hubs[i].querySelector("[data-place=key]").textContent.toString().replace(/ /g, "").replace(/\n/g, "").replace(/clear/g, ",\n");
    var hubKeys = hubKeyStr.substr(0, hubKeyStr.length - 2);
    if (i > 0) {
      var hubSelector = hubs[i].querySelector("[data-get=selector]").value;
      var hubSpeed = hubs[i].querySelector("[data-get=speed]").value;
      var codeStr = hubType + '(".vector '+ hubSelector +'", '+ hubSpeed +', { '+ hubKeys +' }, 0)\n';
    } else {
      var codeStr = 'var tl = new TimelineMax({ '+ hubKeys +' })\n';
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

    var endCodeStr = 'var fps = 30;\nvar duration = tl.duration();\nvar frames   = Math.ceil(duration / 1 * fps)\ntl.play(0).timeScale(1);'
    jsCode += endCodeStr;

    zip.file("js/animation.js", jsCode);
    var content = zip.generate({type:"blob"});
    saveAs(content, filename + ".zip");
  });
}
function saveDialog() {
  swal({
    title: 'File name below!',
    input: 'text',
    inputPlaceholder: ".zip is added on save",
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true
  }).then((result) => {
    if (result.value) {
      getCode();
      saveCode(result.value);

      swal(
        'Yay!',
        'You\'re GreenSock Animation was successfully saved!',
        'success'
      );
    } else {
      swal(
        'Oops!',
        console.error().toString(),
        'error'
      );
    }
  });
}
$("[data-export=zip]").click(function() {
  // if animation is playing stop it
  var elm = $("[data-play=animation] .material-icons");
  if (elm.text() === "stop") {
    // stop animation from playing...
    $("[data-play=animation]").trigger("click");
    saveDialog();
  } else {
    saveDialog();
  }
});

// alert the user feature is coming soon
$("[data-action=comingsoon]").click(function() {
  alertify.log("coming soon...");
  return false;
});