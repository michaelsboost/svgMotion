/*
  Version: 0.401
  svgMotion, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE
  
  This is svgMotion (https://michaelsboost.github.io/svgMotion/), A vector animation tool
*/

var $arr, $array, $str, $elm, $this, $sel, $val, $valz, $code, $start, $num, origCanvas,
    $version    = '0.401',
    codeStr     = "",
    remStr      = "html > body > div:nth-child(3) > svg > ",
    projectJSON = "",
    saveAsPNG = function(value) {
      saveSvgAsPng(document.querySelector(".canvas svg"), value + ".png");
    };

// initiate new project
function newProject() {
  swal({
    title: 'Are you sure you want to start a new project?',
    text: "You will lose all your work and you won't be able to revert this!",
    type: 'warning',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      if ($('[data-show].active').is(':visible')) {
        $('[data-props]').addClass('hide');
        $('[data-display=props]').addClass('hide');
        $('[data-show].active').removeClass('active');
      }
      if ($('.dialog.animpanel').is(':visible')) {
        $('[data-close=keys]').trigger('click');
      }
      if ($('.dialog.librarydialog').is(':visible')) {
        $('[data-close=library]').trigger('click');
      }
      $('[data-keys], .canvas').empty();
      $('.defaultcur').text('0.0');
      updateKeyPosition(0.0);
    }
  })
}
$('[data-project=new]').on("click", function() {
  newProject();
});

// save files
function getProjectJSON() {
  projectJSON = {
    "version": 0.4,
    "svg": origCanvas,
    "keys": $("[data-keys]").html(),
    "groups": $("[data-groups] ul").html(),
    "settings": [{
      "theme": $('[data-theme]').attr('data-theme'),
      "name": $('[data-project=name]').val(),
      "size": $('[data-project=size]').val(),
      "fps": $('[data-project=fps]').val(),
      "selectioncolor": $('[data-selectioncolor]').val(),
      "swatches": [
        $('.defaultswatch')[0].value,
        $('.defaultswatch')[1].value,
        $('.defaultswatch')[2].value,
        $('.defaultswatch')[3].value,
        $('.defaultswatch')[4].value,
        $('.defaultswatch')[5].value,
        $('.defaultswatch')[6].value,
        $('.defaultswatch')[7].value,
        $('.defaultswatch')[8].value,
        $('.defaultswatch')[9].value,
        $('.defaultswatch')[10].value,
        $('.defaultswatch')[11].value,
        $('.defaultswatch')[12].value,
        $('.defaultswatch')[13].value
      ],
      "notepad": $('[data-project=notepad]').val()
    }]
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
    zip.file("index.html", '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1">\n    <style>\n    body {margin:0;}</style>\n  </head>\n  <body>\n    <div class="svgmotion">\n      '+ $('.canvas').html() +'\n    </div>\n\n    <script src="libraries/gsap-public/minified/gsap.min.js"></script>\n    <script src="js/animation.js"></script>\n  </body>\n</html>');

    // javascript
    $code = '';
    $('[data-function]').each(function() {
      $code += this.value + '\n';
    });
    $code = '/*\n  This animation was created using svgMotion v'+ $version.toString() +'\n  Create yours today at https://michaelsboost.com/svgMotion\n*/\n\nvar tl = new TimelineMax({\n  repeat: -1\n})\n\n' + $code.split('.canvas').join('.svgmotion') + '\nvar fps = '+ $('[data-project=fps]').val() +';\nvar duration = tl.duration();\nvar frames = Math.ceil(duration / 1 * fps);\ntl.play(0);'

    zip.file("js/animation.js", $code);
    var content = zip.generate({type:"blob"});
    saveAs(content, filename + ".zip");
  });
}
function exportSVGFrame() {
  var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-");
  if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $("[data-project=name]")[0].value = "svgMotion-animation-frame-" + $('.defaultcur').text().toString().split('.').join('_');
  }
  blob = new Blob([ '<!-- Generator: svgMotion - https://michaelsboost.com/svgMotion/ -->\n' + $(".canvas").html() ], {type: "text/html"});
  saveAs(blob, projectname + ".svg");
}
function exportPNGFrame() {
  var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-");
  if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $("[data-project=name]")[0].value = "svgMotion-animation-frame-" + $('.defaultcur').text().toString().split('.').join('_');
  }
  saveSvgAsPng(document.querySelector(".canvas svg"), projectname + ".png");
}
$('[data-export=zip]').click(function() {
  var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-");
  if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $("[data-project=name]")[0].value = "svgMotion-animation";
  }
  saveCode(projectname);
});
$('[data-export=json]').click(function() {
  getProjectJSON();
  var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
  if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
    projectname = $("[data-project=name]")[0].value = "svgMotion-animation";
  }
  var blob = new Blob([JSON.stringify(projectJSON)], {type: "application/json;charset=utf-8"});
  saveAs(blob, projectname + ".json");
});
$('[data-export=svgframe]').on('click', function() {
  $(".canvas script").remove();
  exportSVGFrame();
  updatePreview();
});
$('[data-export=pngframe]').on('click', function() {
  exportPNGFrame();
  updatePreview();
});

// load svg file functions
var loadedJSON = {};
function loadJSON() {
  $(".canvas, [data-keys], [data-display=selector]").html('');
  $(".canvas").html(loadedJSON.svg);
  $("[data-keys]").html(loadedJSON.keys);
  $("[data-groups] ul").html(loadedJSON.groups);
    
  if (!loadedJSON.version) {
    swal({
      title: 'Warning!',
      text: "This project is using a version of svgMotion that's no longer supported.",
      type: 'warning',
    })
  } else {
    if (parseFloat(loadedJSON.version) <= 0.3) {
      swal({
        title: 'Warning!',
        text: "This project is using a version of svgMotion that's no longer supported.",
        type: 'warning',
      })
    } else 
    if (parseFloat($version) > parseFloat(loadedJSON.version)) {
      swal({
        title: 'Warning!',
        text: "This project is using an older version of svgMotion. Some features may not work!",
        type: 'warning',
      })
    }
  }
  // detect if is light or dark theme
  if (loadedJSON.settings[0].theme === 'dark') {
    if ($('[data-theme]').attr('data-theme') === 'light') {
      $('[data-theme]').trigger('click');
    }
  } else {
    if ($('[data-theme]').attr('data-theme') === 'dark') {
      $('[data-theme]').trigger('click');
    }
  }

  $('[data-project=name]').val(loadedJSON.settings[0].name);
  $('[data-project=size]').val(loadedJSON.settings[0].size);
  $('[data-project=fps]').val(loadedJSON.settings[0].fps);
  $('[data-selectioncolor]').val(loadedJSON.settings[0].selectioncolor);
  $('.defaultswatch')[0].value = loadedJSON.settings[0].swatches[0];
  $('.defaultswatch')[1].value = loadedJSON.settings[0].swatches[1];
  $('.defaultswatch')[2].value = loadedJSON.settings[0].swatches[2];
  $('.defaultswatch')[3].value = loadedJSON.settings[0].swatches[3];
  $('.defaultswatch')[4].value = loadedJSON.settings[0].swatches[4];
  $('.defaultswatch')[5].value = loadedJSON.settings[0].swatches[5];
  $('.defaultswatch')[6].value = loadedJSON.settings[0].swatches[6];
  $('.defaultswatch')[7].value = loadedJSON.settings[0].swatches[7];
  $('.defaultswatch')[8].value = loadedJSON.settings[0].swatches[8];
  $('.defaultswatch')[9].value = loadedJSON.settings[0].swatches[9];
  $('.defaultswatch')[10].value = loadedJSON.settings[0].swatches[10];
  $('.defaultswatch')[11].value = loadedJSON.settings[0].swatches[11];
  $('.defaultswatch')[12].value = loadedJSON.settings[0].swatches[12];
  $('.defaultswatch')[13].value = loadedJSON.settings[0].swatches[13];
  $('[data-project=notepad]').val(loadedJSON.settings[0].notepad);
  svgLoaded();
}
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
      
      var keys = document.querySelector("[data-keys]");
      if (keys.innerHTML) {
        swal({
          title: 'Keyframes Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            $('[data-keys]').html('');
          }
        })
      }

      document.querySelector(".canvas").innerHTML = e.target.result;
      svgLoaded();
    } else if (path.toLowerCase().substring(path.length - 5) === ".json") {
      if ($('[data-keys]').html()) {
        swal({
          title: 'Keys Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            $('[data-keys]').html('');
            loadedJSON = JSON.parse(e.target.result);
            loadJSON();

            $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
            $("[data-action=fadeOut]").fadeOut(400, function() {
              $("[data-action=fadeOut]").remove();
            });
          }
        })
      } else {
        $('[data-keys]').html('');
        loadedJSON = JSON.parse(e.target.result);
        loadJSON();

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
function dropfile(file) {
  var reader = new FileReader();  
  reader.onload = function(e) {
    if (file.type === "image/svg+xml") {
      // is animation playing? If so stop
      if ($('[data-play]').attr('data-play') === 'stop') {
        // trigger stop
        $('[data-play=stop]').trigger('click');
      }
      
      var keys = document.querySelector("[data-keys]");
      if (keys.innerHTML) {
        swal({
          title: 'Keyframes Detected!',
          text: "Would you like to clear these?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            if ($('[data-show].active').is(':visible')) {
              $('[data-props]').addClass('hide');
              $('[data-display=props]').addClass('hide');
              $('[data-show].active').removeClass('active');
            }
            if ($('.dialog.animpanel').is(':visible')) {
              $('[data-close=keys]').trigger('click');
            }
            if ($('.dialog.librarydialog').is(':visible')) {
              $('[data-close=library]').trigger('click');
            }
            $('[data-keys]').empty();
            $('.defaultcur').text('0.0');
            updateKeyPosition(0.0);
          }
        })
      }

      document.querySelector(".canvas").innerHTML = e.target.result;
      svgLoaded();
    } else if (file.type === "application/json") {
      // is animation playing? If so stop
      if ($('[data-play]').attr('data-play') === 'stop') {
        // trigger stop
        $('[data-play=stop]').trigger('click');
      }
      
      var keys = document.querySelector("[data-keys]");
      if (keys.innerHTML) {
        swal({
          title: 'Project Detected!',
          text: "Are you sure you want to clear this?",
          type: 'question',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            if ($('[data-show].active').is(':visible')) {
              $('[data-props]').addClass('hide');
              $('[data-display=props]').addClass('hide');
              $('[data-show].active').removeClass('active');
            }
            if ($('.dialog.animpanel').is(':visible')) {
              $('[data-close=keys]').trigger('click');
            }
            if ($('.dialog.librarydialog').is(':visible')) {
              $('[data-close=library]').trigger('click');
            }
            $('[data-keys]').empty();
            $('.defaultcur').text('0.0');
            updateKeyPosition(0.0);
            
            loadedJSON = JSON.parse(e.target.result);
            loadJSON();

            $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 3;"></div>');
            $("[data-action=fadeOut]").fadeOut(400, function() {
              $("[data-action=fadeOut]").remove();
            });
          } else {
            return false;
          }
        })
      } else {
        $('[data-keys]').html('');
        loadedJSON = JSON.parse(e.target.result);
        loadJSON();

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
}
function svgLoaded() {
  // clear canvas
  $('[data-display=selector]').html('');
  
  // locate SVG
  var $Canvas = document.querySelector(".canvas > svg");
  if ($Canvas) {
    // canvas interactive selection
    $('.canvas svg *').on('click', function() {
      // is library visible? if so proceed
      if ($('.libraryh').is(':visible')) {
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
        }
      }
      return false;
    });

    // remove width/height attributes if detected
    if ($Canvas.getAttribute("width") || $Canvas.getAttribute("height")) {
      w = $Canvas.getAttribute("width");
      w = parseFloat(w, 10);
      h = $Canvas.getAttribute("height");
      h = parseFloat(h, 10);
      $("[data-project=size]").val(w + "x" + h).trigger('change');
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
    $("[data-project=name]").trigger("keyup");
    
    // list all elements as list
    var fullSVGlength = $(".canvas svg *").length;
    $(".canvas svg *").each(function(i) {
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

          // render selectors in canvas
          $('[data-selectorlist].selector').each(function() {
            if ($str === "") {
              $str = ".canvas svg > " + $(this).find('span').text();
            } else {
              $str += ", .canvas svg > " + $(this).find('span').text();
            }
            $($str).attr("data-selected", "");
          });
          return false;
        });
      }
    });
    
    origCanvas = $('.canvas').html();
  } else {
    alertify.error("Error: No svg element detected!");
  }
}
svgLoaded();

