/*
  Version: 1.000-release
  svgMotion, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE
  
  This is svgMotion (https://michaelsboost.github.io/svgMotion/), A vector animation tool
*/

// variables
var version = '1.000',
    counter = 0,
    remStr  = "html > body > div:nth-child(2) > div > svg > ",
    $this, $str, $code, jsStr, origSVG, thisTool, anim, $selector, $attr = '',
    detectInt, totalInt, getPerc, arr = [],
    loadedJSON = {}, projectJSON = "",
    saveAsPNG = function(value) {
      saveSvgAsPng(document.querySelector(".canvas > svg"), value + ".png");
    };

// init code editor
$('.editor-container').show();
$('.selectors').hide();
var editor = CodeMirror(document.getElementById("editor"), {
  tabMode: "indent",
  theme: 'nord',
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseTags: true,
  foldGutter: true,
  dragDrop: true,
  lint: false,
  autoCloseBrackets: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  mode: {name: "javascript", globalVars: false},
  paletteHints: true
});
Inlet(editor);
editor.on('change', function() {
  $('[data-keyselector="'+ elms.value +'"] textarea').val(editor.getValue()).trigger('change');
});

// alertify log
$('[data-log]').on('click', function() {
  var val = $(this).attr('data-log');
  alertify.log(val);
});

// svgMotion info
$('[data-info]').click(function() {
//  alertify.log('<div style="font-size: 14px; text-align: center;"><img src="logo.svg" style="width: 50%;"><br><h1>svgMotion</h1><h5>Version '+ version +'-dev</h5></div>');
  
//  swal({
//    html: '<img class="logo" src="logo.svg" style="width: 50%;"><br><h1>svgMotion</h1><h5>Version '+ version +'-dev</h5><a href="https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE" target="_blank">Open Source License</a>'
//  });
  swal({
    html: '<svg class="logo" style="isolation:isolate; width: 50%; cursor: pointer;" viewBox="0 0 512 512" onclick="window.open(\'https://github.com/michaelsboost/svgMotion\', \'_blank\')"><path d=" M 166.149 0.009 C 158.748 52.853 130.195 97.698 65.349 162.544 L 58.243 169.65 L 63.815 178.012 C 128.149 274.497 231.636 486.999 243.734 511.991 L 243.734 197.216 C 243.734 196.314 244.063 195.517 244.245 194.677 C 239.436 193.057 235.061 190.359 231.454 186.791 C 220.928 176.276 218.552 160.099 225.611 147.002 C 232.669 133.905 247.487 126.994 262.058 130.004 C 276.628 133.014 287.495 145.232 288.785 160.054 C 290.075 174.876 281.482 188.787 267.651 194.269 C 267.894 195.24 268.24 196.176 268.24 197.216 L 268.249 512 C 280.312 487.095 383.842 274.514 448.177 178.012 L 453.757 169.659 L 446.651 162.553 C 381.805 97.707 353.243 52.853 345.851 0 L 166.149 0.009 Z " /></svg><br><h1>svgMotion</h1><h5>Version '+ version +'-release</h5><a href="https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE" target="_blank">Open Source License</a>'
  });
//  $('.swal2-show').css('background', '#000');
  $('.swal2-show').css('font-size', '14px');
  $('.swal2-show').css('background', '#131722');
  $('.swal2-show a').css('color', '#3085d6');
  $('.swal2-show h1, .swal2-show h5').css({
    'font-weight': '100',
    'color': '#fff'
  });
});

// load file function
function loadfile(input) {
  var reader = new FileReader();
  var path = input.value;
  reader.onload = function(e) {
    if (path.toLowerCase().substring(path.length - 4) === ".svg") {
      // is animation playing? If so stop
      if ($('[data-play]').attr('data-play') === 'stop') {
        // trigger stop
        $('[data-play=stop]').trigger('click');
      }
      
      var keys = $("[data-keyscode]");
      if (keys.find('[data-keyselector]').length > 1) {
        swal({
          title: 'Keyframes Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            keys.find('[data-keyselector]').not('[data-keyselector=misc]').remove();
            // now update select element (#elms) to reflect cleared keys
            $("select#elms option").not('select#elms option[value=misc]').remove();
            keys.find('[data-keyselector=misc]').val('').trigger('change');
            editor.setValue('');
            $('[data-clear=filters]').trigger('click');
          }
        })
      } else {
        // no keyframes detected
        $("select#elms option").not('select#elms option[value=misc]').remove();
        keys.find('[data-keyselector=misc]').val('').trigger('change');
        editor.setValue('');
        $('[data-clear=filters]').trigger('click');
      }

      document.querySelector(".canvas").innerHTML = e.target.result;
      origSVG = $('.canvas').html();
      svgLoaded();
    } else if (path.toLowerCase().substring(path.length - 5) === ".json") {
      // is animation playing? If so stop
      if ($('[data-play]').attr('data-play') === 'stop') {
        // trigger stop
        $('[data-play=stop]').trigger('click');
      }
      
      if ($('[data-keys]').html()) {
        swal({
          title: 'Keys Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            $("[data-keyscode]").empty();
            loadedJSON = JSON.parse(e.target.result);
            loadJSON();
            origSVG = $('.canvas').html();
            svgLoaded();
            $('#elms option:last').prop('selected', true).trigger('change');
            $('[data-open=keys]').trigger('click');
            setTimeout(function() {
              $('[data-playit=firstframe]').trigger('click');
            }, 100)

            $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
            $("[data-action=fadeOut]").fadeOut(400, function() {
              $("[data-action=fadeOut]").remove();
            });
          }
        })
      } else {
        $("[data-keyscode]").empty();
        loadedJSON = JSON.parse(e.target.result);
        loadJSON();
        origSVG = $('.canvas').html();
        svgLoaded();
        $('#elms option:last').prop('selected', true).trigger('change');
        $('[data-open=keys]').trigger('click');
        setTimeout(function() {
          $('[data-playit=firstframe]').trigger('click');
        }, 100)

        $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
        $("[data-action=fadeOut]").fadeOut(400, function() {
          $("[data-action=fadeOut]").remove();
        });
      }
    } else {
      alertify.error('Error: File type not supported');
    }
  };
  reader.readAsText(input.files[0]);
}
function loadJSON() {
  $("#elms").empty();
  $("[data-canvas]").html(loadedJSON.originalSVG.toString());
  $("#elms").html(loadedJSON.elmkeys);
  $("[data-keyscode]").html(loadedJSON.keys);
  
  if ($("textarea.js").length != 0) {
    $("textarea.js").each(function(i) {
      $("textarea.js").eq(i).val(loadedJSON.keysCode[i]);
    });
  }
    
  if (parseFloat(loadedJSON.version) <= 0.1) {
    swal({
      title: 'Warning!',
      text: "This project is using a version of svgMotion that's no longer supported.",
      type: 'warning',
    })
  } else 
  if (parseFloat(version) > parseFloat(loadedJSON.version)) {
    swal({
      title: 'Warning!',
      text: "This project is using an older version of svgMotion. Some features may not work!",
      type: 'warning',
    })
  }
  
  $('#blurfilter').val(loadedJSON.filters[0].blurfilter);
  $('#huefilter').val(loadedJSON.filters[0].huefilter);
  $('#brightnessfilter').val(loadedJSON.filters[0].brightnessfilter);
  $('#contrastfilter').val(loadedJSON.filters[0].contrastfilter);
  $('#saturatefilter').val(loadedJSON.filters[0].saturatefilter);
  $('#grayscalefilter').val(loadedJSON.filters[0].grayscalefilter);
  $('#sepiafilter').val(loadedJSON.filters[0].sepiafilter);
  $('#invertfilter').val(loadedJSON.filters[0].invertfilter).trigger('change');

  $('[data-projectname]').val(loadedJSON.settings[0].name);
  $('[data-project=width]').val(loadedJSON.settings[0].width);
  $('[data-project=height]').val(loadedJSON.settings[0].height).trigger('change');
  $('[data-fps], [data-new=fps]').val(loadedJSON.settings[0].framerate);
  $('[data-fontsize]').val(loadedJSON.settings[0].fontsize);
  $('[data-notepad]').val(loadedJSON.settings[0].notepad);
  
  $('#elms').on('keyup change', function() {
    updateOptionCode();
  });
}
function dropfile(file) {
  var reader = new FileReader();  
  reader.onload = function(e) {
    if (file.type === "image/svg+xml") {
      // is animation playing? If so stop
      if ($('[data-play]').attr('data-play') === 'stop') {
        // trigger stop
        $('[data-play=stop]').trigger('click');
      }
      
      var keys = $("[data-keyscode]");
      if (keys.find('[data-keyselector]').length > 1) {
        swal({
          title: 'Keyframes Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            keys.find('[data-keyselector]').not('[data-keyselector=misc]').remove();
            // now update select element (#elms) to reflect cleared keys
            $("select#elms option").not('select#elms option[value=misc]').remove();
            keys.find('[data-keyselector=misc]').val('').trigger('change');
            editor.setValue('');
            $('[data-clear=filters]').trigger('click');
          }
        })
      } else {
        // no keyframes detected
        $("select#elms option").not('select#elms option[value=misc]').remove();
        keys.find('[data-keyselector=misc]').val('').trigger('change');
        editor.setValue('');
        $('[data-clear=filters]').trigger('click');
      }

      document.querySelector(".canvas").innerHTML = e.target.result;
      origSVG = $('.canvas').html();
      svgLoaded();
    } else 
      if (file.type === "application/json") {
        // is animation playing? If so stop
        if ($('[data-play]').attr('data-play') === 'stop') {
          // trigger stop
          $('[data-play=stop]').trigger('click');
        }
        
        if ($('[data-keys]').html()) {
          swal({
            title: 'Keys Detected!',
            text: "Would you like to clear these?",
            type: 'question',
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              $("[data-keyscode]").empty();
              loadedJSON = JSON.parse(e.target.result);
              loadJSON();
              origSVG = $('.canvas').html();
              svgLoaded();
              $('#elms option:last').prop('selected', true).trigger('change');
              $('[data-open=keys]').trigger('click');
              setTimeout(function() {
                $('[data-playit=firstframe]').trigger('click');
              }, 100)

              $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
              $("[data-action=fadeOut]").fadeOut(400, function() {
                $("[data-action=fadeOut]").remove();
              });
            }
          })
        } else {
          $("[data-keyscode]").empty();
          loadedJSON = JSON.parse(e.target.result);
          loadJSON();
          origSVG = $('.canvas').html();
          svgLoaded();
          $('#elms option:last').prop('selected', true).trigger('change');
          $('[data-open=keys]').trigger('click');
          setTimeout(function() {
            $('[data-playit=firstframe]').trigger('click');
          }, 100)

          $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
          $("[data-action=fadeOut]").fadeOut(400, function() {
            $("[data-action=fadeOut]").remove();
          });
        }
    } else {
      alertify.error('Error: File type not supported');
    }
  };
  reader.readAsText(file,"UTF-8"); 
}

