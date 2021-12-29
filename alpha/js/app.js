/*
  Version: 1.000-alpha
  svgMotion, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE
  
  This is svgMotion (https://michaelsboost.github.io/svgMotion/), A vector animation tool
*/

// variables
var version = '1.000',
    $str, cssStr, jsStr, storeAsset,
    loadedJSON = {}, projectJSON, thisTool;

// alertify log
$('[data-log]').on('click', function() {
  var val = $(this).attr('data-log');
  alertify.log(val);
});

// svgMotion info
$('[data-info]').click(function() {
//  alertify.log('<div style="font-size: 14px; text-align: center;"><img src="logo.svg" style="width: 50%;"><br><h1>svgMotion</h1><h5>Version 1.000-alpha</h5></div>');
  
  swal({
    html: '<img class="logo" src="logo.svg" style="width: 50%;"><br><h1>svgMotion</h1><h5>Version 1.000-alpha</h5><a href="https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE" target="_blank">Open Source License</a>'
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

// init new project
$('[data-confirm="newproject"]').click(function() {
  swal({
    title: 'Proceed with new project?',
    text: "Are you sure? All your data will be lost!",
    type: 'question',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      // initiate a new project
      // first clear the canvas
      $('[data-canvas]').empty();
      
      // reset project name
      $('[data-projectname]').text('My Project');
      
      // reset fps
      $('[data-fps]').val( $('[data-new=fps]').val() );
      
      // clear notepad
      $('[data-notepad]').val('');
      
      // clear keys
      $('[data-keys]').empty();
      
      // reset filters
      $('[data-blurfilter]').val(0);
      $('[data-huefilter]').val(0);
      $('[data-brightnessfilter]').val(1);
      $('[data-contrastfilter]').val(1);
      $('[data-saturatefilter]').val(1);
      $('[data-grayscalefilter]').val(0);
      $('[data-sepiafilter]').val(0);
      $('[data-invertfilter]').val(0).trigger('change');
  
      // close new icon
      $('[data-call=new].active').removeClass('active');
      $('[data-dialog=new]').hide();
      
      // init zoom tool by default
      $('[data-tools=zoom]').trigger('click');
    } else {
      return false;
    }
  })
});

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
//instance.pause();
//instance.resume();

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
$('[data-play]').on('click', function() {
  if ($(this).attr('data-play') === 'true') {
    $(this).attr('data-play', false)
           .find('img')
           .attr('src', 'svgs/play.svg');
    $('[data-render]').hide();
    stopAnim();
  } else {
    $(this).attr('data-play', true)
           .find('img')
           .attr('src', 'svgs/stop.svg');
    $('[data-render]').show();
    runAnim();
  }
});
$('[data-zoom]').on('click', function() {
  if ($(this).attr('data-zoom') === 'true') {
    $(this).attr('data-zoom', false)
           .find('img')
           .attr('src', 'svgs/zoom-no.svg');
    $('[data-resetzoompos]').hide();
    instance.pause();
  } else {
    $(this).attr('data-zoom', true)
           .find('img')
           .attr('src', 'svgs/zoom.svg');
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

// set animation class name
$('[data-change=name]').on('click', function() {
  swal({
    title: 'Project name!',
    input: 'text',
    inputValue: $(this).text(),
    inputPlaceholder: "Project name!",
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    showLoaderOnConfirm: true
  }).then((result) => {
    if (result.value) {
      $(this).text(result.value.replace(/[^\w\s]/gi, '').split(' ').join(''));
    } else {
      swal(
        'Oops!',
        console.error().toString(),
        'error'
      );
    }
  });
});

// move asset forward and/or backward
$('[data-sendbackward]').on('click', function() {
  if ($(this).parent().is(':first-child')) {
    alertify.error('Error: Asset is already first!');
  } else {
    storeAsset = $(this).parent().html();
    $(this).parent().prev().parent().prepend('<div class="asset ib">'+ storeAsset +'</div>');
    $(this).parent().remove();
    stopAnim();
  }
});
$('[data-sendforward]').on('click', function() {
  if ($(this).parent().is(':last-child')) {
    alertify.error('Error: Asset is already last!');
  } else {
    storeAsset = $(this).parent().html();
    $(this).parent().next().parent().append('<div class="asset ib">'+ storeAsset +'</div>');
    $(this).parent().remove();
    stopAnim();
  }
});

// call asset as a frame by frame animation or a tween animation
$('[data-callAnim=framebyframe]').on('click', function() {
  swal({
    title: 'Proceed with frame by frame?',
    text: "Are you sure? This current vector's animation data will be lost!",
    type: 'question',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      $(this).parent().find('textarea.css').val('.svgmotion svg.'+ $(this).parent().find('h1').text() +' > g > g:not(:first-of-type) {\n  display: none;\n}');
      $(this).parent().find('textarea.js').val('let groups = gsap.utils.toArray(".svgmotion svg.'+ $(this).parent().find('h1').text() +' > g > g");\nlet wrap = gsap.utils.wrap(0, groups.length - 1);\nlet frame = 0;\n\ngsap.to({}, {\n  duration: 0.1,\n  repeat: -1,\n  onRepeat() {\n    let last = groups[wrap(frame)];\n    let next = groups[wrap(++frame)];\n    \n    last.style.display = "none";\n    next.style.display = "block";\n  }\n})');
    } else {
      return false;
    }
  })
});
$('[data-callAnim=tween]').on('click', function() {
  swal({
    title: 'Proceed with tween?',
    text: "Are you sure? This current vector's animation data will be lost!",
    type: 'question',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      alertify.log('coming soon..');
    } else {
      return false;
    }
  })
});

// init animations
function runAnim() {
  // set the canvas size
  $('[data-canvas]').css('width', $('[data-project=width]').val() + 'px');
  $('[data-canvas]').css('height', $('[data-project=height]').val() + 'px');
  
  // clear the canvas
  $('[data-canvas]').empty();
  
  // now apply the vector assets to the canvas
  $('[data-dialog=assets] [data-asset]').each(function() {
    assetStr = $(this).html();

    $('[data-canvas]').append(assetStr);
  });
  
  // apply the css (if any)
  $('textarea.css').each(function() {
    cssStr = $(this).val();

    $('[data-canvas]').append('<'+'st'+'yle'+'>'+ cssStr +'<'+'/'+'st'+'yle'+'>');
  });
  
  // apply the javascript
  $('textarea.js').each(function() {
    jsStr = $(this).val() + '\n';

    $('[data-canvas]').append('<'+'scr'+'ipt'+'>'+ jsStr +'<'+'/'+'scr'+'ipt'+'>');
  });
  
  // hide settings
  $('[data-call=settings] img').css({
    width: 0,
    padding: 0,
    overflow: 'hidden'
  });
}
function stopAnim() {
  // clear the canvas
  $('[data-canvas]').empty();
  
  // now apply the vector assets to the canvas
  $('[data-dialog=assets] [data-asset]').each(function() {
    assetStr = $(this).html();

    $('[data-canvas]').append(assetStr);
  });
  
  // reset the css
  $('#stylesheet').empty();
  
  // show settings
  $('[data-call=settings] img').removeAttr('style');
}
$('[data-play]').trigger('click');

// export files
function getProjectJSON() {
  projectJSON = {
    "version": version,
    "settings": [{
      "name": $('[data-projectname]')[0].textContent,
      "width": $('[data-new=width]').val(),
      "height": $('[data-new=height]').val(),
      "framerate": $('[data-framerate]').val(),
      "notepad": $('[data-notepad]').val()
    }],
    swatches,
    "filters": [{
      "blurfilter": blurfilter.value,
      "huefilter": huefilter.value,
      "brightnessfilter": brightnessfilter.value,
      "contrastfilter": contrastfilter.value,
      "saturatefilter": saturatefilter.value,
      "grayscalefilter": grayscalefilter.value,
      "sepiafilter": sepiafilter.value,
      "invertfilter": invertfilter.value
    }],
    "svg": canvas.toSVG().replace(/Created with Fabric.js 4.6.0/g, "Created with svgMotion - https://michaelsboost.github.io/svgMotion/"),
    "frames": $("[data-frames]").html()
  };
};
function exportJSON() {
  getProjectJSON();
  var projectname = $('[data-projectname]')[0].textContent.toLowerCase().replace(/ /g, "-")
  if (!$('[data-projectname]')[0].textContent.toLowerCase().replace(/ /g, "-")) {
    projectname = $('[data-projectname]')[0].textContent = "_svgMotion";
  }
  var blob = new Blob([JSON.stringify(projectJSON)], {type: "application/json;charset=utf-8"});
  saveAs(blob, projectname + ".json");
}
function exportZIP() {
  if (!$('[data-frames] svg')) {
    alertify.error('Error: No frames detected thus no .gif to export!');
    return false;
  }
   else if ($('[data-frames] svg').length === 1) {
    alertify.error('Error: Only 1 frame detected thus no .gif to export!');
    return false;
  } else {
    imagesPNG = [];
    imagesSVG = [];
    $('[data-frames] svg').each(function(i) {
      // first begin with the array for the svg files
      
      // 2. Serialize element into plain SVG
      var serializedSVG = new XMLSerializer().serializeToString($('[data-frames] svg')[i]);

      var base64Data = window.btoa(serializedSVG);
      // The generated string will be something like: 
      // PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdm.........

      var imgSVGSrc = "data:image/svg+xml;base64," + base64Data;
      
      // first push the svg to the svg images array
      imagesSVG.push(imgSVGSrc);
      
      // create dummy canvas element to convert our svg to a png
      var c = document.createElement('canvas');
      var ctx = c.getContext("2d");
      c.width  = $('[data-new=width]').val()
      c.height = $('[data-new=height]').val()

      var img = new Image();
      img.src = imgSVGSrc;
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        
        // next push the png to the png images array
        imagesPNG.push(c.toDataURL('image/png'));
      }
      c.remove();
    });
    
    setTimeout(function() {
      var zip = new JSZip();

      // png images
      for (var i = 0; i < imagesPNG.length; i++) {
        zip.folder('pngs').file("frame-"+[i]+".png", imagesPNG[i].split('base64,')[1],{base64: true});
      }
      // svg images
      for (var i = 0; i < imagesSVG.length; i++) {
        zip.folder('svgs').file("frame-"+[i]+".svg", imagesSVG[i].split('base64,')[1],{base64: true});
      }

      var content = zip.generate({type:"blob"});
      var projectname = $("[data-projectname]")[0].textContent.toLowerCase().replace(/ /g, "-")
      if (!$("[data-projectname]")[0].textContent.toLowerCase().replace(/ /g, "-")) {
        projectname = $("[data-projectname]")[0].textContent = "my-awesome-animation";
      }
      saveAs(content, projectname + "_svgMotion.zip");
    }, 300);
  }
}
function exportGIF() {
  if (!$('[data-frames] svg')) {
    alertify.error('Error: No frames detected thus no .gif to export!');
    return false;
  }
   else if ($('[data-frames] svg').length === 1) {
    alertify.error('Error: Only 1 frame detected thus no .gif to export!');
    return false;
  } else {
    var images = [];
    $('[data-frames] svg').each(function(i) {
      // 2. Serialize element into plain SVG
      var serializedSVG = new XMLSerializer().serializeToString($('[data-frames] svg')[i]);

      var base64Data = window.btoa(serializedSVG);
      // The generated string will be something like: 
      // PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdm.........

      var imgSVGSrc = "data:image/svg+xml;base64," + base64Data;
      images.push(imgSVGSrc);
    });

    gifshot.createGIF({
      images: images,
      gifWidth: canvas.width,
      gifHeight: canvas.height,
      interval: $('[data-framerate]').val() / 1000, // seconds
      progressCallback: function(captureProgress) { console.log('progress: ', captureProgress); },
      completeCallback: function() { console.log('completed!!!'); },
      numWorkers: 2,
    },function(obj) {
      if(!obj.error) {
        var image = obj.image;
        var link = document.createElement("a");
        link.href = image;
        projectname = $("[data-projectname]")[0].textContent.toLowerCase().replace(/ /g, "-");
        link.download = projectname + '.gif';
        link.click();
      }
    });
  }
}

// hide tools options onload
$('[data-toolsmenu]').hide();
$('[data-toolsmenu] [data-toolsoption]').hide();

// hide dialogs onload
$('[data-dialogs] [data-dialog]').hide();
$('[data-tools=zoom]').trigger('click');