// selectors for svg animation
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
  } else 
    if ($val === 'none') {
    $('[data-display=selector] li').removeClass('selector');

    // clear canvas selector(s)
    if ($('[data-selected]').is(':visible')) {
      $("[data-selected]").removeAttr("data-selected");
    }
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
  });
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

// project name show in document title
$("[data-project=name]").on("keyup", function() {
  document.title = "svgMotion: " + this.value;
}).trigger('keyup');

// open library
$('[data-open=library]').click(function() {
  $('.canvas').addClass('r50p');
  $('.mainh').addClass('hide');
  $('.librarydialog, .libraryh').removeClass('hide');
  $('[data-open=animationtype]').text('animate');
  $('[data-selected]').removeAttr('style');

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
});
// close library
$('[data-close=library]').click(function() {
  $('.canvas').removeClass('r50p');
  $('.mainh').removeClass('hide');
  $('.librarydialog, .libraryh').addClass('hide');

  // is selected already visible? If so remove to select active one
  if ($('[data-selected]').is(':visible')) {
    $("[data-selected]").removeAttr("data-selected");
  }
});

// canvas interactive selection
$('.canvas svg *').on('click', function() {
  // is library visible? if so proceed
  if ($('.libraryh').is(':visible')) {
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
    }
  }
  $fill   = $(this).attr('fill');
  $stroke = $(this).attr('stroke');
  $('[data-animate=fill]').val($fill);
  $('[data-animate=stroke]').val($stroke);
  $('[data-animate=fill]').minicolors('value', $('[data-animate=fill]').val());
  $('[data-animate=stroke]').minicolors('value', $('[data-animate=stroke]').val());

  return false;
});

// animation window to add keyframe
$('[data-trigger]').on('click', function() {
  $val = $(this).data('trigger');
  
  if ($val === 'animate') {
    // trigger animation dialog
    if (!$('[data-selectorlist].selector').is(":visible")) {
      alertify.error('Error: Selector not found');
      return false;
    }
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
  });
});

// open/close animation type dialog
$('[data-close=animationtype]').click(function() {
  $(this).parent().addClass('hidden');
  anim.restart();
  anim.pause();
});
$('[data-open=animationtype]').click(function() {
  if ($('li[data-selectorlist].selector').length === 0) {
    alertify.error('Error: Selector not found!');
    return false;
  }
  
  if (this.textContent.toLowerCase() === "animate") {
    // if only 1 class is selected automatically use a .to() tween
    if ($('[data-selectorlist].selector').length === 1) {
      $('[data-confirm=to]').trigger('click');
      
//      if ($('[data-selected]')[0].tagName.toLowerCase() === 'path' || $('[data-selected]')[0].tagName.toLowerCase() === 'polygon' || $('[data-selected]')[0].tagName.toLowerCase() === 'line') {
////        $('[data-open=editpath]').removeClass('hide');
//      } else {
////        $('[data-open=editpath]').addClass('hide');
//      }

    } else {
      $('[data-dialog=animationtype]').removeClass('hidden');
//      $('[data-open=editpath]').addClass('hide');
      anim.play();
    }
  }
});

// edit path
//$('[data-open=editpath]').click(function() {
//  if ($('.keyframe.active').is(':visible')) {
//    if ($('[data-selected]')[0].tagName.toLowerCase() === 'path' || $('[data-selected]')[0].tagName.toLowerCase() === 'polygon' || $('[data-selected]')[0].tagName.toLowerCase() === 'line') {
//      alertify.log('edit path');
//    }
//  } else {
//    alertify.error('Error: Cannot Open! No keyframe selected!');
//  }
//});

// open animation
function openAnimation() {
  $('.libraryh').addClass('hide');
  $('.keysh').removeClass('hide');
  $('.dialog').not('.animationtype').addClass('hide');
  $('.dialog.animpanel').removeClass('hide');
  $('.dialog.animtimeline').removeClass('hide');
  $('[data-close=animationtype]').trigger('click');
  $('.canvas').removeClass('r50p').css('bottom', '110px');
  $('[data-selected]').css('outline', 'none');
  updatePreview();
  
  // only show keyframes for the selected library
  if ($('li[data-selectorlist].selector').length === 1) {
    $sel = $('li[data-selectorlist].selector span').text();
    $sel = '.canvas > svg > ' + $sel;
  } else {
    $arr = [];

    $('li[data-selectorlist].selector span').each(function() {
      $arr.push(this.textContent);
    });
    $sel = $arr.join().replace(/,/g, ', .canvas > svg > ');
    $sel = '.canvas > svg > ' + $sel;
    $sel.split(',').join(', .canvas > svg > ');
  }

  if (!$('.keyframe > span:contains('+ $sel +')').is(':visible')) {
    $('.keyframe').addClass('hide');
    $('.keyframe').find('span:contains('+ $sel +')').parent().removeClass('hide');
  } else {
    $('.keyframe').addClass('hide');
  }
  
  // remember if keyframe properties are open
  if ($('[data-show].active').is(':visible')) {
    $('[data-display=props]').removeClass('hide');
    $('[data-props='+ $('[data-show].active').attr('data-show') +']').addClass('removeClass');
  } else {
    $('[data-display=props]').addClass('hide');
    $('[data-props]').addClass('hide');
  }
}