// load svg file on drop
document.addEventListener("dragover", function(e) {
  e.preventDefault();
});
document.addEventListener("drop", function(e) {
  // close dialog
  if ($('[data-close=layers].active').is(':visible')) {
    $('[data-close=layers].active').trigger('click');
  }
  if ($('[data-close=keys].active').is(':visible')) {
    $('[data-close=keys].active').trigger('click');
  }
  if ($('[data-filtericons]').is(':visible')) {
    $('[data-filtericons]').trigger('click');
  }
  if ($('[data-filters]').is(':visible')) {
    $('[data-close=filter]').trigger('click');
    $('[data-filtericons]').trigger('click');
  }
  
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  dropfile(file);
});

// update document title when project name changes
$('[data-projectname]').on('keyup change', function() {
  document.title = 'svgMotion: ' + this.value;
});

// detect if selector meets frame by frame animation parameters
function detectForFrameByFrame() {
  // first detect if there's a selection
  if (!$('[data-selectorlist].selector').is(':visible')) {
    $('.librarylinks [data-init]').hide();
    return false;
  } else {
    $('.librarylinks [data-init]').show();
  }
  
  // detect that this is the only selector
  if ($('[data-selected]').length === 1) {
    $('.librarylinks [data-init=framebyframe]').show();
    $('.librarylinks [data-init=rig]').show();
    
    // draw is available for these elements
    if ($.inArray($('[data-selected]').prop('tagName').toLowerCase(), ['text', 'ellipse', 'circle', 'rect', 'line', 'path', 'textPath', 'polygon', 'polyline']) !== -1) {
      $('.librarylinks [data-init=draw]').show();
    } else {
      $('.librarylinks [data-init=draw]').hide();
    }

    // if it's the only selector then...
    // detect if the children are group elements
    $('[data-selected]').find('> *').each(function(index) {
      if ($(this).prop('tagName').toLowerCase() != 'g') {
        $('.librarylinks [data-init=framebyframe]').hide();
        $('.librarylinks [data-init=rig]').hide();
        return false;
      } else {
        $('.librarylinks [data-init=framebyframe]').show();
        $('.librarylinks [data-init=rig]').show();
      }
    });
  
    // only show frame by frame if there's an array of only group children
    if ($('[data-selected]').children().length === 0) {
      $('.librarylinks [data-init=framebyframe]').hide();
      $('.librarylinks [data-init=rig]').hide();
      return false;
    }
  } else {
    // hide because this is not the only selector
    $('.librarylinks [data-init=framebyframe]').hide();
    $('.librarylinks [data-init=rig]').hide();
    $('.librarylinks [data-init=draw]').hide();
  }
}
var svgLoaded = function() {
  // clear canvas from layers window
  $('[data-display=selector]').empty();
  
  // locate SVG
  var $Canvas = document.querySelector(".canvas > svg");
  if ($Canvas) {
    // canvas interactive selection
    canvasClickSelect();

    // remove width/height attributes if detected
    if ($Canvas.getAttribute("width") || $Canvas.getAttribute("height")) {
      w = $Canvas.viewBox.baseVal.width;
      h = $Canvas.viewBox.baseVal.height;
      $("[data-project=width]").val(w);
      $("[data-project=height]").val(h).trigger('change');
      $Canvas.removeAttribute("width");
      $Canvas.removeAttribute("height");
      alertify.log("Width/Height attributes removed for fullscreen display.");
    }
    
    $(".canvas > svg *").removeAttr("vector-effect");
//    $(".canvas > svg").attr("preserveAspectRatio", "xMidYMin");

    $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
    $("[data-action=fadeOut]").fadeOut(400, function() {
      $("[data-action=fadeOut]").remove();
    });
    $("[data-projectname]").trigger("keyup");
    
    // list all elements as list
    var fullSVGlength = $(".canvas svg *").length;
    $(".canvas svg *").each(function(i) {
//      $val = $(this).getPath();
      $val = $(this).getPath().split(remStr).join('');

      // append layers
      $elm = '<li data-selectorlist="' + $val + '"><span>' + $val + '</span></li>';
      $('[data-display=selector]').append($elm);

      // trigger selected element on layer click
      if (i === parseInt(fullSVGlength - 1)) {
        $("[data-selectorlist]").on('click', function() {
          $val = $(this).data('selectorlist');

          // single or an array? user selects
          $(this).toggleClass('selector');
          $str = "";

          // clear canvas selector(s)
          if ($('[data-selected]').is(':visible')) {
            $("[data-selected]").removeAttr("data-selected");
          }
          
          if ($('[data-selectorlist].selector').is(':visible')) {
            // show tween and framebyframe init buttons
            $('.librarylinks [data-init]').show();
          } else {
            // hide tween and framebyframe init buttons
            $('.librarylinks [data-init]').hide();
          }

          // render selectors in canvas
          $('[data-selectorlist].selector').each(function() {
            if ($str === "") {
              $str = ".canvas svg > " + $(this).find('span').text();
            } else {
              $str += ", .canvas svg > " + $(this).find('span').text();
            }
            $($str).attr("data-selected", "");
          
            // only show animation frame by frame init button if parameters are met
            detectForFrameByFrame();
          });
          return false;
        });
      }
    });
    
    origSVG = $('.canvas').html();
  } else {
    alertify.error("Error: No svg element detected!");
  }
}
svgLoaded();

// canvas interactive selection
function canvasClickSelect() {
  $('.canvas svg *').on('click', function() {
    // is library visible? if so proceed
    if ($('.libraryh').is(':visible') && $('[data-zoom=false]').is(':visible')) {
      // is selected already visible? If so remove to select active one
      if ($('[data-selected]').is(':visible')) {
        $("[data-selected]").removeAttr("data-selected");
        $(this).attr('data-selected', '');

        // display selection in library
        $('[data-display=selector] li').removeClass('selector');

        // remember selector(s) via string
        $str = "";

        // activate selection in libary from canvas
        $(".canvas svg [data-selected]").each(function() {
          $str = $(this).getPath().split(remStr).join('');
          $('[data-selectorlist]').each(function() {
            if ($(this).find('span').text() === $str) {
              $(this).addClass('selector');
            }
          });
        });
        
        // show tween and framebyframe init buttons
        $('.librarylinks [data-init]').show();

        // only show frame by frame if there's an array of only group children
        detectForFrameByFrame();
      } else {
        $(this).attr('data-selected', '');

        // display selection in library
        $('[data-display=selector] li').removeClass('selector');

        // remember selector(s) via string
        $str = "";

        // activate selection in libary from canvas
        $(".canvas svg [data-selected]").each(function() {
          $str = $(this).getPath().split(remStr).join('');
          $('[data-selectorlist]').each(function() {
            if ($(this).find('span').text() === $str) {
              $(this).addClass('selector');
            }
          });
        });
        
        // show tween and framebyframe init buttons
        $('.librarylinks [data-init]').show();

        // only show frame by frame if there's an array of only group children
        detectForFrameByFrame();
      }
    }
    return false;
  });
}

// size presets
$('[data-size]').on('click', function() {
  str = $(this).attr('data-size');
  w = str.substr(0, str.indexOf('x'));
  h = str.substring(str.length, str.indexOf('x') + 1);
  
  $('[data-new=width]').val(w);
  $('[data-new=height]').val(h);
});
$('[data-projectsize]').on('click', function() {
  str = $(this).attr('data-projectsize');
  w = str.substr(0, str.indexOf('x'));
  h = str.substring(str.length, str.indexOf('x') + 1);
  
  $('[data-project=width]').val(w);
  $('[data-project=height]').val(h).trigger('change');
});
$('[data-project=width], [data-project=height]').on('change', function() {
  $('[data-canvas]').css('width', $('[data-project=width]').val() + 'px');
  $('[data-canvas]').css('height', $('[data-project=height]').val() + 'px');
});

// init panzoom
var drawArea = document.querySelector('[data-canvas]');
var instance = panzoom(drawArea, {
  bounds: true,
  boundsPadding: 0.1
});

