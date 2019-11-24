// variables
var projectName = $("[data-project=name]")[0];
var projectSize = $("[data-project=size]");
var projectFPS = $("[data-project=fps]").val();
var w, h, htmlCode = "", jsCode = "";

var loadHubs = { 
  "svg": '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 1080 1080" width="1080pt" height="1080pt"> <defs> <clipPath id="_clipPath_MxF8Dkiwk1DE61ESpuAKmuW45DuiKU6M"> <rect width="1080" height="1080" /> </clipPath> </defs> <g clip-path="url(#_clipPath_MxF8Dkiwk1DE61ESpuAKmuW45DuiKU6M)"> <rect x="0" y="0" width="1080" height="1080" transform="matrix(1,0,0,1,0,0)" fill="rgb(255,233,75)" /> <g> <ellipse cx="-230.50000000000034" cy="759.5" rx="340.49999999999966" ry="79.50000000000011" fill="rgb(251,201,57)" /> <g> <circle cx="-230.5000000000004" cy="772.0000000000001" r="257.99999999999994" fill="rgb(51,48,94)" /> <path d="M -361.2 470.15 L -101.8 470.15 C -91.424 470.15 -83 478.574 -83 488.95 L -83 488.95 C -83 499.326 -91.424 507.75 -101.8 507.75 L -361.2 507.75 C -371.576 507.75 -380 499.326 -380 488.95 L -380 488.95 C -380 478.574 -371.576 470.15 -361.2 470.15 Z" style="stroke:none;fill:#F38D63;stroke-miterlimit:10;" /> <path d="M -231.5 312 L -231.5 312 C -162.787 312 -107 367.787 -107 436.5 L -107 570.5 C -107 639.213 -162.787 695 -231.5 695 L -231.5 695 C -300.213 695 -356 639.213 -356 570.5 L -356 436.5 C -356 367.787 -300.213 312 -231.5 312 Z" style="stroke:none;fill:#5E433C;stroke-miterlimit:10;" /> <path d=" M -233.068 335 L -229.932 335 C -170.049 335 -121.432 383.617 -121.432 443.5 L -121.432 522 C -192.811 575.333 -266.179 575.343 -341.568 522 L -341.568 443.5 C -341.568 383.617 -292.951 335 -233.068 335 Z " fill="rgb(246,168,117)" /> <ellipse cx="-229.49999999999994" cy="556.9999999999999" rx="55.50000000000006" ry="33" fill="rgb(94,67,60)" /> <circle cx="-270" cy="494.00000000000006" r="15" fill="rgb(47,52,59)" /> <circle cx="-189" cy="494.00000000000006" r="15" fill="rgb(47,52,59)" /> <path d="M -229 475 L -229 475 C -218.514 475 -210 483.514 -210 494 L -210 521.5 C -210 531.986 -218.514 540.5 -229 540.5 L -229 540.5 C -239.486 540.5 -248 531.986 -248 521.5 L -248 494 C -248 483.514 -239.486 475 -229 475 Z" style="stroke:none;fill:#F38E65;stroke-miterlimit:10;" /> <path d=" M -108.403 417.94 C -117.354 358.012 -169.096 312 -231.5 312 L -231.5 312 C -293.904 312 -345.646 358.012 -354.597 417.94 C -318.826 429.713 -276.644 436.5 -231.5 436.5 C -186.356 436.5 -144.174 429.713 -108.403 417.94 Z " fill="rgb(94,67,60)" /> <path d=" M -258 557 L -201 557 L -201 568.5 C -201 580.366 -210.634 590 -222.5 590 L -236.5 590 C -248.366 590 -258 580.366 -258 568.5 L -258 557 Z " fill="rgb(255,254,255)" /> </g> <path d=" M -571 759.5 L -571 1080 L 110 1080 L 110 759.5 L 110 759.5 C 110 803.377 -42.573 839 -230.5 839 C -418.427 839 -571 803.377 -571 759.5 L -571 759.5 Z " fill="rgb(255,233,75)" /> </g> <g> <ellipse cx="539.9999999999998" cy="759.5" rx="340.4999999999998" ry="79.50000000000011" fill="rgb(251,201,57)" /> <g> <circle cx="539.9999999999998" cy="772" r="258" fill="rgb(51,48,94)" /> <path d="M 409.3 470.15 L 668.7 470.15 C 679.076 470.15 687.5 478.574 687.5 488.95 L 687.5 488.95 C 687.5 499.326 679.076 507.75 668.7 507.75 L 409.3 507.75 C 398.924 507.75 390.5 499.326 390.5 488.95 L 390.5 488.95 C 390.5 478.574 398.924 470.15 409.3 470.15 Z" style="stroke:none;fill:#F38D63;stroke-miterlimit:10;" /> <path d="M 539 312 L 539 312 C 607.713 312 663.5 367.787 663.5 436.5 L 663.5 570.5 C 663.5 639.213 607.713 695 539 695 L 539 695 C 470.287 695 414.5 639.213 414.5 570.5 L 414.5 436.5 C 414.5 367.787 470.287 312 539 312 Z" style="stroke:none;fill:#5E433C;stroke-miterlimit:10;" /> <path d=" M 537.432 335 L 540.568 335 C 600.451 335 649.068 383.617 649.068 443.5 L 649.068 522 C 577.689 575.333 504.321 575.343 428.932 522 L 428.932 443.5 C 428.932 383.617 477.549 335 537.432 335 Z " fill="rgb(246,168,117)" /> <ellipse cx="541.0000000000002" cy="557" rx="55.50000000000003" ry="33" fill="rgb(94,67,60)" /> <circle cx="500.5" cy="494.00000000000006" r="15" fill="rgb(47,52,59)" /> <circle cx="581.5" cy="494.00000000000006" r="15" fill="rgb(47,52,59)" /> <path d="M 541.5 475 L 541.5 475 C 551.986 475 560.5 483.514 560.5 494 L 560.5 521.5 C 560.5 531.986 551.986 540.5 541.5 540.5 L 541.5 540.5 C 531.014 540.5 522.5 531.986 522.5 521.5 L 522.5 494 C 522.5 483.514 531.014 475 541.5 475 Z" style="stroke:none;fill:#F38E65;stroke-miterlimit:10;" /> <path d=" M 662.097 417.94 C 653.146 358.012 601.404 312 539 312 L 539 312 C 476.596 312 424.854 358.012 415.903 417.94 C 451.674 429.713 493.856 436.5 539 436.5 C 584.144 436.5 626.326 429.713 662.097 417.94 Z " fill="rgb(94,67,60)" /> <path d=" M 512.5 557 L 569.5 557 L 569.5 568.5 C 569.5 580.366 559.866 590 548 590 L 534 590 C 522.134 590 512.5 580.366 512.5 568.5 L 512.5 557 Z " fill="rgb(255,254,255)" /> </g> <path d=" M 199.5 759.5 L 199.5 1080 L 880.5 1080 L 880.5 759.5 L 880.5 759.5 C 880.5 803.377 727.927 839 540 839 C 352.073 839 199.5 803.377 199.5 759.5 L 199.5 759.5 Z " fill="rgb(255,233,75)" /> </g> <g> <ellipse cx="1310.4999999999993" cy="759.5" rx="340.4999999999998" ry="79.50000000000011" fill="rgb(251,201,57)" /> <g> <circle cx="1310.4999999999995" cy="1299" r="258" fill="rgb(51,48,94)" /> <path d="M 1179.8 997.15 L 1439.2 997.15 C 1449.576 997.15 1458 1005.574 1458 1015.95 L 1458 1015.95 C 1458 1026.326 1449.576 1034.75 1439.2 1034.75 L 1179.8 1034.75 C 1169.424 1034.75 1161 1026.326 1161 1015.95 L 1161 1015.95 C 1161 1005.574 1169.424 997.15 1179.8 997.15 Z" style="stroke:none;fill:#F38D63;stroke-miterlimit:10;" /> <path d="M 1309.5 839 L 1309.5 839 C 1378.213 839 1434 894.787 1434 963.5 L 1434 1097.5 C 1434 1166.213 1378.213 1222 1309.5 1222 L 1309.5 1222 C 1240.787 1222 1185 1166.213 1185 1097.5 L 1185 963.5 C 1185 894.787 1240.787 839 1309.5 839 Z" style="stroke:none;fill:#5E433C;stroke-miterlimit:10;" /> <path d=" M 1307.932 862 L 1311.068 862 C 1370.951 862 1419.568 910.617 1419.568 970.5 L 1419.568 1049 C 1348.189 1102.333 1274.821 1102.343 1199.432 1049 L 1199.432 970.5 C 1199.432 910.617 1248.049 862 1307.932 862 Z " fill="rgb(246,168,117)" /> <ellipse cx="1311.5" cy="1084" rx="55.5" ry="33" fill="rgb(94,67,60)" /> <circle cx="1271" cy="1021" r="15" fill="rgb(47,52,59)" /> <circle cx="1352.0000000000005" cy="1021" r="15" fill="rgb(47,52,59)" /> <path d="M 1312 1002 L 1312 1002 C 1322.486 1002 1331 1010.514 1331 1021 L 1331 1048.5 C 1331 1058.986 1322.486 1067.5 1312 1067.5 L 1312 1067.5 C 1301.514 1067.5 1293 1058.986 1293 1048.5 L 1293 1021 C 1293 1010.514 1301.514 1002 1312 1002 Z" style="stroke:none;fill:#F38E65;stroke-miterlimit:10;" /> <path d=" M 1432.597 944.94 C 1423.646 885.012 1371.904 839 1309.5 839 L 1309.5 839 C 1247.096 839 1195.354 885.012 1186.403 944.94 C 1222.174 956.713 1264.356 963.5 1309.5 963.5 C 1354.644 963.5 1396.826 956.713 1432.597 944.94 Z " fill="rgb(94,67,60)" /> <path d=" M 1283 1084 L 1340 1084 L 1340 1095.5 C 1340 1107.366 1330.366 1117 1318.5 1117 L 1304.5 1117 C 1292.634 1117 1283 1107.366 1283 1095.5 L 1283 1084 Z " fill="rgb(255,254,255)" /> </g> <path d=" M 970 759.5 L 970 1080 L 1651 1080 L 1651 759.5 L 1651 759.5 C 1651 803.377 1498.427 839 1310.5 839 C 1122.573 839 970 803.377 970 759.5 L 970 759.5 Z " fill="rgb(255,233,75)" /> </g> <g> <ellipse cx="2080.999999999999" cy="759.5" rx="340.49999999999966" ry="79.50000000000011" fill="rgb(251,201,57)" /> <g> <circle cx="2080.999999999999" cy="1299" r="258" fill="rgb(51,48,94)" /> <path d="M 1950.3 997.15 L 2209.7 997.15 C 2220.076 997.15 2228.5 1005.574 2228.5 1015.95 L 2228.5 1015.95 C 2228.5 1026.326 2220.076 1034.75 2209.7 1034.75 L 1950.3 1034.75 C 1939.924 1034.75 1931.5 1026.326 1931.5 1015.95 L 1931.5 1015.95 C 1931.5 1005.574 1939.924 997.15 1950.3 997.15 Z" style="stroke:none;fill:#F38D63;stroke-miterlimit:10;" /> <path d="M 2080 839 L 2080 839 C 2148.713 839 2204.5 894.787 2204.5 963.5 L 2204.5 1097.5 C 2204.5 1166.213 2148.713 1222 2080 1222 L 2080 1222 C 2011.287 1222 1955.5 1166.213 1955.5 1097.5 L 1955.5 963.5 C 1955.5 894.787 2011.287 839 2080 839 Z" style="stroke:none;fill:#5E433C;stroke-miterlimit:10;" /> <path d=" M 2078.432 862 L 2081.568 862 C 2141.451 862 2190.068 910.617 2190.068 970.5 L 2190.068 1049 C 2118.689 1102.333 2045.321 1102.343 1969.932 1049 L 1969.932 970.5 C 1969.932 910.617 2018.549 862 2078.432 862 Z " fill="rgb(246,168,117)" /> <ellipse cx="2082" cy="1084" rx="55.5" ry="33" fill="rgb(94,67,60)" /> <circle cx="2041.5" cy="1021" r="15.000000000000114" fill="rgb(47,52,59)" /> <circle cx="2122.5" cy="1021" r="15" fill="rgb(47,52,59)" /> <path d="M 2082.5 1002 L 2082.5 1002 C 2092.986 1002 2101.5 1010.514 2101.5 1021 L 2101.5 1048.5 C 2101.5 1058.986 2092.986 1067.5 2082.5 1067.5 L 2082.5 1067.5 C 2072.014 1067.5 2063.5 1058.986 2063.5 1048.5 L 2063.5 1021 C 2063.5 1010.514 2072.014 1002 2082.5 1002 Z" style="stroke:none;fill:#F38E65;stroke-miterlimit:10;" /> <path d=" M 2203.097 944.94 C 2194.146 885.012 2142.404 839 2080 839 L 2080 839 C 2017.596 839 1965.854 885.012 1956.903 944.94 C 1992.674 956.713 2034.856 963.5 2080 963.5 C 2125.144 963.5 2167.326 956.713 2203.097 944.94 Z " fill="rgb(94,67,60)" /> <path d=" M 2053.5 1084 L 2110.5 1084 L 2110.5 1095.5 C 2110.5 1107.366 2100.866 1117 2089 1117 L 2075 1117 C 2063.134 1117 2053.5 1107.366 2053.5 1095.5 L 2053.5 1084 Z " fill="rgb(255,254,255)" /> </g> <path d=" M 1740.5 759.5 L 1740.5 1080 L 2421.5 1080 L 2421.5 759.5 L 2421.5 759.5 C 2421.5 803.377 2268.927 839 2081 839 C 1893.073 839 1740.5 803.377 1740.5 759.5 L 1740.5 759.5 Z " fill="rgb(255,233,75)" /> </g> </g> </svg>',
  "settings": [{
  	"name": "hello world",
  	"size": "100x100",
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
function loadHubsTest() {
  $("[data-grab=hubs]").empty();
  
  for (var i = 0; i < loadHubs.hubs.length; i++) {
    if (loadHubs.hubs[i].title === "TimelineMax") {
      var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ loadHubs.hubs[i].title +'</h2>&nbsp;<a href="'+ loadHubs.hubs[i].link +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ loadHubs.hubs[i].description +'</div><div class="keyplace" data-place="key">'+ loadHubs.hubs[i].keys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div></div>';
    } else {
      var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">'+ loadHubs.hubs[i].title +'</h2>&nbsp;<a href="'+ loadHubs.hubs[i].link +'" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">'+ loadHubs.hubs[i].description +'</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="'+ loadHubs.hubs[i].selector +'" data-get="selector"></div></div></div><div class="mdl-cell mdl-cell--2-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="number" class="mdl-textfield__input number" placeholder="speed" min="0" value="'+ loadHubs.hubs[i].speed +'" data-get="speed"></div></div></div><hr></div><div class="keyplace" data-place="key">'+ loadHubs.hubs[i].keys +'</div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." onKeyDown="enterKey(event)"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';
    }

    // append hub
    $("[data-grab=hubs]").append(hubStr);
    $(".vector").html(loadHubs.svg);
    projectName.value = loadHubs.settings[0].name;
    projectSize[0].value = loadHubs.settings[0].size;
    $("[data-project=fps]")[0].value = loadHubs.settings[0].fps;
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
      w = document.querySelector("[data-output=svg] > svg").getAttribute("width");
      w = parseFloat(w, 10);
      h = document.querySelector("[data-output=svg] > svg").getAttribute("height");
      h = parseFloat(h, 10);
      projectSize.val(w + "x" + h).trigger('change');
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

// project name show in document title
projectName.onclick = function() {
  document.title = "svgMotion: " + this.value;
};

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
                var a = document.createElement("a");
                a.href = obj.image;
                var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
                if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
                  projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
                }
                a.download = projectname;
                a.target = "_blank";
                a.click();
                
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

            var content = zip.generate({type:"blob"});
            var projectname = $("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")
            if (!$("[data-project=name]")[0].value.toLowerCase().replace(/ /g, "-")) {
              projectname = $("[data-project=name]")[0].value = "my-awesome-animation";
            }
            saveAs(content, projectname + ".zip");
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
$("[data-grab=hubs] div").on("mousedown", function() {
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

// open/close project settings
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

    var endCodeStr = 'var fps = '+ projectFPS +';\nvar duration = tl.duration();\nvar frames   = Math.ceil(duration / 1 * fps)\ntl.play(0).timeScale(1);'
    jsCode += endCodeStr;

    zip.file("js/animation.js", jsCode);
    var content = zip.generate({type:"blob"});
    saveAs(content, filename + ".zip");
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

// alert the user feature is coming soon
$("[data-action=comingsoon]").click(function() {
  alertify.log("coming soon...");
  return false;
});