// live preview
function updatePreview() {
  $('[data-selected]').css('outline', 'none');
  
  // javascript
  $code = '';
  $('[data-function]').each(function() {
    $code += this.value + '\n';
  });
  $code = 'var tl = new TimelineMax({repeat:-1})\n\n' + $code + '\nvar fps = '+ $('[data-project=fps]').val() +';\nvar duration = tl.duration();\nvar frames = Math.ceil(duration / 1 * fps);\ntl.pause('+ $('.defaultcur').text() +').timeScale(1);';
  
  $(".canvas").empty().append( origCanvas + '<script>\n      '+ $code +'\n    </script>');
}

// open/close keys
$('[data-confirm=stagger]').click(function() {
  openAnimation();
  $('[data-close=animationtype]').trigger('click');
  
  // disable drawPath for array of selectors
  $str = 'drawPath';
  if ($('li[data-selectorlist].selector').length === 1) {
    $sel = $('li[data-selectorlist].selector span').text();
    $sel = '.canvas > svg > ' + $sel;
    $('a[data-show=amount]').addClass('hide');
    $('[data-prop=amount]').addClass('hide');
    $('[data-animate=amount]').val('');
  } else {
    if (!$('[data-animate=drawPath]').is(':disabled')) {
      alertify.error('Error: Cannot drawPath for an array of selectors!');
      $('[data-drawPath]').attr('data-' + $str, 'false');
      $('[data-animate='+ $str +']').attr('disabled', 'true').trigger('change');
    }
    $arr = [];

    $('li[data-selectorlist].selector span').each(function() {
      $arr.push(this.textContent);
    });
    $sel = $arr.join().replace(/,/g, ', ');
    $('a[data-show=amount]').removeClass('hide');
    $('[data-prop=amount]').removeClass('hide');
    $('[data-animate=amount]').val('');
  }

  // if an animation property is already visible lets hide it
  if ($('[data-show].active').is(':visible')) {
    if (!$('.keyframe.active').is(':visible')) {
      $('[data-show].active').removeClass('active');
      $('[data-display=props], [data-display=props] li').addClass('hide');
    }
  }
});
$('[data-confirm=to]').click(function() {
  openAnimation();
  $('.libraryh').addClass('hide');
  $('.keysh').removeClass('hide');
  $('[data-close=animationtype]').trigger('click');
  
  // disable drawPath for array of selectors
  $str = 'drawPath';
  if ($('li[data-selectorlist].selector').length === 1) {
    $sel = $('li[data-selectorlist].selector span').text();
    $sel = '.canvas > svg > ' + $sel;
    $('a[data-show=amount]').addClass('hide');
    $('[data-prop=amount]').addClass('hide');
    $('[data-animate=amount]').val('');
  } else {
    if (!$('[data-animate=drawPath]').is(':disabled')) {
      alertify.error('Error: Cannot drawPath for an array of selectors!');
      $('[data-drawPath]').attr('data-' + $str, 'false');
      $('[data-animate='+ $str +']').attr('disabled', 'true').trigger('change');
    }
    $arr = [];

    $('li[data-selectorlist].selector span').each(function() {
      $arr.push(this.textContent);
    });
    $sel = $arr.split(', .canvas > svg > ');
    $sel.split('.canvas > svg > ');
    
    $('a[data-show=amount]').addClass('hide');
    $('[data-prop=amount]').addClass('hide');
    $('[data-animate=amount]').val('');
  }

  // if an animation property is already visible lets hide it
  if ($('[data-show].active').is(':visible')) {
    if (!$('.keyframe.active').is(':visible')) {
      $('[data-show].active').removeClass('active');
      $('[data-display=props], [data-display=props] li').addClass('hide');
    }
  }
});

// open keys
$('[data-open=keys]').click(function() {
  if ($('li[data-selectorlist].selector').length === 0) {
    alertify.error('Error: Selector not found!');
    return false;
  }
  $('[data-open=library]').trigger('click');
  openAnimation();
  
  // only show keys for the active selector
  if ($('li[data-selectorlist].selector').length === 1) {
    $sel = $('li[data-selectorlist].selector span').text();
    $sel = '.canvas > svg > ' + $sel;
  } else {
    $arr = [];

    $('li[data-selectorlist].selector span').each(function() {
      $arr.push(this.textContent);
    });
    $sel = $arr.join().replace(/,/g, ', ');
  }
  
  $('[data-show]').removeClass('active');
  $('[data-display=props]').addClass('hide');
  $('[data-display=props] [data-props]').addClass('hide');
  $('.playback').removeClass('hide');
});
// back to library
$('[data-backto=library]').click(function() {
  // is animation playing?
  if ($('[data-playit=stop]').is(':visible')) {
    $('[data-playit=stop]').trigger('click');
  }

  $('.dialog').not('.animationtype').addClass('hide');
  $('.dialog.librarydialog').removeClass('hide');
  $('.libraryh').removeClass('hide');
  $('.keysh').addClass('hide');
  $('[data-open=animationtype]').removeClass('hide');
  $('[data-open=animationtype]').text('animate');
  $('.canvas').empty().append(origCanvas);
  $('.canvas').removeClass('hide').addClass('r50p').css('bottom', '0');
  $('.keyframe.active').removeClass('active');
  $('[data-selected]').removeAttr('style');
  
  // reset canvas interactive selection
  $('.canvas svg *').on('click', function() {
    // is library visible? if so proceed
    if ($('.libraryh').is(':visible')) {
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
      }
    }

    return false;
  });

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
});
// close keys entirely
$('[data-close=keys]').click(function() {
  // is animation playing?
  if ($('[data-playit=stop]').is(':visible')) {
    $('[data-playit=stop]').trigger('click');
  }
  
  $('.dialog').not('.animationtype').addClass('hide');
  $('.canvas').removeClass('r50p');
  $('.mainh').removeClass('hide');
  $('[data-open=animationtype]').removeClass('hide');
  $('.librarydialog, .libraryh, .keysh').addClass('hide');
  $('.canvas').empty().append(origCanvas);
  $('.canvas').removeClass('hide').css('bottom', '0');
  $('.keyframe.active').removeClass('active');
  
  // is selected already visible? If so remove to select active one
  if ($('[data-selected]').is(':visible')) {
    $("[data-selected]").removeAttr("data-selected");
  }
  
  // reset canvas interactive selection
  $('.canvas svg *').on('click', function() {
    // is library visible? if so proceed
    if ($('.libraryh').is(':visible')) {
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
      }
    }

    return false;
  });
});

// every 10th (.1) of a second is 10px = .key rect[width=10]
$(".footer").mousedown(function(e) {
  var $start = e.clientX;
  $(this).mousemove(function(e) {
    // detect seconds
    $num = parseFloat(parseFloat($start - e.clientX) / 10).toFixed(1);

    if ($num < 0 ) {
      $('[data-keys]').css('margin-left', 0);
      return false;
    }
    
    $('.defaultcur').text($num);
    $('[data-keys]').css('margin-left', '-' + parseFloat($('.defaultcur').text() * 100 + 19).toFixed(0) + 'px');
    updatePreview();
  });
}).mouseup(function() {
    $(this).off('mousemove');
}).mouseout(function() {
    $(this).off('mousemove');
});

// Register touchstart and touchend listeners for element 'source'
var footer = document.querySelector(".footer");
jQuery.event.special.touchstart = {
  setup: function( _, ns, handle ) {
    this.addEventListener('touchstart', handle, { passive: !ns.includes('noPreventDefault') });
  }
};
jQuery.event.special.touchmove = {
  setup: function( _, ns, handle ) {
    this.addEventListener('touchmove', handle, { passive: !ns.includes('noPreventDefault') });
  }
};
function getPos(event) {
  // Cache the client X coordinates
  $start = event.touches[0].clientX;
  
  footer.addEventListener('touchmove', function(event) {
    // detect seconds
    $num = parseFloat(parseFloat($start - event.touches[0].clientX) / 10).toFixed(1);

    if ($num < 0 ) {
      $('[data-keys]').css('margin-left', 0);
      return false;
    }
    
    $('.defaultcur').text($num);
    $('[data-keys]').css('margin-left', '-' + parseFloat($('.defaultcur').text() * 100 + 19).toFixed(0) + 'px');
    updatePreview();
  }, false);
}
function updateKeyPosition(val) {
  if (val === 0.0) {
      $('[data-keys]').css('margin-left', 0);
  } else {
    $('[data-keys]').css('margin-left', '-' + parseFloat(parseFloat(val) * 100 + 19).toFixed(0) + 'px');
  }
}
footer.addEventListener('touchstart', function(e) {
  getPos(e);
}, false);

// clear event listener
footer.addEventListener('touchend', function(e) {
  footer.removeEventListener("touchstart", getPos);
  footer.removeEventListener("touchmove", getPos);
}, false);

// animation groups
$('[data-open=groups]').click(function() {
  $('[data-groups]').removeClass('hide');
});
TweenMax.set("[data-projectGroups]", {xPercent:-50, left:"50%", yPercent:-50, top:"50%", position: "absolute"});
$("[data-toggle=projectGroups]").click(function() {
  $("[data-groups]").fadeToggle();
});