// toggle dialogs
function openDialog(dialog) {
  // detect active tool
  $('[data-dialogs] [data-dialog]').hide();
  $('[data-dialogs] [data-dialog='+ dialog.toString().toLowerCase() +']').show();
}
function closeDialogs() {
  $('[data-dialogs] [data-dialog]').hide();
}
$('[data-call]').on('click', function(val) {
  thisTool = $(this).attr('data-call').toString().toLowerCase();
  val = thisTool;
  
  // if tool is not active
  if (!$('[data-call].active').is(':visible')) {
    $(this).addClass('active');
    openDialog(val);
  } else {
    // if tool is active
    // are you clicking on same tool or not?
    $(this).each(function(i) {
      // if you are remove the class
      if ($('[data-call].active').attr('data-call').toString().toLowerCase() === thisTool) {
        $('[data-call].active').removeClass('active');
        closeDialogs()

        // if not remove the class from the original and then add it
      } else {
        $('[data-call].active').removeClass('active');
        $(this).addClass('active');
        openDialog(val);
      }
    });
  }
});

// tools
// layers
function rig(selector, val) {
  val = parseInt(val).toFixed(0);
  
  document.querySelectorAll(selector).forEach(function(elm, i) {
    elm.style.display = 'none';
    elm.style.opacity = '100%';
    
    if (i.toString() === val) {
      elm.style.display = 'block';
      elm.style.opacity = '100%';
    }
  });
}
$('[data-open=layers]').on('click', function() {
  $('[data-topmenu] .mainmenu').hide();
  $('[data-library]').show();
  $('[data-canvasbg]').css('right', '50%');
  $('[data-canvasbg]').css('border-right', '0');

  // render selector(s) in canvas
  $('[data-selectorlist].selector').each(function() {
    if ($str === "") {
      $str = ".canvas svg > " + $(this).find('span').text();
    } else {
      $str += ", .canvas svg > " + $(this).find('span').text();
    }
    $($str).attr("data-selected", "");
  });
});
$('[data-close=layers]').on('click', function() {
  $('[data-open=layers].active').removeClass('active');
  $('[data-topmenu] .mainmenu').hide();
  $('[data-dialog=layers]').hide();
  $('[data-mainmenu]').show();
  $('[data-canvasbg]').css('right', '');
  $('[data-canvasbg]').css('border', '');
  $('[data-selected]').removeAttr("data-selected");
});
$('[data-init=draw]').on('click', function() {
  swal({
    title: 'Give your animation a name!',
    input: 'text',
    inputPlaceholder: "something",
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true
  }).then((result) => {
    if (result.value) {
      $this = $('#elms option:selected').text();
      if ($('[data-keyname='+ result.value.toString().toLowerCase() +']').length === 1) {
        alertify.error('Error: That name already exists!');
        $('#elms option:selected').text($this);
      } else {
        counter++;
        
        // append the option
        $('#elms').append('<option value="'+ $('[data-selectorlist].selector').text() +'">'+ result.value.toString().toLowerCase() +'</option>');

        // now append the code
        $('[data-keyscode]').append('<div data-keyselector="'+ $('[data-selectorlist].selector').text() +'" data-animtype="drawPath" data-keyname="'+ result.value.toString().toLowerCase() +'"><textarea class="js" spellcheck="false" autocorrect="off" autocapitalize="off" onkeyup="updateCode()" onchange="updateCode()">mainTL.to(".svgmotion > svg > '+ $('[data-selectorlist].selector').text() +'", {\n  stroke: "#000",\n  strokeWidth: '+ parseFloat($('[data-selected]').css('stroke-width')) +',\n  duration: 0,\n  strokeDasharray: document.querySelector(".svgmotion > svg > '+ $('[data-selectorlist].selector').text() +'").getTotalLength() + "," + document.querySelector(".svgmotion > svg > '+ $('[data-selectorlist].selector').text() +'").getTotalLength(),\n  strokeDashoffset: document.querySelector(".svgmotion '+ $('[data-selectorlist].selector').text() +'").getTotalLength()\n}, 0.0)\n\nmainTL.to(".svgmotion > svg > '+ $('[data-selectorlist].selector').text() +'", {\n  strokeDashoffset: 0,\n  ease: "none",\n  duration: 1\n}, '+ time.textContent +')</textarea></div>');
        $('#elms option[value="'+ $('[data-selectorlist].selector').text() +'"]').prop('selected', true);
      }

      alertify.success('Successfully added the "'+ result.value +'" drawPath animation.');
      
      // close layers and open the newly added keyframe
      $('[data-close=layers]').trigger('click');
      $('[data-open=keys]').trigger('click');
    } else {
      swal(
        'Oops!',
        console.error().toString(),
        'error'
      );
    }
  });
});
$('[data-init=tween]').on('click', function() {
  if ($('[data-selectorlist].selector').length === 1) {
    // attribute presets for snippet
    if ($.inArray($('[data-selected]').prop('tagName').toLowerCase(), ['path', 'polygon']) !== -1) {
      // matches
      $attr = '\n  attr: {d: \"'+ $('[data-selected]').attr('d').toString() +'\"},';
    } else {
      // does not match
      // $str = 'attr: {d: "m84.75,23.25l1,1l131,128l-129,121l-3,2l0,-252z"},';';
      // $attr = '\n  attr: {d: \"'+ $('[data-selected]').attr('d').toString() +'\"},';
      // $attr = '\n  attr: {attributeKey: "attributeValue"},';
      $attr = '';
    }

    $selector = '.svgmotion > svg > ' + $('[data-selectorlist].selector').text();
    
    swal({
      title: 'Give your tween a name!',
      input: 'text',
      inputPlaceholder: "something",
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        $this = $('#elms option:selected').text();
        if ($('[data-keyname='+ result.value.toString().toLowerCase() +']').length === 1) {
          alertify.error('Error: That name already exists!');
          $('#elms option:selected').text($this);
        } else {
          // append the option
          $('#elms').append('<option value="'+ $selector +'">'+ result.value.toString().toLowerCase() +'</option>');

          // now append the code
          $('[data-keyscode]').append('<div data-keyselector="'+ $selector +'" data-animtype="tween" data-keyname="'+ result.value.toString().toLowerCase() +'"><textarea class="js" spellcheck="false" autocorrect="off" autocapitalize="off" onkeyup="updateCode()" onchange="updateCode()"></textarea></div>');
          // $('#elms option[value="'+ $('[data-selectorlist].selector').text() +'"]')[0].selected = true;
          $('#elms option[value="'+ $selector +'"]').prop('selected', true);
        }
        
        alertify.success('Successfully added the "'+ result.value +'" tween.');
      
        // close layers and open the newly added keyframe
        $('[data-close=layers]').trigger('click');
        $('[data-open=keys]').trigger('click');
      } else {
        swal(
          'Oops!',
          console.error().toString(),
          'error'
        );
      }
    });
  } else {
    arr = [];
    $('[data-selectorlist].selector').each(function() {
      arr.push('.svgmotion > svg > ' + this.textContent);
    });
    $selector = arr.join(', ');
    
    // attribute presets for snippet
    $attr = '\n  attr: {attributeKey: "attributeValue"},';
    // $attr = '';
    
    swal({
      title: 'Give your tween a name!',
      input: 'text',
      inputPlaceholder: "something",
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        $this = $('#elms option:selected').text();
        if ($('[data-keyname='+ result.value.toString().toLowerCase() +']').length === 1) {
          alertify.error('Error: That name already exists!');
          $('#elms option:selected').text($this);
        } else {          
          // append the option
          $('#elms').append('<option value="'+ $selector +'">'+ result.value.toString().toLowerCase() +'</option>');

          // now append the code
          $('[data-keyscode]').append('<div data-keyselector="'+ $selector +'" data-animtype="tween" data-keyname="'+ result.value.toString().toLowerCase() +'"><textarea class="js" spellcheck="false" autocorrect="off" autocapitalize="off" onkeyup="updateCode()" onchange="updateCode()"></textarea></div>');
          // $('#elms option[value="'+ $('[data-selectorlist].selector').text() +'"]')[0].selected = true;
          $('#elms option[value="'+ $selector +'"]').prop('selected', true);
        }
        
        alertify.success('Successfully added the "'+ result.value +'" tween.');
      
        // close layers and open the newly added keyframe
        $('[data-close=layers]').trigger('click');
        $('[data-open=keys]').trigger('click');
      } else {
        swal(
          'Oops!',
          console.error().toString(),
          'error'
        );
      }
    });
  }
});
$('[data-init=rig]').on('click', function() {
  swal({
    title: 'Give your animation a name!',
    input: 'text',
    inputPlaceholder: "something",
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true
  }).then((result) => {
    if (result.value) {
      $this = $('#elms option:selected').text();
      if ($('[data-keyname='+ result.value.toString().toLowerCase() +']').length === 1) {
        alertify.error('Error: That name already exists!');
        $('#elms option:selected').text($this);
      } else {
        $selector = '.svgmotion > svg > ' + $('[data-selectorlist].selector').text();
        
        // append the option
        $('#elms').append('<option value="'+ $('[data-selectorlist].selector').text() +'">'+ result.value.toString().toLowerCase() +'</option>');

        // now append the code
        $('[data-keyscode]').append('<div data-keyselector="'+ $('[data-selectorlist].selector').text() +'" data-animtype="rig" data-keyname="'+ result.value.toString().toLowerCase() +'"><textarea class="js" spellcheck="false" autocorrect="off" autocapitalize="off" onkeyup="updateCode()" onchange="updateCode()">mainTL.to({}, {\n  duration: 1,\n  immediateRender: true,\n  onUpdate() {\n    rig("'+ $selector +' > g", 0);\n  }\n}, '+ time.textContent +');</textarea></div>');
        $('#elms option[value="'+ $('[data-selectorlist].selector').text() +'"]').prop('selected', true);
      }

      alertify.success('Successfully added the "'+ result.value +'" rig.');
      
      // close layers and open the newly added keyframe
      $('[data-close=layers]').trigger('click');
      $('[data-open=keys]').trigger('click');
    } else {
      swal(
        'Oops!',
        console.error().toString(),
        'error'
      );
    }
  });
});
$('[data-init=framebyframe]').on('click', function() {
  swal({
    title: 'Give your animation a name!',
    input: 'text',
    inputPlaceholder: "something",
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true
  }).then((result) => {
    if (result.value) {
      $this = $('#elms option:selected').text();
      if ($('[data-keyname='+ result.value.toString().toLowerCase() +']').length === 1) {
        alertify.error('Error: That name already exists!');
        $('#elms option:selected').text($this);
      } else {
        counter++;
        
        // append the option
        $('#elms').append('<option value="'+ $('[data-selectorlist].selector').text() +'">'+ result.value.toString().toLowerCase() +'</option>');

        // now append the code
        $('[data-keyscode]').append('<div data-keyselector="'+ $('[data-selectorlist].selector').text() +'" data-animtype="tween" data-keyname="'+ result.value.toString().toLowerCase() +'"><textarea class="js" spellcheck="false" autocorrect="off" autocapitalize="off" onkeyup="updateCode()" onchange="updateCode()">let groups'+ counter +' = gsap.utils.toArray(".svgmotion > svg > '+ $('[data-selectorlist].selector').text() +' > g");\nlet wrap'+ counter +' = gsap.utils.wrap(0, groups'+ counter +'.length - 1);\nlet frame'+ counter +' = 0;\n\nmainTL.to({}, {\n  duration: 0.1,\n  repeat: 9,\n  onRepeat() {\n    let last'+ counter +' = groups'+ counter +'[wrap'+ counter +'(frame'+ counter +')];\n    let next'+ counter +' = groups1[wrap'+ counter +'(++frame'+ counter +')];\n\n    last'+ counter +'.style.display = "none";\n    last'+ counter +'.style.opacity = "0";\n    next'+ counter +'.style.display = "block";\n    next'+ counter +'.style.opacity = "100%";\n  }\n}, 0.0)</textarea></div>');
        $('#elms option[value="'+ $('[data-selectorlist].selector').text() +'"]').prop('selected', true);
      }

      alertify.success('Successfully added the "'+ result.value +'" frame by frame animation.');
      
      // close layers and open the newly added keyframe
      $('[data-close=layers]').trigger('click');
      $('[data-open=keys]').trigger('click');
    } else {
      swal(
        'Oops!',
        console.error().toString(),
        'error'
      );
    }
  });
});