// group triggered
function triggerGroup(e) {
  var $sel = $(e).parent().find('div').text();
  
  // if keyframe is active deactivate it
  if ($('.keyframe.active').is(':visible')) {
    $('.keyframe.active').trigger('click')
  }
  
  $('[data-toggle=projectGroups]').eq(0).trigger('click');
  $('[data-backto=library]').trigger('click');
  $('[data-select=none]').trigger('click');
  
  $('[data-selectorlist] span').filter(function() {
    if ($(this).text() === $sel) {
      $(this).parent().trigger('click');
      $('[data-open=animationtype]').trigger('click');
    } else {
      return false;
    }
  });
}

// timeline playback
function getCode() {
  // javascript
  $code = '';
  $('[data-function]').each(function() {
    $code += this.value + '\n';
  });
  $code = 'var tl = new TimelineMax({repeat:-1})\n\n' + $code + '\nvar fps = '+ $('[data-project=fps]').val() +';\nvar duration = tl.duration();\nvar frames = Math.ceil(duration / 1 * fps);\ntl.play(0).timeScale(1);';
  
  $(".canvas").empty().append(origCanvas + '<script>\n      '+ $code +'\n    </script>');
}
$('[data-render=play]').click(function() {
  if (!$("[data-keys]").html()) {
    alertify.error("Abort Operation: No keys detected!");
    return false;
  }

  if ($(this).attr('data-render') === 'play') {
    $('[data-open=library], [data-open=keys], label[for=openfile], [data-toggle=projectSettings]').addClass('hide');
    $(this).attr('data-render', 'stop');
    $(this).html('<i class="fa fa-stop"></i>');
    
    getCode();
    setTimeout(function() {
      var fps = $("[data-project=fps]").val();
      var duration = tl.duration();
//      var duration = tl.totoalDuration();
//      var duration = tl.totalDuration();
      var frames   = Math.ceil(duration / 1 * fps);
      var current  = 0;

      // canvas
      var svg  = document.querySelector(".canvas svg");
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      if (!$("[data-project=size]").val()) {
        $("[data-project=size]").val("800x600");
      }

      var str = $("[data-project=size]").val();
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
            $('.canvas').addClass('hide');
            $("body").append('<div class="table" data-show="preloader"><div class="cell"><div class="preloader"><svg class="w100p" viewBox="0 0 600 150"><text y="93.75" x="75" style="line-height:125%;" font-weight="400" font-size="80" font-family="Lato" letter-spacing="0" word-spacing="0" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><tspan>Creating GIF</tspan></text></svg></div></div></div>');

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
                    var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
                    if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
                      projectname = $("[data-project=name]")[0].value = "my-svgmotion-animation";
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
                  $('.canvas').removeClass('hide');
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
            var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
            if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
              projectname = $("[data-project=name]")[0].value = "my-svgmotion-animation";
            }
            saveAs(content, projectname + "-sequence.zip");
          };
        };

        if (current <= frames) {
          processImage();
          $('[data-export=images]').removeClass('hide');
          $('[data-export=gif]').removeClass('hide');
        } else {
          tl.play(0).timeScale(1.0);
        }
      }
      processImage();
    }, 2);
  } else {
    // stop animation
    // reset initial svg code
    $(".canvas").empty().append(origCanvas);
    $('[data-export=images]').addClass('hide');
    $('[data-export=gif]').addClass('hide');
    $('[data-open=library], [data-open=keys], label[for=openfile], [data-toggle=projectSettings]').removeClass('hide');
    
    // reset icon
    $(this).attr('data-render', 'play');
    $(this).html('<i class="fa fa-play"></i>');
    
    // canvas interactive selection
    $('.canvas svg *').on('click', function() {
      // is library visible? if so proceed
      if ($('.libraryh').is(':visible')) {
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
        }
      }
      
      return false;
    });
  }
});

$('[data-play=firstframe]').click(function() {
  str = parseFloat($('.defaultcur').text()).toFixed(1);
  if (str === '0.0') {
    alertify.error('You\'re already on the first frame.');
  } else {
    $('.defaultcur').text('0.0');
    updateKeyPosition($('.defaultcur').text());
    $('[data-keys]').css('margin-left', 0);
  }
  updatePreview();
});
$('[data-play=nextframe]').click(function() {
  str = parseFloat($('.defaultcur').text()).toFixed(1);
  str = parseFloat(str) + .10;
  $('.defaultcur').text(parseFloat(str).toFixed(1));
  updateKeyPosition(str);
  updatePreview();
});
$('[data-playit]').click(function() {
  if ($(this).attr('data-playit') === 'play') {
    $('[data-selected]').css('outline', 'none')

    // javascript
    $code = '';
    $('[data-function]').each(function() {
      $code += this.value + '\n';
    });
    $code = 'var tl = new TimelineMax({repeat:-1})\n\n' + $code + '\nvar fps = '+ $('[data-project=fps]').val() +';\nvar duration = tl.duration();\nvar frames = Math.ceil(duration / 1 * fps);\ntl.play(0).timeScale(1);'
  
    $(".canvas").empty().append( origCanvas + '<script>\n      '+ $code +'\n    </script>');

    $(this).attr('data-playit', 'stop');
    $(this).html('<i class="fa fa-stop"></i>');
    
    $('.canvas').css('bottom', 0);
    $('.canvas').css('z-index', '1');
//    $('.dialog.animpanel, .dialog.animtimeline').addClass('hide');
    $('[data-play=firstframe], [data-play=nextframe], [data-play=prevframe], [data-play=lastframe]').addClass('hide');
  } else {
    $('[data-selected]').removeAttr('data-selected');

    // javascript
    $code = '';
    $('[data-function]').each(function() {
      $code += this.value + '\n';
    });
    $code = 'var tl = new TimelineMax({repeat:-1})\n\n' + $code + '\nvar fps = '+ $('[data-project=fps]').val() +';\nvar duration = tl.duration();\nvar frames = Math.ceil(duration / 1 * fps);\ntl.pause(0).timeScale(1);'
  
    $(".canvas").empty().append( origCanvas + '<script>\n      '+ $code +'\n    </script>');

    $(this).attr('data-playit', 'play');
    $(this).html('<i class="fa fa-play"></i>');
    
    $('.canvas').css('bottom', '110px');
    $('.canvas').css('z-index', '0');
//    $('.dialog.animpanel, .dialog.animtimeline').removeClass('hide');
    $('[data-play=firstframe], [data-play=nextframe], [data-play=prevframe], [data-play=lastframe]').removeClass('hide');
  }
});
$('[data-play=prevframe]').click(function() {
  str = parseFloat($('.defaultcur').text()).toFixed(1);
  if (str <= '0.0') {
    alertify.error('Error: An animation cannot be less than 0 seconds.');
  } else {
    str = parseFloat(str) - .10;
    $('.defaultcur').text(parseFloat(str).toFixed(1));
    updateKeyPosition(str);
  }
  updatePreview();
});
$('[data-play=lastframe]').click(function() {
  $('[data-keys]').css('margin-left', 0);
  $val = parseFloat(parseFloat($('.keyframe:last').find('.key').css('margin-left')) + 19);
  $('[data-keys]').css('margin-left', '-' + $val + 'px');
  updatePreview();
});

// show/hide key values
$('[data-show]').on('click', function() {
  // user can only edit if there's an active keyframe
  if ($('.keyframe.active').is(':visible')) {
    $this = $(this).attr('data-show');
    $('.dialog.props').addClass('animpanel');

    // first detect if active is visible
    if ($('[data-props='+ $this +']').is(':visible')) {
      $('[data-show]').removeClass('active');
      $('[data-display=props], [data-props]').addClass('hide');
      $('.playback').removeClass('hide');
    } else {
      $('[data-show]').removeClass('active');
      $(this).addClass('active');
      $('[data-props]').addClass('hide');
      $('[data-display=props]').removeClass('hide');
      $('[data-props='+ $this +']').removeClass('hide');
      $('.playback').addClass('hide');
    }
    return false;
  } else {
    alertify.error('Error: No keyframe selected!');
  }
});

// toggle key props
$('[data-x]').click(function() {
  $str = 'x';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('min', '-100').attr('max', '100').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-y]').click(function() {
  $str = 'y';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('min', '-100').attr('max', '100').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-scalex]').click(function() {
  $str = 'scalex';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('1').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('1');
  }
});
$('[data-scaley]').click(function() {
  $str = 'scaley';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('1').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('1');
  }
});
$('[data-scale]').click(function() {
  $str = 'scale';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('1').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('1');
  }
});
$('[data-rotation]').click(function() {
  $str = 'rotation';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('min', '-360').attr('max', '360').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-transformOrigin]').click(function() {
  $str = 'transformOrigin';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('center center').attr('disabled', 'true');
  }
});
$('[data-opacity]').click(function() {
  $str = 'opacity';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('100').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('100');
  }
});
$('[data-fill]').click(function() {
  $str = 'fill';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').val($('[data-selected]').css('fill')).removeAttr('disabled');
    
    $('[data-animate='+ $str +']').minicolors({
      opacity: true,
      format: 'rgb',
      position: 'top left',
    //    inline: true,
      swatches: [$('.defaultswatch')[0].value, $('.defaultswatch')[1].value, $('.defaultswatch')[2].value, $('.defaultswatch')[3].value, $('.defaultswatch')[4].value, $('.defaultswatch')[5].value, $('.defaultswatch')[6].value, $('.defaultswatch')[7].value, $('.defaultswatch')[8].value, $('.defaultswatch')[9].value, $('.defaultswatch')[10].value, $('.defaultswatch')[11].value, $('.defaultswatch')[12].value, $('.defaultswatch')[13].value]
    });

    // disable scroll with color picker
    $('[data-animate='+ $str +']').on('focus', function() {
      $('.dialog').css('overflow', 'hidden');
      $('.dialog.animtimeline, .dialog.props.animpanel').css('height', '250px');
      $('.canvas').css('bottom', '250px');
      $('.minicolors-panel').css('margin-top', '-50px');
    }).on('blur', function() {
      $('.dialog').css('overflow', 'auto');
      $('.dialog.animtimeline, .dialog.props.animpanel').css('height', '55px');
      $('.minicolors-panel').css('margin-top', '');
      $('.canvas').css('bottom', '110px');
    });
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').attr('disabled', 'true');
    $('[data-animate='+ $str +']').minicolors('destroy');
  }
});
$('[data-stroke]').click(function() {
  $str = 'stroke';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').val($('[data-selected]').css('stroke')).removeAttr('disabled');
    
    $('[data-animate='+ $str +']').minicolors({
      opacity: true,
      format: 'rgb',
      position: 'top left',
    //    inline: true,
      swatches: [$('.defaultswatch')[0].value, $('.defaultswatch')[1].value, $('.defaultswatch')[2].value, $('.defaultswatch')[3].value, $('.defaultswatch')[4].value, $('.defaultswatch')[5].value, $('.defaultswatch')[6].value, $('.defaultswatch')[7].value, $('.defaultswatch')[8].value, $('.defaultswatch')[9].value, $('.defaultswatch')[10].value, $('.defaultswatch')[11].value, $('.defaultswatch')[12].value, $('.defaultswatch')[13].value]
    });

    // disable scroll with color picker
    $('[data-animate='+ $str +']').on('focus', function() {
      $('.dialog').css('overflow', 'hidden');
      $('.dialog.animtimeline, .dialog.props.animpanel').css('height', '250px');
      $('.canvas').css('bottom', '250px');
      $('.minicolors-panel').css('margin-top', '-50px');
    }).on('blur', function() {
      $('.dialog').css('overflow', 'auto');
      $('.dialog.animtimeline, .dialog.props.animpanel').css('height', '55px');
      $('.minicolors-panel').css('margin-top', '');
      $('.canvas').css('bottom', '110px');
    });
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').attr('disabled', 'true');
    $('[data-animate='+ $str +']').minicolors('destroy');
  }
});
$('[data-strokeWidth]').click(function() {
  $str = 'strokeWidth';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-borderRadius]').click(function() {
  $str = 'borderRadius';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-ease]').click(function() {
  $str = 'ease';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +'], [data-animate=easetype]').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +'], [data-animate=easetype]').attr('disabled', 'true');
  }
});
$('[data-duration]').click(function() {
  $str = 'duration';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('max', '10').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-delay]').click(function() {
  $str = 'delay';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('max', '10').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-repeat]').click(function() {
  $str = 'repeat';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').attr('disabled', 'true');
  }
});
$('[data-yoyo]').click(function() {
  $str = 'yoyo';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').attr('disabled', 'true');
  }
});
$('[data-amount]').click(function() {
  $str = 'amount';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('0').attr('max', '10').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('0');
  }
});
$('[data-drawPath]').click(function() {
  // selector(s) name for code
  $str = 'drawPath';

  // disable drawPath for array of selectors
  if ($('li[data-selectorlist].selector').length > 1) {
    alertify.error('Error: Cannot drawPath for an array of selectors!');
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').attr('disabled', 'true').trigger('change');
    return false;
  }
  
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').val('1').attr('max', '10').attr('disabled', 'true');
    $(this).parent().find('[data-val]').text('1');
  }
});
$('[data-motionPath]').click(function() {
  $str = 'motionPath';
  if ($(this).attr('data-' + $str) === 'false') {
    $(this).attr('data-' + $str, 'true');
    $('[data-animate='+ $str +']').removeAttr('disabled');
  } else {
    $(this).attr('data-' + $str, 'false');
    $('[data-animate='+ $str +']').attr('disabled', 'true');
  }
});
$('[data-decrement]').on('click', function() {
  $elm = $(this).parent().parent().find('input[data-animate]');
  $elm[0].stepDown();
  
  $('[data-animate='+ $(this).parent().parent().attr('data-props') +']').trigger('change');
});

// add/delete keys
function toggleKey(e) {
  if ($('.keyframe.active').is(':visible')) {
    if ($(e).hasClass('active')) {
//      $('[data-open=editpath]').addClass('hide');
      $('.keyframe.active').removeClass('active');
      $(e).removeClass('active');
  
      // clear inputs when class is not active
      $('[data-x=true], [data-y=true], [data-scalex=true], [data-scaley=true], [data-scale=true], [data-rotation=true], [data-transformOrigin=true], [data-opacity=true], [data-fill=true], [data-stroke=true], [data-strokeWidth=true], [data-borderRadius=true], [data-ease=true], [data-repeat=true], [data-yoyo=true], [data-duration=true], [data-delay=true], [data-amount=true], [data-drawPath=true], [data-motionPath=true]').trigger('click');
      $('[data-change=keylocation]').addClass('hide');
    } else {
      $('.keyframe.active').removeClass('active');
  
      // clear inputs when class is not active
      $('[data-x=true], [data-y=true], [data-scalex=true], [data-scaley=true], [data-scale=true], [data-rotation=true], [data-transformOrigin=true], [data-opacity=true], [data-fill=true], [data-stroke=true], [data-strokeWidth=true], [data-borderRadius=true], [data-ease=true], [data-repeat=true], [data-yoyo=true], [data-duration=true], [data-delay=true], [data-amount=true], [data-drawPath=true], [data-motionPath=true]').trigger('click');
      
      $(e).addClass('active');
      setTimeout($(e).find('[data-js]').val(), 1);
//      $('[data-open=editpath]').removeClass('hide');
      $('[data-change=keylocation]').removeClass('hide');
    }
  } else {
    // clear inputs when class is not active
    $('[data-x=true], [data-y=true], [data-scalex=true], [data-scaley=true], [data-scale=true], [data-rotation=true], [data-transformOrigin=true], [data-opacity=true], [data-fill=true], [data-stroke=true], [data-strokeWidth=true], [data-borderRadius=true], [data-ease=true], [data-repeat=true], [data-yoyo=true], [data-duration=true], [data-delay=true], [data-amount=true], [data-drawPath=true], [data-motionPath=true]').trigger('click');
    
    $(e).addClass('active');
    setTimeout($(e).find('[data-js]').val(), 1);
//    $('[data-open=editpath]').removeClass('hide');
    $('[data-change=keylocation]').removeClass('hide');
  }
}
$('[data-key=add]').click(function() {
  $val = parseFloat($('[data-keys]').css('margin-left')).toString().substr(1);
  
  $('.keyframe.active').removeClass('active');
  
  // clear inputs when class is not active
  $('[data-x=true], [data-y=true], [data-scalex=true], [data-scaley=true], [data-scale=true], [data-rotation=true], [data-transformOrigin=true], [data-opacity=true], [data-fill=true], [data-stroke=true], [data-strokeWidth=true], [data-borderRadius=true], [data-ease=true], [data-repeat=true], [data-yoyo=true], [data-duration=true], [data-delay=true], [data-amount=true], [data-drawPath=true], [data-motionPath=true]').trigger('click');
  
  if (!$val) {
    $('[data-keys]').append('<div class="keyframe active pointer" data-timeline="'+ $('.defaultcur').text().split('.').join('_') +'" onclick="toggleKey(this)"><svg class="key" style="margin-left: -19px;"><rect x="20" width="0" height="30" style="fill:rgb(30,126,235)" fill-opacity="1"/><path d="m20,0l-10.71434,15l10.71434,15l10.71434,-15l-10.71434,-15z"></path></svg><span class="hide">'+ $sel +'</span><textarea class="hide" data-function></textarea><textarea class="hide" data-js></textarea></div>');
  } else {
    if ($('.defaultcur').text() === '0.0') {
      $('.keyframe.active').removeClass('active');
      $('[data-keys]').append('<div class="keyframe active pointer" data-timeline="'+ $('.defaultcur').text().split('.').join('_') +'" onclick="toggleKey(this)"><svg class="key" style="margin-left: -19px;"><rect x="20" width="0" height="30" style="fill:rgb(30,126,235)" fill-opacity="1"/><path d="m20,0l-10.71434,15l10.71434,15l10.71434,-15l-10.71434,-15z"></path></svg><span class="hide">'+ $sel +'</span><textarea class="hide" data-function></textarea><textarea class="hide" data-js></textarea></div>');
    } else {
      $('.keyframe.active').removeClass('active');
      $('[data-keys]').append('<div class="keyframe active pointer" data-timeline="'+ $('.defaultcur').text().split('.').join('_') +'" onclick="toggleKey(this)"><svg class="key" style="margin-left: calc('+ parseFloat($('[data-keys]').css('margin-left')).toString().substr(1) +'px - 19px);"><rect x="20" width="0" height="30" style="fill:rgb(30,126,235)" fill-opacity="1"/><path d="m20,0l-10.71434,15l10.71434,15l10.71434,-15l-10.71434,-15z"></path></svg><span class="hide">'+ $sel +'</span><textarea class="hide" data-function></textarea><textarea class="hide" data-js></textarea></div>');
    }
    
    // append key to groups (only if this selector doesn't exist)
    $('[data-groups] ul').filter(function() {
      if ($(this).find('div').text() != $sel) {
        $('[data-groups] ul').append('<li><span contenteditable>'+ $sel +'</span><div class="hide">'+ $sel +'</div><a class="fr" onclick="triggerGroup(this)"><i class="fa fa-external-link-square-alt"></i></a></li>');
      }
    });
  }
//  $('[data-open=editpath]').removeClass('hide');
});
$('[data-key=delete]').click(function() {
  if ($('.keyframe.active').is(':visible')) {
    
    // detect if last keyframe for group. If so delete the last group before we delete the last keyframe
    $('.keyframe span').filter(function() {
      if ($(this).text() === $sel) {
        // only 1 of these selectors is visible
        if ($(this).length >= 1) {
          $('[data-groups] div').filter(function() {
            if ($(this).text() === $sel) {
              // group removed
              $(this).parent().remove();
            }
          });
        }
      }
    });
    
    $('.keyframe.active').remove();
    $('[data-change=keylocation]').addClass('hide');
//    $('[data-open=editpath]').addClass('hide');
    updatePreview();
  } else {
    alertify.error('Error: Cannot Delete! No keyframe selected!');
    return false;
  }
});