// keyframes
$('[data-add=snippet]').click(function() {
  if ($(elms.value).length === 1) {
    var addSnippet = "mainTL.to('"+ elms.value +"', {\n  x: 0,\n  y: 0,\n  scaleX: 1,\n  scaleY: 1,\n  scale: 1,\n  rotation: 0,\n  transformOrigin: 'center center',\n  opacity: '100%',\n  fill: '"+ $(elms.value).css('fill') +"',\n  stroke: '"+ $(elms.value).css('stroke') +"',\n  strokeWidth: "+ parseInt($(elms.value).css('stroke-width')) +",\n  borderRadius: 0,\n  // eases: none, power1.in, power2.out, power3.inOut, power4, back, elastic, bounce, rough, slow, steps, circ, expo, and sine\n  ease: 'none',\n  duration: 1,\n  delay: 0,\n  motionPath: {path: \"path\"},"+ $attr +"\n  onStart: function() {\n    // call function onstart\n  },\n  onComplete: function() {\n    // call function oncomplete\n  },\n  onUpdate: function() {\n    // call function onupdate\n  }\n}, "+ time.textContent +")";
  } else {
    var addSnippet = "mainTL.to('"+ elms.value +"', {\n  x: 0,\n  y: 0,\n  scaleX: 1,\n  scaleY: 1,\n  scale: 1,\n  rotation: 0,\n  transformOrigin: 'center center',\n  opacity: '100%',\n  fill: '#fff',\n  stroke: '#fff',\n  strokeWidth: 0,\n  borderRadius: 0,\n  // eases: none, power1, power2, power3, power4, back, elastic, bounce, rough, slow, steps, circ, expo, and sine\n  ease: 'power1.inOut',\n  duration: 1,\n  delay: 0,\n  motionPath: {path: \"path\"},"+ $attr +"\n  onStart: function() {\n    // call function onstart\n  },\n  onComplete: function() {\n    // call function oncomplete\n  },\n  onUpdate: function() {\n    // call function onupdate\n  }\n}, "+ time.textContent +")";
  }
  
  $('[data-keyselector="'+ elms.value +'"] textarea').val($('[data-keyselector="'+ elms.value +'"] textarea').val() + '\n\n' + addSnippet);
  editor.setValue($('[data-keyselector="'+ elms.value +'"] textarea').val());
//  $('[data-add=snippet]').hide();
});
$('[data-open=keys]').on('click', function() {
  $('[data-topmenu] .mainmenu').hide();
  $('[data-keys]').show();
  $('[data-canvasbg]').css('bottom', '50%');
  $('[data-canvasbg]').css('border-bottom', '0');
  $('[data-selected]').removeAttr("data-selected");
  
  // only show the selectable key's value
  $('#elms').trigger('change');
  editor.setValue($('[data-keyselector="'+ elms.value +'"] textarea').val());
});
$('[data-close=keys]').on('click', function() {
  $('[data-open=keys].active').removeClass('active');
  $('[data-topmenu] .mainmenu').hide();
  $('[data-dialog=keys]').hide();
  $('[data-mainmenu]').show();
  $('[data-canvasbg]').css('bottom', '');
  $('[data-canvasbg]').css('border', '');
});
function updateOptionCode() {
  $('[data-keyselector]').hide();
  $('[data-keyselector="'+ elms.value +'"]').show();
  
  // set code editor value
  editor.setValue($('[data-keyselector="'+ elms.value +'"] textarea').val());
//  mainTL.progress(parseFloat(getDecimal).toFixed(2));
  $('[data-playit=nextframe]').trigger('click');
  $('[data-playit=prevframe]').trigger('click');
  
  // hide edit path button if a path is not selected
  if (($(elms.value).prop('tagName').toLowerCase() === 'path')) {
    editOnCodepen.style.display = 'inline-block';
  } else {
    editOnCodepen.style.display = 'none';
  }
  
  // hide sample snippet button if frame by frame is visible
  if ($('[data-keyselector="'+ elms.value +'"]').attr('data-animtype').toLowerCase() === 'framebyframe' || $('[data-keyselector="'+ elms.value +'"]').attr('data-animtype').toLowerCase() === 'drawpath') {
    $('[data-add=snippet]').hide();
  } else {
    $('[data-add=snippet]').show();
  }
}
$('#elms').on('keyup change', function() {
  updateOptionCode();
});