// update keyframe location
$('[data-change=keylocation]').click(function() {
  if ($('.keyframe.active').is(':visible')) {
    swal({
      title: 'Change Keyframe Location',
      input: 'number',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        if (parseFloat(result.value) === 0) {
          $('[data-keys]').css('margin-left', 0);
          $('.keyframe.active .key').css('margin-left', '-19px');
          $('.keyframe.active').attr('data-timeline', result.value.toString().split('.').join('_'));
          $('.defaultcur').text('0.0')
        } else {
          $('[data-keys]').css('margin-left', '-' + parseFloat(parseFloat(result.value) * 100 + 19).toFixed(0) + 'px');
          $('.keyframe.active .key').css('margin-left', 'calc('+ parseFloat('-' + parseFloat(parseFloat(result.value) * 100 + 19).toFixed(0)).toString().substr(1) +'px - 19px)');
          $('.keyframe.active').attr('data-timeline', result.value.toString().split('.').join('_'));
          $('.defaultcur').text(parseFloat(result.value).toFixed(1))
        }
        $('[data-animate]').trigger('change');
      } else {
        alertify.error('Operation Cancelled: No value set!');
      }
    });
  } else {
    alertify.error('Error: No keyframe selected!');
  }
});

// update preview code
$('[data-animate]').on('change keyup', function() {
  // selector(s) name for code
  if ($('li[data-selectorlist].selector').length === 1) {
    $sel = $('li[data-selectorlist].selector span').text();
    $sel = '.canvas > svg > ' + $sel;
  } else {
    $arr = [];

    $('li[data-selectorlist].selector span').each(function() {
      $arr.push(this.textContent);
    });
    $sel = $arr.join().replace(/,/g, ', .canvas > svg > ');
    $sel = '.canvas > svg > ' + $sel;
    $sel.split(',').join(', .canvas > svg > ');
  }
  
  // grab inputs for animation
  var $array = [
    (!$('[data-animate=x]').is(':disabled') ? 'x: ' + $('[data-animate=x]').val() : ''),
    (!$('[data-animate=y]').is(':disabled') ? 'y: ' + $('[data-animate=y]').val() : ''),
    (!$('[data-animate=scalex]').is(':disabled') ? 'scaleX: ' + $('[data-animate=scalex]').val() : ''),
    (!$('[data-animate=scaley]').is(':disabled') ? 'scaleY: ' + $('[data-animate=scaley]').val() : ''),
    (!$('[data-animate=scale]').is(':disabled') ? 'scale: ' + $('[data-animate=scale]').val() : ''),
    (!$('[data-animate=rotation]').is(':disabled') ? 'rotation: ' + $('[data-animate=rotation]').val() : ''),
    (!$('[data-animate=transformOrigin]').is(':disabled') ? 'transformOrigin: \'' + $('[data-animate=transformOrigin]').val() + '\'' : ''),
    (!$('[data-animate=opacity]').is(':disabled') ? 'opacity: ' + $('[data-animate=opacity]').val() : ''),
    (!$('[data-animate=fill]').is(':disabled') ? 'fill: \'' + $('[data-animate=fill]').val() + '\'' : ''),
    (!$('[data-animate=stroke]').is(':disabled') ? 'stroke: \'' + $('[data-animate=stroke]').val() + '\'' : ''),
    (!$('[data-animate=strokeWidth]').is(':disabled') ? 'strokeWidth: ' + $('[data-animate=strokeWidth]').val() : ''),
    (!$('[data-animate=borderRadius]').is(':disabled') ? 'borderRadius: ' + $('[data-animate=borderRadius]').val() : ''),
    (!$('[data-animate=ease]').is(':disabled') ? 'ease: \'' + $('[data-animate=ease]').val() + $('[data-animate=easetype]').val() + '\'' : ''),
    (!$('[data-animate=amount]').is(':disabled') ? 'stagger: { amount: '+ $('[data-animate=amount]').val() +' }' : ''),
    (!$('[data-animate=duration]').is(':disabled') ? 'duration: ' + $('[data-animate=duration]').val() : ''),
    (!$('[data-animate=delay]').is(':disabled') ? 'delay: ' + $('[data-animate=delay]').val() : ''),
    (!$('[data-animate=repeat]').is(':disabled') ? 'repeat: ' + $('[data-animate=repeat]').val() : ''),
    (!$('[data-animate=yoyo]').is(':disabled') ? 'yoyo: ' + $('[data-animate=yoyo]').val() : ''),
    (!$('[data-animate=drawPath]').is(':disabled') ? 'strokeDasharray: document.querySelector(\''+ $sel +'\').getTotalLength() + "," + document.querySelector(\''+ $sel +'\').getTotalLength(), strokeDashoffset: document.querySelector(\''+ $sel +'\').getTotalLength()' : ''),
    (!$('[data-animate=motionPath]').is(':disabled') ? 'motionPath: {path: "'+ $('[data-animate=motionPath]').val() +'"}' : '')
  ];
  $array = $array.filter(function(el) {
    return el != '';
  });
  
  var $arrayNoDur = [
    (!$('[data-animate=x]').is(':disabled') ? 'x: ' + $('[data-animate=x]').val() : ''),
    (!$('[data-animate=y]').is(':disabled') ? 'y: ' + $('[data-animate=y]').val() : ''),
    (!$('[data-animate=scalex]').is(':disabled') ? 'scaleX: ' + $('[data-animate=scalex]').val() : ''),
    (!$('[data-animate=scaley]').is(':disabled') ? 'scaleY: ' + $('[data-animate=scaley]').val() : ''),
    (!$('[data-animate=scale]').is(':disabled') ? 'scale: ' + $('[data-animate=scale]').val() : ''),
    (!$('[data-animate=rotation]').is(':disabled') ? 'rotation: ' + $('[data-animate=rotation]').val() : ''),
    (!$('[data-animate=transformOrigin]').is(':disabled') ? 'transformOrigin: \'' + $('[data-animate=transformOrigin]').val() + '\'' : ''),
    (!$('[data-animate=opacity]').is(':disabled') ? 'opacity: ' + $('[data-animate=opacity]').val() : ''),
    (!$('[data-animate=fill]').is(':disabled') ? 'fill: \'' + $('[data-animate=fill]').val() + '\'' : ''),
    (!$('[data-animate=stroke]').is(':disabled') ? 'stroke: \'' + $('[data-animate=stroke]').val() + '\'' : ''),
    (!$('[data-animate=strokeWidth]').is(':disabled') ? 'strokeWidth: ' + $('[data-animate=strokeWidth]').val() : ''),
    (!$('[data-animate=borderRadius]').is(':disabled') ? 'borderRadius: ' + $('[data-animate=borderRadius]').val() : ''),
    (!$('[data-animate=ease]').is(':disabled') ? 'ease: \'' + $('[data-animate=ease]').val() + $('[data-animate=easetype]').val() + '\'' : ''),
    (!$('[data-animate=amount]').is(':disabled') ? 'stagger: { amount: '+ $('[data-animate=amount]').val() +' }' : ''),
    (!$('[data-animate=delay]').is(':disabled') ? 'delay: ' + $('[data-animate=delay]').val() : ''),
    (!$('[data-animate=repeat]').is(':disabled') ? 'repeat: ' + $('[data-animate=repeat]').val() : ''),
    (!$('[data-animate=yoyo]').is(':disabled') ? 'yoyo: ' + $('[data-animate=yoyo]').val() : ''),
    (!$('[data-animate=drawPath]').is(':disabled') ? 'duration: 0, strokeDasharray: document.querySelector(\''+ $sel +'\').getTotalLength() + "," + document.querySelector(\''+ $sel +'\').getTotalLength(), strokeDashoffset: document.querySelector(\''+ $sel +'\').getTotalLength()' : ''),
    (!$('[data-animate=motionPath]').is(':disabled') ? 'motionPath: {path: "'+ $('[data-animate=motionPath]').val() +'"}' : '')
  ];
  $arrayNoDur = $arrayNoDur.filter(function(el) {
    return el != '';
  });
  
  if ($('.keyframe.active').is(':visible')) {
    // detect if it's 1 selector or an array of selectors
    if ($('li[data-selectorlist].selector').length === 1) {
      if (!$('[data-animate=drawPath]').is(':disabled')) {
        codeStr = '.to(\''+ $sel +'\', { '+ $arrayNoDur +' }, 0.0)' + (!$('[data-animate=drawPath]').is(':disabled') ? '.to(\''+ $sel +'\', {strokeDashoffset: 0, duration: '+ $('[data-animate=duration]').val() +'}, ' + $('.keyframe.active').attr('data-timeline').toString().split('_').join('.') +')' : '');
      } else {
        codeStr = '.to(\''+ $sel +'\', { '+ $array +' }, ' + $('.keyframe.active').attr('data-timeline').toString().split('_').join('.') +')';
      }
    } else {
      codeStr = '.to(\''+ $sel +'\', { '+ $array +' }, ' + $('.keyframe.active').attr('data-timeline').toString().split('_').join('.') +')';
    }

    $('.keyframe.active').find('[data-function]').html(codeStr);
    
    var $jsArr = [
      (!$('[data-animate=x]').is(':disabled') ? "$('[data-x=false]').trigger('click'); $('[data-animate=x]').attr('min', "+$('[data-animate=x]').attr('min')+"); $('[data-animate=x]').attr('max', "+$('[data-animate=x]').attr('max')+"); $('[data-animate=x]').val("+$('[data-animate=x]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=y]').is(':disabled') ? "$('[data-y=false]').trigger('click'); $('[data-animate=y]').attr('min', "+$('[data-animate=y]').attr('min')+"); $('[data-animate=y]').attr('max', "+$('[data-animate=y]').attr('max')+"); $('[data-animate=y]').val("+$('[data-animate=y]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=scalex]').is(':disabled') ? "$('[data-scalex=false]').trigger('click'); $('[data-animate=scalex]').val("+$('[data-animate=scalex]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=scaley]').is(':disabled') ? "$('[data-scaley=false]').trigger('click'); $('[data-animate=scaley]').val("+$('[data-animate=scaley]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=scale]').is(':disabled') ? "$('[data-scale=false]').trigger('click'); $('[data-animate=scale]').val("+$('[data-animate=scale]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=rotation]').is(':disabled') ? "$('[data-rotation=false]').trigger('click'); $('[data-animate=rotation]').attr('min', "+$('[data-animate=rotation]').attr('min')+"); $('[data-animate=rotation]').attr('max', "+$('[data-animate=rotation]').attr('max')+"); $('[data-animate=rotation]').val("+$('[data-animate=rotation]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=transformOrigin]').is(':disabled') ? "$('[data-transformOrigin=false]').trigger('click'); $('[data-animate=transformOrigin]').val('"+$('[data-animate=transformOrigin]').val()+"').trigger('change');\n" : ''),
      (!$('[data-animate=opacity]').is(':disabled') ? "$('[data-opacity=false]').trigger('click'); $('[data-animate=opacity]').val("+$('[data-animate=opacity]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=fill]').is(':disabled') ? "$('[data-fill=false]').trigger('click'); $('[data-animate=fill]').val('"+$('[data-animate=fill]').val()+"').trigger('change');\n" : ''),
      (!$('[data-animate=stroke]').is(':disabled') ? "$('[data-stroke=false]').trigger('click'); $('[data-animate=stroke]').val('"+$('[data-animate=stroke]').val()+"').trigger('change');\n" : ''),
      (!$('[data-animate=strokeWidth]').is(':disabled') ? "$('[data-strokeWidth=false]').trigger('click'); $('[data-animate=strokeWidth]').attr('min', "+$('[data-animate=strokeWidth]').attr('min')+"); $('[data-animate=strokeWidth]').attr('max', "+$('[data-animate=strokeWidth]').attr('max')+"); $('[data-animate=strokeWidth]').val("+$('[data-animate=strokeWidth]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=borderRadius]').is(':disabled') ? "$('[data-borderRadius=false]').trigger('click'); $('[data-animate=borderRadius]').attr('min', "+$('[data-animate=borderRadius]').attr('min')+"); $('[data-animate=borderRadius]').attr('max', "+$('[data-animate=borderRadius]').attr('max')+"); $('[data-animate=borderRadius]').val("+$('[data-animate=borderRadius]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=ease]').is(':disabled') ? "$('[data-ease=false]').trigger('click'); $('[data-animate=ease]').val('"+$('[data-animate=ease]').val()+"'); $('[data-animate=easetype]').val('"+$('[data-animate=easetype]').val()+"').trigger('change');\n" : ''),
      (!$('[data-animate=amount]').is(':disabled') ? "$('[data-amount=false]').trigger('click'); $('[data-animate=amount]').attr('min', "+$('[data-animate=amount]').attr('min')+"); $('[data-animate=amount]').attr('max', "+$('[data-animate=amount]').attr('max')+").trigger('change'); $('[data-animate=amount]').val("+$('[data-animate=amount]').val()+");\n" : ''),
      (!$('[data-animate=duration]').is(':disabled') ? "$('[data-duration=false]').trigger('click'); $('[data-animate=duration]').attr('min', "+$('[data-animate=duration]').attr('min')+"); $('[data-animate=duration]').attr('max', "+$('[data-animate=duration]').attr('max')+"); $('[data-animate=duration]').val("+$('[data-animate=duration]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=delay]').is(':disabled') ? "$('[data-delay=false]').trigger('click'); $('[data-animate=delay]').attr('min', "+$('[data-animate=delay]').attr('min')+"); $('[data-animate=delay]').attr('max', "+$('[data-animate=delay]').attr('max')+"); $('[data-animate=delay]').val("+$('[data-animate=delay]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=repeat]').is(':disabled') ? "$('[data-repeat=false]').trigger('click').trigger('change');\n" : ''),
      (!$('[data-animate=yoyo]').is(':disabled') ? "$('[data-yoyo=false]').trigger('click').trigger('change');\n" : ''),
      (!$('[data-animate=drawPath]').is(':disabled') ? "$('[data-drawPath=false]').trigger('click'); $('[data-animate=drawPath]').attr('min', "+$('[data-animate=drawPath]').attr('min')+"); $('[data-animate=drawPath]').attr('max', "+$('[data-animate=drawPath]').attr('max')+"); $('[data-animate=drawPath]').val("+$('[data-animate=drawPath]').val()+").trigger('change');\n" : ''),
      (!$('[data-animate=motionPath]').is(':disabled') ? "$('[data-motionPath=false]').trigger('click'); $('[data-animate=motionPath]').val('"+$('[data-animate=motionPath]').val()+"').trigger('change');\n" : '')
    ];
    $jsArr = $jsArr.filter(function(el) {
      return el != '';
    });

    $('.keyframe.active').find('[data-js]').html($jsArr);
    updatePreview();
  } else {
    // detect if it's 1 selector or an array of selectors
    if ($('li[data-selectorlist].selector').length === 1) {
      if (!$('[data-animate=drawPath]').is(':disabled')) {
        codeStr = '.to(\''+ $sel +'\', { '+ $arrayNoDur +' }, 0.0)' + (!$('[data-animate=drawPath]').is(':disabled') ? '.to(\''+ $sel +'\', {strokeDashoffset: 0, duration: '+ $('[data-animate=duration]').val() +'}, ' + $('.defaultcur').text() +')' : '');
      } else {
        codeStr = '.to(\''+ $sel +'\', { '+ $array +' }, ' + $('.defaultcur').text() +')';
      }
    } else {
      codeStr = '.to(\''+ $sel +'\', { '+ $array +' }, ' + $('.defaultcur').text() +')';
    }
    
    return false;
  }
});
$('[data-animate=x], [data-animate=y], [data-animate=rotation]').on('change', function() {
  $val = this.value;

  if (this.value === this.max) {
    this.max = parseFloat(parseFloat(100) + parseFloat($val));
    this.min = parseFloat(parseFloat(-100) + parseFloat($val));
  } else if (this.value === this.min) {
    this.max = parseFloat(parseFloat(100) + parseFloat($val));
    this.min = parseFloat(parseFloat(-100) + parseFloat($val));
  }

  $(this).nextAll('[data-val]').text(this.value);
});
$('[data-animate=strokeWidth], [data-animate=borderRadius], [data-animate=duration], [data-animate=delay], [data-animate=amount], [data-animate=drawPath]').on('change', function() {
  $val = this.value;

  if (this.value === this.max) {
    this.max = parseFloat(parseFloat(100) + parseFloat($val));
  }

  $(this).nextAll('[data-val]').text(this.value);
});
$('[data-animate=scalex], [data-animate=scaley], [data-animate=scale], [data-animate=opacity]').change(function() {
  $(this).nextAll('[data-val]').text(this.value);
});
$('[data-x], [data-y], [data-scalex], [data-scaley], [data-scale], [data-rotation], [data-transformOrigin], [data-opacity], [data-fill], [data-stroke], [data-strokeWidth], [data-borderRadius], [data-ease], [data-duration], [data-delay], [data-repeat], [data-yoyo], [data-amount], [data-drawPath]').click(function() {
  if ($(this).attr('data-drawpath')) {
    // selector(s) name for code
    if ($('li[data-selectorlist].selector').length === 1) {
      $sel = $('li[data-selectorlist].selector span').text();
      $sel = '.canvas > svg > ' + $sel;
    } else {
      return false;
    }
  }
  
  $(this).parent().find('[data-animate]').trigger('change');
});