// selectors for layers
$('[data-select]').on('click', function() {
  $val = $(this).data('select');

  if ($val === 'all') {
    if (!$('[data-selected]').is(':visible')) {
      $('[data-display=selector] li').trigger('click');
      
      // remember selector(s) via string
      $str = "";

      // render selector(s) in canvas
      $('[data-selectorlist].selector').each(function() {
        if ($str === "") {
          $str = ".canvas svg > " + $(this).find('span').text();
        } else {
          $str += ", .canvas svg > " + $(this).find('span').text();
        }
        $($str).attr("data-selected", "");
      });
      return false;
    }
    
    // select all the same tags inside the same parent
    $('[data-selected]').each(function() {
      var tagNombre = $('[data-selected]').prop("tagName").toLowerCase();
      $(this).removeAttr("data-selected").parent().find(tagNombre).attr("data-selected", "");
    });
    
    // remember selector(s) via string
    $str = "";

    // activate selection in libary from canvas
    $(".canvas svg [data-selected]").each(function() {
      $str = $(this).getPath().split(remStr).join('');
      $('[data-selectorlist]').each(function() {
        if ($(this).find('span').text() === $str) {
          $(this).addClass('selector');
        }
      });
    });
      
    detectForFrameByFrame();
  } else 
    if ($val === 'none') {
    $('[data-display=selector] li').removeClass('selector');

    // clear canvas selector(s)
    if ($('[data-selected]').is(':visible')) {
      $("[data-selected]").removeAttr("data-selected");
    }
    
    // hide tween and framebyframe init buttons
    $('.librarylinks [data-init]').hide();
    return false;
  } else 
    if ($val === 'parent') {
    if ($('.canvas svg > [data-selected]').is(':visible')) {
      alertify.error('Error: Cannot select higher than the svg itself.');
      return false;
    }
    
    if (!$('[data-selected]').is(':visible')) {
      $('[data-display=selector] li').trigger('click');
      
      // remember selector(s) via string
      $str = "";

      // render selector(s) in canvas
      $('[data-selectorlist].selector').each(function() {
        if ($str === "") {
          $str = ".canvas svg > " + $(this).find('span').text();
        } else {
          $str += ", .canvas svg > " + $(this).find('span').text();
        }
        $($str).attr("data-selected", "");
      });
      return false;
    }
      
    $('[data-display=selector] li').removeClass('selector');
    
    // select all the same tags inside the same parent
    $('[data-selected]').each(function() {
      $(this).removeAttr("data-selected").parent().attr("data-selected", "");
      return false;
    });
    
    // remember selector(s) via string
    $str = "";

    // activate selection in libary from canvas
    $(".canvas svg [data-selected]").each(function() {
      $str = $(this).getPath().split(remStr).join('');
      $('[data-selectorlist]').each(function() {
        if ($(this).find('span').text() === $str) {
          $(this).addClass('selector');
          return false;
        }
      });
    });
      
    detectForFrameByFrame();
    return false;
  } else 
    if ($val === 'next') {
    if (!$('[data-selected]').is(':visible')) {
      $('[data-display=selector] li').trigger('click');
      
      // remember selector(s) via string
      $str = "";

      // render selector(s) in canvas
      $('[data-selectorlist].selector').each(function() {
        if ($str === "") {
          $str = ".canvas svg > " + $(this).find('span').text();
        } else {
          $str += ", .canvas svg > " + $(this).find('span').text();
        }
        $($str).attr("data-selected", "");
      });
      return false;
    }
      
    $('[data-display=selector] li').removeClass('selector');
    
    // select all the same tags inside the same parent
    $('[data-selected]').each(function() {
      $(this).removeAttr("data-selected").next().attr("data-selected", "");
    });
    
    // remember selector(s) via string
    $str = "";

    // activate selection in libary from canvas
    $(".canvas svg [data-selected]").each(function() {
      $str = $(this).getPath().split(remStr).join('');
      $('[data-selectorlist]').each(function() {
        if ($(this).find('span').text() === $str) {
          $(this).addClass('selector');
        }
      });
    });
      
    detectForFrameByFrame();
    return false;
  } else 
    if ($val === 'prev') {
    if (!$('[data-selected]').is(':visible')) {
      $('[data-display=selector] li').trigger('click');
      
      // remember selector(s) via string
      $str = "";

      // render selector(s) in canvas
      $('[data-selectorlist].selector').each(function() {
        if ($str === "") {
          $str = ".canvas svg > " + $(this).find('span').text();
        } else {
          $str += ", .canvas svg > " + $(this).find('span').text();
        }
        $($str).attr("data-selected", "");
      });
      return false;
    }
      
    $('[data-display=selector] li').removeClass('selector');
    
    // select all the same tags inside the same parent
    $('[data-selected]').each(function() {
      $(this).removeAttr("data-selected").prev().attr("data-selected", "");
    });
    
    // remember selector(s) via string
    $str = "";

    // activate selection in libary from canvas
    $(".canvas svg [data-selected]").each(function() {
      $str = $(this).getPath().split(remStr).join('');
      $('[data-selectorlist]').each(function() {
        if ($(this).find('span').text() === $str) {
          $(this).addClass('selector');
        }
      });
    });
      
    detectForFrameByFrame();
    return false;
  } else 
    if ($val === 'even') {
    if (!$('[data-selected]').is(':visible')) {
      $('[data-display=selector] li:even').trigger('click');
      
      // remember selector(s) via string
      $str = "";

      // render selector(s) in canvas
      $('[data-selectorlist].selector').each(function() {
        if ($str === "") {
          $str = ".canvas svg > " + $(this).find('span').text();
        } else {
          $str += ", .canvas svg > " + $(this).find('span').text();
        }
        $($str).attr("data-selected", "");
      });
      return false;
    }
      
    $('[data-display=selector] li').removeClass('selector');
      
    // select all the same tags inside the same parent
    $('[data-selected]').each(function() {
      var tagNombre = $('[data-selected]').prop("tagName").toLowerCase();
      $(this).removeAttr("data-selected").parent().find(tagNombre + ":even").attr("data-selected", "");
    });
    
    // remember selector(s) via string
    $str = "";

    // activate selection in libary from canvas
    $(".canvas svg [data-selected]").each(function() {
      $str = $(this).getPath().split(remStr).join('');
      $('[data-selectorlist]').each(function() {
        if ($(this).find('span').text() === $str) {
          $(this).addClass('selector');
        }
      });
    });
      
    detectForFrameByFrame();
  } else 
    if ($val === 'odd') {
    if (!$('[data-selected]').is(':visible')) {
      $('[data-display=selector] li:odd').trigger('click');
      
      // remember selector(s) via string
      $str = "";

      // render selector(s) in canvas
      $('[data-selectorlist].selector').each(function() {
        if ($str === "") {
          $str = ".canvas svg > " + $(this).find('span').text();
        } else {
          $str += ", .canvas svg > " + $(this).find('span').text();
        }
        $($str).attr("data-selected", "");
      });
      return false;
    }
      
    $('[data-display=selector] li').removeClass('selector');
      
    // select all the same tags inside the same parent
    $('[data-selected]').each(function() {
      var tagNombre = $('[data-selected]').prop("tagName").toLowerCase();
      $(this).removeAttr("data-selected").parent().find(tagNombre + ":odd").attr("data-selected", "");
    });
    
    // remember selector(s) via string
    $str = "";

    // activate selection in libary from canvas
    $(".canvas svg [data-selected]").each(function() {
      $str = $(this).getPath().split(remStr).join('');
      $('[data-selectorlist]').each(function() {
        if ($(this).find('span').text() === $str) {
          $(this).addClass('selector');
        }
      });
    });
      
    detectForFrameByFrame();
  } else 
    if ($val === 'custom') {
    swal({
      title: 'Custom selector',
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        // remove currect selection(s)
        $('[data-display=selector] li').removeClass('selector');

        // clear canvas selector(s)
        if ($('[data-selected]').is(':visible')) {
          $("[data-selected]").removeAttr("data-selected");
        }

        // user's custom selector
        $elm = result.value.split(',').join(', .canvas svg > ');
        
        // activate selection in canvas
        $(".canvas svg > " + $elm).each(function() {
          $str = $(this).getPath().split(remStr).join('');
          $(this).attr("data-selected", "");
        });
        
        // activate selection in libary from canvas
        $(".canvas svg [data-selected]").each(function() {
          $str = $(this).getPath().split(remStr).join('');
          $('[data-selectorlist]').each(function() {
            if ($(this).find('span').html() === $str) {
              $(this).addClass('selector');
            }
          });
        });
        
        return false;
      }
    });
      
    detectForFrameByFrame();
  } else {
    alertify.error('Selection error');
  }

  // clear canvas selector(s)
  if ($('[data-selected]').is(':visible')) {
    $("[data-selected]").removeAttr("data-selected");
  }

  // remember selector(s) via string
  $str = "";

  // render selector(s) in canvas
  $('[data-selectorlist].selector').each(function() {
    if ($str === "") {
      $str = ".canvas svg > " + $(this).find('span').text();
    } else {
      $str += ", .canvas svg > " + $(this).find('span').text();
    }
    $($str).attr("data-selected", "");
    
    // show tween and framebyframe init buttons
    detectForFrameByFrame();
  });
});

// filters
$('[data-open=filters]').on('click', function() {
  if ($('[data-call].active').is(':visible')) {
    $('[data-call].active').trigger('click');
  }
  $('[data-topmenu] .mainmenu').hide();
  $('[data-filtericons]').show();
});
$('[data-filter]').on('click', function() {
  $this = $(this).attr('data-filter');
  $('[data-topmenu] .mainmenu').hide();
  $('[data-toolsoption]').hide();
  $('[data-filters]').show();
  $('[data-toolsoption='+ $this +']').show();
});
$('[data-close=filters]').on('click', function() {
  $('[data-topmenu] .mainmenu').hide();
  $('[data-mainmenu]').show();
});
$('[data-close=filter]').on('click', function() {
  $('[data-topmenu] .mainmenu').hide();
  $('[data-filtericons]').show();
});
$('[data-clear=filters]').on('click', function() {
  $('.canvas svg').css('filter', '');
  $('[data-canvas] svg').css('filter', '');
  blurfilter.value = 0;
  huefilter.value = 0;
  brightnessfilter.value = 1;
  contrastfilter.value = 1;
  saturatefilter.value = 1;
  grayscalefilter.value = 0;
  sepiafilter.value = 0;
  invertfilter.value = 0;

  $('[data-close=filters]').trigger('click');
  applyFilters();
});

// apply filters
function applyFilters() {
  $('[data-canvas] svg').css('filter', 'blur('+ blurfilter.value +'px) hue-rotate('+ huefilter.value +'deg) brightness('+ brightnessfilter.value +')  contrast('+ contrastfilter.value +') saturate('+ saturatefilter.value +') grayscale('+ grayscalefilter.value +'%) sepia('+ sepiafilter.value +'%) invert('+ invertfilter.value +'%)');
}
$('.filterval').change(function() {
  applyFilters();
});
applyFilters();

// zoom/pan
$('[data-zoom]').on('click', function() {
  if ($(this).attr('data-zoom') === 'true') {
    $('[data-zoom]').attr('data-zoom', false)
           .html('<svg style="isolation:isolate" viewBox="0 0 512 512"><circle cx="209" cy="209" r="158" fill="none" stroke-width="90" stroke="#fff"></circle><line stroke-width="90" x1="463" y1="463" x2="364" y2="361" stroke-linecap="round" stroke="#fff"></line><g transform="matrix(1 0 0 1 4 0)"><g transform="matrix(1 0 0 1 205.5 210)"><line x1="-43.5" y1="-43" x2="43.5" y2="43" stroke-width="45" stroke-linecap="round" stroke="#fff"></line></g><g transform="matrix(-1 0 0 1 205.5 210)"><line x1="-43.5" y1="-43" x2="43.5" y2="43" stroke-width="45" stroke-linecap="round" stroke="#fff"></line></g></g></svg>');
    $('[data-resetzoompos]').hide();
    instance.pause();
    canvasClickSelect();
  } else {
    $('[data-zoom]').attr('data-zoom', true)
           .html('<svg style="isolation:isolate" viewBox="0 0 512 512"><circle cx="209" cy="209" r="158" fill="none" stroke-width="90" stroke="#1e7eeb"></circle><line stroke-width="90" x1="463" y1="463" x2="364" y2="361" stroke-linecap="round" stroke="#1e7eeb"></line></svg>');
    $('[data-resetzoompos]').show();
    instance.resume();
  }
});
// reset zoom position
$('[data-resetzoompos]').click(function() {
  $('[data-canvas]').css('transform-origin', '')
                    .css('transform', '');
  instance.restore();
});

// init the player
function updateCode() {
  // clear the variables
  jsStr = '';

  // apply the javascript
  $('textarea.js').each(function() {
    jsStr += $(this).val() + '\n';
  });

//  $code = 'var mainTL = new TimelineMax({repeat: -1, onUpdate: function() {\n  time.textContent = parseFloat(mainTL.progress()).toFixed(2)}})\n' + jsStr + 'var fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.pause('+ time.textContent +').timeScale('+ timescale.value +');\n$("[data-timeduration]").text(parseFloat(mainTL.duration()).toFixed(2))';

  if ($('[data-repeat]').attr('data-repeat') === 'true') {
    $code = 'var mainTL = new TimelineMax({repeat: -1, onUpdate: function() {\n  time.textContent = parseFloat(mainTL.progress()).toFixed(2)}})\n' + jsStr + 'var fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.pause('+ time.textContent +').timeScale('+ timescale.value +');\n$("[data-timeduration]").text(parseFloat(mainTL.duration()).toFixed(2))';
  } else {
    $code = 'var mainTL = new TimelineMax({onUpdate: function() {\n  time.textContent = parseFloat(mainTL.progress()).toFixed(2)}, onComplete: function() {$("[data-play]").trigger("click")}})\n' + jsStr + 'var fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.pause('+ time.textContent +').timeScale('+ timescale.value +');\n$("[data-timeduration]").text(parseFloat(mainTL.duration()).toFixed(2))';
  }

  // run the code
  $('[data-canvas]').empty().html(origSVG);
  applyFilters();
  $('[data-canvas]').append('<script>'+ $code +'</script>');
  updatePlayer();
  
  detectInt  = parseFloat(time.textContent).toFixed(2);
  totalInt   = parseFloat($('[data-timeduration]').text()).toFixed(2);
  getPerc    = (detectInt * 100) / totalInt;
  getPerc    = Math.round(getPerc);
  getDecimal = parseFloat(getPerc) / 100;
  mainTL.progress(parseFloat(getDecimal).toFixed(2));
  return false;
}
$('#timescale').on('change', function() {
  if ($('[data-play]').attr('data-play') === 'true') {
    // is paused
    updateCode();
  } else {
    // is playing
    $('[data-play]').trigger('click');
    updateCode();
    $('[data-play]').trigger('click');
  }
});
function updatePlayer() {
  $(".playhead").removeAttr('style');
  
  var $sequenceTime = $("#time"),
      sequenceTrackLength,
      sequenceDragger,
      draggable;

  mainTL.eventCallback("onUpdate", updateDragger)
  sequenceTrackLength = $('.seek-bar').width();
  sequenceDragger = $(".playhead");
  draggable = Draggable.create(sequenceDragger, {
    type:"x",
//    edgeResistance: 1,
//    overshootTolerance: 0,
    bounds:{minX:0, maxX:sequenceTrackLength},
    onDrag: function() {
      mainTL.progress(this.x / sequenceTrackLength).pause();
    }
  })[0];

  function updateDragger() {
    TweenMax.set(sequenceDragger, {x:sequenceTrackLength * mainTL.progress()})
    $sequenceTime.html(mainTL.time().toFixed(2))

    detectInt  = parseFloat(time.textContent).toFixed(2);
    totalInt   = parseFloat($('[data-timeduration]').text()).toFixed(2);
    getPerc    = (detectInt * 100) / totalInt;
    getPerc    = Math.round(getPerc);
    getDecimal = parseFloat(getPerc) / 100;

    $('.progress-bar').css('width', getPerc + '%');
  }
}

// timeline buttons
$('[data-play]').on('click', function() {
  if ($(this).attr('data-play') === 'true') {
    // pause state
    $('[data-play]').attr('data-play', false)
           .html('<svg style="isolation:isolate" viewBox="0 0 256 256"><path d=" M 73.142 201.143 C 73.142 211.235 81.336 219.429 91.429 219.429 L 91.429 219.429 C 101.521 219.429 109.715 211.235 109.715 201.143 L 109.715 54.857 C 109.715 44.765 101.521 36.571 91.429 36.571 L 91.429 36.571 C 81.336 36.571 73.142 44.765 73.142 54.857 L 73.142 201.143 Z "/><path d=" M 146.286 201.143 C 146.286 211.235 154.48 219.429 164.572 219.429 L 164.572 219.429 C 174.664 219.429 182.858 211.235 182.858 201.143 L 182.858 54.857 C 182.858 44.765 174.664 36.571 164.572 36.571 L 164.572 36.571 C 154.48 36.571 146.286 44.765 146.286 54.857 L 146.286 201.143 Z "/></svg>');
    
//    // stop symbol
//           .html('<svg style="isolation:isolate" viewBox="0 0 256 256"><path d=" M 54.836 219.429 C 44.744 219.429 36.55 211.235 36.55 201.143 L 36.55 54.857 C 36.55 44.765 44.744 36.571 54.836 36.571 L 201.164 36.571 C 211.256 36.571 219.45 44.765 219.45 54.857 L 219.45 201.143 C 219.45 211.235 211.256 219.429 201.164 219.429 L 54.836 219.429 Z " /></svg>');
    $('[data-render]').show();
    
    if(mainTL.progress() < 1) {
      mainTL.play();
    } else {
      mainTL.restart();
      $('.playhead').attr('style', 'left: 0%;');
    }
    
  } else {
    // play state
    $('[data-play]').attr('data-play', true)
           .html('<svg style="isolation:isolate" viewBox="0 0 256 256"><path d=" M 73.143 219.429 L 73.143 219.429 C 63.051 219.429 54.857 211.235 54.857 201.143 L 54.857 158.476 L 54.857 97.524 L 54.857 54.857 C 54.857 44.765 63.051 36.571 73.143 36.571 L 73.143 36.571 C 83.235 36.571 201.143 99 201.143 128 C 201.143 157 83.235 219.429 73.143 219.429 Z "/></svg>');
    $('[data-render]').hide();
    mainTL.pause();

    detectInt  = parseFloat(time.textContent).toFixed(2);
    totalInt   = parseFloat($('[data-timeduration]').text()).toFixed(2);
    getPerc    = (detectInt * 100) / totalInt;
    getPerc    = Math.round(getPerc);
    getDecimal = parseFloat(getPerc) / 100;
    mainTL.progress(parseFloat(getDecimal).toFixed(2));
  }
});
$('[data-playit=firstframe]').click(function() {
  time.textContent = '0.00';
//  mainTL.seek(0);
  mainTL.progress(0);
//  $('.progress-bar').css('width', '0%');
});
$('[data-playit=nextframe]').click(function() {
  // detect if is already last frame
  if ($('[data-timeduration]').text() === time.textContent) {
    $('[data-playit=firstframe]').trigger('click');
    return false;
  }
  
  if (parseFloat(time.textContent).toFixed(2) >= 0 || time.textContent < parseFloat(mainTL.progress()).toFixed(2)) {
//    time.textContent = parseFloat(0.01 + parseFloat(mainTL.progress())).toFixed(2);
    time.textContent = parseFloat(0.01 + parseFloat(time.textContent)).toFixed(2);
//    mainTL.seek(parseFloat(time.textContent));
    
    detectInt  = parseFloat(time.textContent).toFixed(2);
    totalInt   = parseFloat($('[data-timeduration]').text()).toFixed(2);
    getPerc    = (detectInt * 100) / totalInt;
    getPerc    = Math.round(getPerc);
    getDecimal = parseFloat(getPerc) / 100;
    mainTL.progress(parseFloat(getDecimal).toFixed(2));
//    $('.progress-bar').css('width', getPerc + '%');
  }
});
$('[data-playit=prevframe]').click(function() {
  // detect if is already first frame
  if (time.textContent === '0.00') {
    $('[data-playit=lastframe]').trigger('click');
    return false;
  }
  
  if (parseFloat(time.textContent).toFixed(2) > 0 || time.textContent > parseFloat(mainTL.progress()).toFixed(2)) {
//    time.textContent = parseFloat(parseFloat(mainTL.progress()) - 0.01).toFixed(2);
    time.textContent = parseFloat(parseFloat(time.textContent - 0.01)).toFixed(2);
//    mainTL.seek(parseFloat(time.textContent));
    
    detectInt  = parseFloat(time.textContent).toFixed(2);
    totalInt   = parseFloat($('[data-timeduration]').text()).toFixed(2);
    getPerc    = (detectInt * 100) / totalInt;
    getPerc    = Math.round(getPerc);
    getDecimal = parseFloat(getPerc) / 100;
    mainTL.progress(parseFloat(getDecimal).toFixed(2));
//    $('.progress-bar').css('width', getPerc + '%');
  }
});
$('[data-playit=lastframe]').click(function() {
  time.textContent = $('[data-timeduration]').text();
//  mainTL.seek(time.textContent);
  mainTL.progress(1);
//  $('.progress-bar').css('width', '100%');
});
$('[data-repeat]').on('click', function() {
  if ($(this).attr('data-repeat') === 'true') {
    // no loop
    $('[data-repeat]').attr('data-repeat', false);
    $('textarea.js').trigger('change');
  } else {
    // repeat/loop
    $('[data-repeat]').attr('data-repeat', true);
    $('textarea.js').trigger('change');
  }
});
$('[data-delit]').click(function() {
  swal({
    title: 'Proceed with deleting tween?',
    text: "Are you sure? All your data will be lost!",
    type: 'question',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      // remove the div
      $('.selectors [data-keyselector="'+ elms.value +'"]').remove();
      
      // lastly remove the select option
      $('#elms option:selected').remove();
      $('#elms').trigger('change');
    } else {
      return false;
    }
  })
});
$('[data-editname]').click(function() {
  swal({
    title: 'Change tween name?',
    input: 'text',
    inputPlaceholder: "something",
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true
  }).then((result) => {
    if (result.value) {
      $this = $('#elms option:selected').text();
      $('#elms option').each(function() {
        if ($(this).text() != result.value) {
          $('#elms option:selected').text(result.value);
        } else {
          alertify.error('Error: That name already exists!');
          $('#elms option:selected').text($this);
          return false;
        }
      });
    } else {
      swal(
        'Oops!',
        console.error().toString(),
        'error'
      );
    }
  });
});