// initate animation type animations
var anim = gsap.timeline({repeat:-1});
anim.to("[data-animationtype=stagger] g", {
  duration: 1,
  scale: 0.1,
  transformOrigin: "50% 50%",
  ease: "none",
  stagger: {
    amount: 1.5
  }
}, 0);
anim.to("[data-animationtype=stagger] g", {
  duration: 1,
  scale: 1,
  stagger: {
    amount: 1.5
  }
}, 2.5);
anim.to("[data-animationtype=to] g", {
  duration: 1,
  scale: 0.1,
  transformOrigin: "50% 50%",
  ease: "none"
}, 0);
anim.to("[data-animationtype=to] g", {
  duration: 1,
  scale: 1,
  transformOrigin: "50% 50%",
  ease: "none"
}, 2);
anim.restart();
anim.pause();

// alert user for coming soon
$('[data-comingsoon]').click(function() {
  alertify.log('coming soon...');
  return false;
});

// bot
function initDemo() {
  $('[data-project=name]').val('svgMotion Demo').trigger('change');
//  $('[data-project=size]').val('480x300').trigger('change');
  $('[data-project=size]').val('960x600').trigger('change');
  $('[data-open=library]').trigger('click');
  $('[data-selectorlist] span').filter(function() {
    if (this.textContent === 'g > g:nth-child(4) > g') {
      $(this).parent().trigger('click');
    } else {
      return false;
    }
  });
  $('[data-open=animationtype]').trigger('click');
  $('[data-key=add]').trigger('click');
  $('[data-show=rotation]').trigger('click');
  $('[data-rotation=false]').trigger('click');
  $('[data-animate=rotation]').val('-5').trigger('change');
  $('[data-show=rotation]').trigger('click');

  $('[data-show=transformOrigin]').trigger('click');
  $('[data-transformOrigin=false]').trigger('click');
  $('[data-animate=transformOrigin]').val('top center').trigger('change');
  $('[data-show=transformOrigin]').trigger('click');

  $('[data-show=duration]').trigger('click');
  $('[data-duration=false]').trigger('click');
  $('[data-animate=duration]').val('0').trigger('change');
  $('[data-show=duration]').trigger('click');

  $('[data-key=add]').trigger('click');
  $('[data-show=rotation]').trigger('click');
  $('[data-rotation=false]').trigger('click');
  $('[data-animate=rotation]').val('5').trigger('change');
  $('[data-show=rotation]').trigger('click');

  $('[data-show=transformOrigin]').trigger('click');
  $('[data-transformOrigin=false]').trigger('click');
  $('[data-animate=transformOrigin]').val('top center').trigger('change');
  $('[data-show=transformOrigin]').trigger('click');

  $('[data-show=ease]').trigger('click');
  $('[data-ease=false]').trigger('click');
  $('[data-animate=ease]').val('none').trigger('change');
  $('[data-animate=easetype]').val('').trigger('change');
  $('[data-show=ease]').trigger('click');

  $('[data-show=duration]').trigger('click');
  $('[data-duration=false]').trigger('click');
  $('[data-animate=duration]').val('0.9').trigger('change');
  $('[data-show=duration]').trigger('click');
  
  $('.defaultcur').text('1.0');
//  $('[data-keys]').css('margin-left', '-119px');
  updateKeyPosition(1.0);
  $('[data-key=add]').trigger('click');
  $('[data-show=rotation]').trigger('click');
  $('[data-rotation=false]').trigger('click');
  $('[data-animate=rotation]').val('-5').trigger('change');
  $('[data-show=rotation]').trigger('click');

  $('[data-show=transformOrigin]').trigger('click');
  $('[data-transformOrigin=false]').trigger('click');
  $('[data-animate=transformOrigin]').val('top center').trigger('change');
  $('[data-show=transformOrigin]').trigger('click');

  $('[data-show=ease]').trigger('click');
  $('[data-ease=false]').trigger('click');
  $('[data-animate=ease]').val('none').trigger('change');
  $('[data-animate=easetype]').val('').trigger('change');
  $('[data-show=ease]').trigger('click');

  $('[data-show=duration]').trigger('click');
  $('[data-duration=false]').trigger('click');
  $('[data-animate=duration]').val('0.9').trigger('change');
  $('[data-show=duration]').trigger('click');

  $('[data-backto=library]').trigger('click');
  $('[data-select=none').trigger('click');
  $('[data-selectorlist] span').filter(function() {
    if (this.textContent === 'g > g:nth-child(2) > path:nth-child(1)') {
      $(this).trigger('click');
    } else {
      return false;
    }
  });
  $('[data-open=animationtype]').trigger('click');

  $('[data-play=firstframe]').trigger('click');
  $('[data-key=add]').trigger('click');
  $('[data-show=x]').trigger('click');
  $('[data-x=false]').trigger('click');
  $('[data-animate=x]').attr('min', '-800').val('-415').trigger('change');
  $('[data-show=x]').trigger('click');

  $('[data-show=ease]').trigger('click');
  $('[data-ease=false]').trigger('click');
  $('[data-animate=ease]').val('none').trigger('change');
  $('[data-animate=easetype]').val('').trigger('change');
  $('[data-show=ease]').trigger('click');

  $('[data-show=duration]').trigger('click');
  $('[data-duration=false]').trigger('click');
  $('[data-animate=duration]').val('1.9').trigger('change');
  $('[data-show=duration]').trigger('click');

  $('[data-backto=library]').trigger('click');
  $('[data-select=none').trigger('click');
  $('[data-selectorlist] span').filter(function() {
    if (this.textContent === 'g > g:nth-child(2) > path:nth-child(2)') {
      $(this).parent().trigger('click');
    } else {
      return false;
    }
  });
  $('[data-open=animationtype]').trigger('click');

  $('[data-key=add]').trigger('click');
  $('[data-show=x]').trigger('click');
  $('[data-x=false]').trigger('click');
  $('[data-animate=x]').attr('min', '-1600').val('-894').trigger('change');
  $('[data-show=x]').trigger('click');

  $('[data-show=ease]').trigger('click');
  $('[data-ease=false]').trigger('click');
  $('[data-animate=ease]').val('none').trigger('change');
  $('[data-animate=easetype]').val('').trigger('change');
  $('[data-show=ease]').trigger('click');

  $('[data-show=duration]').trigger('click');
  $('[data-duration=false]').trigger('click');
  $('[data-animate=duration]').val('1.9').trigger('change');
  $('[data-show=duration]').trigger('click');
//  $('[data-close=keys]').trigger('click');
}
function editPathDemo() {
  $('[data-project=name]').val('svgMotion Demo').trigger('change');
  $('[data-project=size]').val('960x600').trigger('change');
  $('[data-open=library]').trigger('click');
  $('[data-selectorlist] span').filter(function() {
    if (this.textContent === 'g > g:nth-child(4) > g > path') {
      $(this).trigger('click');
    } else {
      return false;
    }
  });
  $('[data-open=animationtype]').trigger('click');
  $('[data-play=nextframe]').trigger('click');
  $('[data-key=add]').trigger('click');
  $('[data-open=editpath]').trigger('click');
}
initDemo();
//editPathDemo();