// enable/disable snippet presets
$('.props > div > div > input[type=checkbox]').on('change', function() {
  if (this.checked) {
    $(this).parent().find('input').removeAttr('disabled');
    $(this).parent().find('select').removeAttr('disabled');
  } else {
    $(this).parent().find('input:not(input[type=checkbox])').attr('disabled', true);
    $(this).parent().find('select').attr('disabled', true);
  }
});

// change input/textarea font size
$('[data-fontsize]').on('keyup change', function() {
  $('input, textarea, .CodeMirror').css('font-size', this.value + 'px');
});

// init animations
function getCode() {
  // clear the variables
  jsStr = '';
  
  // clear and reset the canvas
  $('[data-canvas]').empty().html(origSVG);
  applyFilters();
  
  // apply the javascript
  $('textarea.js').each(function() {
    jsStr += $(this).val() + '\n';
  });
  
//  $code = 'var mainTL = new TimelineMax({repeat: -1})\n' + jsStr + 'var fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.play(0).timeScale('+ timescale.value +');\n';
//  $code = 'var mainTL = new TimelineMax('+ ($('[data-repeat]').attr('data-repeat') === 'true') ? "{repeat: -1}" : "" +')\n' + jsStr + 'var fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.play(0).timeScale('+ timescale.value +');\n';
  
  if ($('[data-repeat]').attr('data-repeat') === 'true') {
    $code = 'var mainTL = new TimelineMax({repeat: -1})\n' + jsStr + 'var fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.play(0).timeScale('+ timescale.value +');\n';
  } else {
    $code = 'var mainTL = new TimelineMax()\n' + jsStr + 'var fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.play(0).timeScale('+ timescale.value +');\n';
  }
}
$('[data-render]').click(function() {
//  alertify.log("coming soon...");
//  return false;
  
  if (!$("[data-canvas]").html()) {
    alertify.error("Abort Operation: No svg detected!");
    return false;
  }
  
  // if animation is already playing
  if ($('[data-play=false]').is(':visible')) {
    $('[data-play=false]').trigger('click')
  }
  
  getCode();
  if (jsStr.toString().split(' ').join('').toLowerCase().includes('repeat:-1')) {
    alertify.error("Error: Indefinite repeat found!");
    alertify.error("Do NOT use repeat: -1");
    alertify.error("Use a specific number!!");
    $('.playback').show();
    $('[data-render]').hide();
    return false;
  }
  
  if ($('[data-render]')[0].textContent.toLowerCase() === 'render') {
    // hide settings
    $('[data-call=settings] img').css({
      width: 0,
      padding: 0,
      overflow: 'hidden'
    });
    
    $('[data-midbtns]').hide();
    $('[data-export]').show();
    $('[data-render]').show().text('RENDERING ANIMATION').css('color', '#e71fd8');
    
    // close keys
    $('[data-close=keys]').trigger('click');
    
    $('[data-canvas]').empty().html(origSVG);
    applyFilters();
    $('[data-canvas]').append('<script>'+ $code +'</script>');
    setTimeout(function() {
      var fps = $("[data-fps]").val();
      var duration = mainTL.duration();
//      var duration = tl.totoalDuration();
//      var duration = tl.totalDuration();
      var frames   = Math.ceil(duration / 1 * fps);
      var current  = 0;

      // canvas
      var svg    = document.querySelector("[data-canvas] svg");
      var canvas = document.createElement("canvas");
      var ctx    = canvas.getContext("2d");

      canvas.width  = $("[data-project=width]").val();
      canvas.height = $("[data-project=height]").val();
      var jsonStr = [];

      function processImage() {
        mainTL.progress(current++ / frames);

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
            $("body").append('<div class="table preloaderbg" data-show="preloader"><div class="cell"><div class="preloader"><svg class="w100p" viewBox="0 0 600 150"><text y="93.75" x="75" style="line-height:125%;" font-weight="400" font-size="80" font-family="Lato" letter-spacing="0" word-spacing="0" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><tspan>Creating GIF</tspan></text></svg></div></div></div>');

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
                  var a = document.createElement("a");
                  a.href = obj.image;
                  a.target = "_blank";
                  
                  if (a.download === undefined) {
                    // do stuff
                  } else {
                    var projectname = $("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-")
                    if (!$("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-")) {
                      projectname = $("[data-projectname]")[0].value = "_svgMotion";
                    }

                    if (bowser.msie && bowser.version <= 6) {
                      // hello ie
                    } else if (bowser.firefox) {
                      // hello firefox
                      a.download = projectname + ".gif";
                    } else if (bowser.chrome) {
                      // hello chrome
                      a.download = projectname + ".gif";
                    } else if (bowser.safari) {
                      // hello safari
                    } else if(bowser.iphone || bowser.android) {
                      // hello mobile
                    }
                  }
                  
                  a.click();

                  $("[data-show=preloader]").remove();
                }
              }
            );
          };
          
          // export image sequence
          document.querySelector("[data-export=images]").onclick = function() {
            var zip = new JSZip();

            for (var i = 0; i < jsonStr.length; i++) {
              zip.file("frame-"+[i]+".png", jsonStr[i].split('base64,')[1],{base64: true});
            }

            var content = zip.generate({type:"blob"});
            var projectname = $("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-")
            if (!$("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-")) {
              projectname = $("[data-projectname]")[0].value = "_svgMotion";
            }
            saveAs(content, projectname + "-sequence.zip");
          };
        };

        if (current <= frames) {
          processImage();
        } else {
          mainTL.play(0).timeScale(1.0);
          $('[data-render]').text('FINISHED');
        }
      }
      processImage();
    }, 2);
  } else {
    delete window.duration;
    delete window.frames;
    delete window.current;

    // reset icons
    $('[data-export]').hide();
    $('[data-midbtns]').show();

    // stop animation
    $('.playback').show();
    // play state
    // if animation is already playing
    if ($('[data-play=false]').is(':visible')) {
      $('[data-play=false]').trigger('click')
    }
    updateCode();
    
    // reset icon
    $('[data-render]').text('RENDER').attr('style', '');
  
    // show settings
    $('[data-call=settings] img').removeAttr('style');
    
    $('[data-render]').show();
    
    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
      clearTimeout(i); 
    }
  }
});

// export files
function getProjectJSON() {
  if ($('[data-keyname]').length === 0) {
    $("[data-keyscode]").html();
  } else {
    keyscode = [];
    $('textarea.js').each(function() {
      keyscode.push(this.value);
    });
  }
  
  projectJSON = {
    "version": version,
    "settings": [{
      "name"     : $('[data-projectname]').val(),
      "width"    : $('[data-project=width]').val(),
      "height"   : $('[data-project=height]').val(),
      "framerate": $('[data-fps]').val(),
      "fontsize" : $('[data-fontsize]').val(),
      "notepad"  : $('[data-notepad]').val()
    }],
    "filters": [{
      "blurfilter"      : blurfilter.value,
      "huefilter"       : huefilter.value,
      "brightnessfilter": brightnessfilter.value,
      "contrastfilter"  : contrastfilter.value,
      "saturatefilter"  : saturatefilter.value,
      "grayscalefilter" : grayscalefilter.value,
      "sepiafilter"     : sepiafilter.value,
      "invertfilter"    : invertfilter.value
    }],
    "originalSVG": origSVG.toString(),
    "elmkeys": $("#elms").html(),
    "keys"   : $("[data-keyscode]").html(),
    "keysCode"   : keyscode
  };
};
function saveCode(filename) {
  JSZipUtils.getBinaryContent("libraries/gsap/gsap-public.zip", function(err, data) {
    if(err) {
      throw err // or handle err
    }

    var zip = new JSZip();

    // Put all application files in subfolder for shell script
    var zipFolder = zip.folder("libraries");
    zipFolder.load(data);

    // html
    // run the code
    $('[data-canvas]').empty().html(origSVG);
    applyFilters();
    
    zip.file("index.html", '<!DOCTYPE html>\n<html>\n  <head>\n    <title>'+ filename +': An svgMotion Animation</title>\n    <meta charset="utf-8" />\n    <meta name="description" content="This animation was created using svgMotion!">\n    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1">\n    <style>\n    body {margin:0;}</style>\n  </head>\n  <body>\n    <div class="svgmotion">\n      '+ $('.svgmotion').html() +'\n    </div>\n\n    <script src="libraries/gsap-public/minified/gsap.min.js"></script>\n    <script src="libraries/gsap-public/minified/MotionPathPlugin.min.js"></script>\n    <script src="js/animation.js"></script>\n  </body>\n</html>');

    // javascript
    $code = '';
    $('textarea.js').each(function() {
      $code += this.value + '\n';
    });
  
    if ($('[data-repeat]').attr('data-repeat') === 'true') {
      $code = '/*\n  This animation was created using svgMotion v'+ version.toString() +'-release\n  Create yours today at https://michaelsboost.com/svgMotion\n*/\n\nfunction rig(selector, val) {\n  val = parseInt(val).toFixed(0);\n\n    document.querySelectorAll(selector).forEach(function(elm, i) {\n    elm.style.display = "none";\n    elm.style.opacity = "100%";\n    \n    if (i.toString() === val) {\n      elm.style.display = "block";\n      elm.style.opacity = "100%";\n    }\n  });\n}\n\nvar mainTL = new TimelineMax({\n  repeat: -1\n});\n\n' + $code + '\nvar fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.play(0).timeScale('+ timescale.value +');'
    } else {
      $code = '/*\n  This animation was created using svgMotion v'+ version.toString() +'-release\n  Create yours today at https://michaelsboost.com/svgMotion\n*/function rig(selector, val) {\n  val = parseInt(val).toFixed(0);\n\n    document.querySelectorAll(selector).forEach(function(elm, i) {\n    elm.style.display = "none";\n    elm.style.opacity = "100%";\n    \n    if (i.toString() === val) {\n      elm.style.display = "block";\n      elm.style.opacity = "100%";\n    }\n  });\n}\n\nvar mainTL = new TimelineMax({\n  repeat: -1\n});\n\nvar mainTL = new TimelineMax({\n  repeat: -1\n});\n\nvar mainTL = new TimelineMax()\n\n' + $code + '\nvar fps = '+ $('[data-fps]').val() +';\nvar duration = mainTL.duration();\nvar frames = Math.ceil(duration / 1 * fps);\nmainTL.play(0).timeScale('+ timescale.value +');'
    }

    zip.file("js/animation.js", $code);
    var content = zip.generate({type:"blob"});
    saveAs(content, filename + ".zip");
    $('textarea.js').trigger('change');
  });
}
function exportSVGFrame() {
  var projectname = $("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-") + "-frame-" + time.textContent;
  if (!$("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $("[data-projectname]")[0].value = "-frame-" + time.textContent;
  }
  blob = new Blob([ '<!-- Generator: svgMotion - https://michaelsboost.com/svgMotion/ -->\n' + $(".canvas").html() ], {type: "text/html"});
  saveAs(blob, projectname + ".svg");
};
function exportPNGFrame() {
  var projectname = $("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-") + "-frame-" + time.textContent;
  if (!$("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $("[data-projectname]")[0].value = "-frame-" + time.textContent;
  }
  saveAsPNG(projectname);
};
function exportJSON() {
  getProjectJSON();
  var projectname = $('[data-projectname]')[0].value.toLowerCase().replace(/ /g, "-") + '_svgMotion';
  if (!$('[data-projectname]')[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $('[data-projectname]')[0].value = "_svgMotion";
  }
  var blob = new Blob([JSON.stringify(projectJSON)], {type: "application/json;charset=utf-8"});
  saveAs(blob, projectname + ".json");
};
$('[data-project=export]').on('click', function() {
  exportJSON();
});
$('[data-exportframe=svg]').on('click', function() {
  $(".canvas style").remove();
  $(".canvas script").remove();
  exportSVGFrame();
//  updatePreview();
});
$('[data-exportframe=png]').on('click', function() {
  exportPNGFrame();
//  updatePreview();
});
$('[data-exportzip]').on('click', function() {
  // if animation is playing stop it
  $('[data-play=false]').trigger('click');
  
  var projectname = $("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-");
  if (!$("[data-projectname]")[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $("[data-projectname]")[0].value = "_svgMotion";
  } else {
    projectname = projectname + '_svgMotion';
  }
  saveCode(projectname);
});
editOnCodepen.onclick = function() {
  var data = {
    title       : 'Edit SVG Path\'s Data with the GSAP MotionPathHelper Plugin',
    html        : '<div class="menu">\n  <input type="checkbox" id="initZoom" checked>\n  <label for="initZoom">Zoom </label>\n  <input type="text" id="pathVal">\n</div>\n\n<div class="svgmotion">'+ $('[data-canvas] svg')[0].outerHTML +'</div>',
    css         : 'html, body {\n  height: 100%;\n}\nbody {\n  margin: 0;\n  background-color: #131722;\n  background-image: linear-gradient(45deg, #1a1f2c 25%, transparent 25%), linear-gradient(-45deg, #1a1f2c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1f2c 75%), linear-gradient(-45deg, transparent 75%, #1a1f2c 75%);\n  background-size: 20px 20px;\n  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;\n}\n\n.menu {\n  position: absolute;\n  color: #fff;\n  z-index: 1;\n}\n\n.svgmotion, svg {\n  width: 100%;\n  height: 100%;\n}',
    js          : '// init zooming and panning\nvar drawArea = document.querySelector(".svgmotion");\nvar instance = panzoom(drawArea, {\n  bounds: true,\n  boundsPadding: 0.1\n});\ninitZoom.onchange = function() {\n  if (this.checked) {\n    instance.resume();\n  } else {\n    instance.pause();\n  }\n};\n\n// your path object\nvar selector = "'+ elms.value +'";\n\n// register the plugin (just once)\ngsap.registerPlugin(MotionPathPlugin);\n\n// get the current path data\npathVal.value = document.querySelector(selector).getAttribute("d");\n\n// now edit the path\nMotionPathHelper.editPath(selector, {\n  selected: true,\n  draggable: true,\n  handleSize: 7,\n  onRelease: () => {\n    // get the new path data\n    pathVal.value = document.querySelector(selector).getAttribute("d");\n\n    // copy the path data to the clipboard\n    navigator.clipboard.writeText(pathVal.value);\n  }\n});',
    js_external : 'https://unpkg.co/gsap@3/dist/gsap.min.js;https://unpkg.com/gsap@3/dist/MotionPathPlugin.min.js;https://assets.codepen.io/16327/MotionPathHelper.min.js;https://unpkg.com/panzoom@8.7.3/dist/panzoom.min.js',
    editors: '000'
  };
  var JSONstring = JSON.stringify(data).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  
  var form = 
  '<form id="tempElm" action="https://codepen.io/pen/define" method="POST" target="_blank" style="display: none;">' + 
    '<input type="hidden" name="data" value=\'' + 
      JSONstring + 
      '\'>' + 
    '<button>Create New Pen with Prefilled Data</button>' +
  '</form>';
  
  if (($(elms.value).prop('tagName').toLowerCase() === 'path')) {
    $('body').append(form);
    $('#tempElm button').trigger('click');
    $('#tempElm').remove();
  } else {
    alertify.error('Error: Only path elements can be manipulated!');
    return false;
  }
};

// hide tools options onload
$('[data-toolsmenu]').hide();
$('[data-toolsmenu] [data-toolsoption]').hide();

// hide dialogs onload
$('[data-dialogs] [data-dialog]').hide();
$('[data-tools=zoom]').trigger('click');

function initDemo() {
  // set the canvas size
  $('[data-project=width]').val(1280);
  $('[data-project=height]').val(800);
  $('[data-canvas]').css('width', $('[data-project=width]').val() + 'px');
  $('[data-canvas]').css('height', $('[data-project=height]').val() + 'px');
  
  // clear and reset the canvas
  $('[data-canvas]').empty().html(origSVG);
  
  // reset setting inputs
  $('[data-projectname]').val('Character Walking').trigger('change');
  $('[data-notepad]').val('This demo demonstrates frame by frame animation utilized with tween-based animations.');
//  $('[data-keyselector=misc]').val("function rig(selector, val) {\n  $(selector).hide();\n  $(selector + ':nth-child('+ val +')').css({\n    display: 'block',\n    opacity: '100%'\n  });\n}");
  
  // init filters
  blurfilter.value = 0;
  huefilter.value = -6;
  brightnessfilter.value = 0.76;
  contrastfilter.value = 1.8;
  saturatefilter.value = 1;
  grayscalefilter.value = 0;
  sepiafilter.value = 30;
  invertfilter.value = 0;
  applyFilters();
  
  $('[data-call=layers]').trigger('click');
  $('[data-selectorlist] span').filter(function() {
    if (this.textContent === 'g > g:nth-child(4)') {
      $(this).trigger('click');
    } else {
      return false;
    }
  });
  // frame by frame animation string adds " > g"
  $('[data-close=layers]').trigger('click');
  
  // lower font-size
  $('[data-fontsize]').val(12).trigger('change');
}

// bot
initDemo();
$('[data-call=keys]').trigger('click');

