/*
  Version: 0.401
  svgMotion, copyright (c) by Michael Schwartz
  Distributed under an MIT license: https://github.com/michaelsboost/svgMotion/blob/gh-pages/LICENSE
  
  This is svgMotion (https://michaelsboost.github.io/svgMotion/), A vector animation tool
*/

// Settings Dialog
TweenMax.set("[data-projectSettings]", {xPercent:-50, left:"50%", yPercent:-50, top:"50%", position: "absolute"});
$("[data-toggle=projectSettings]").click(function() {
  $("[data-settings]").fadeToggle();
});

// toggle theme
$('[data-theme]').on('click', function() {
  if ($(this).find('i').hasClass('fa-moon')) {
    $(this).find('i').removeClass('fa-moon');
    $('link[href="css/dark-theme.css"]').attr('href', 'css/light-theme.css');
    $(this).find('i').addClass('fa-sun');
    $('[data-theme]').attr('data-theme', 'light');
    
    // update splitter theme
    $('#mainSplitter, #btmSplitter').jqxSplitter({
      theme: "metro"
    });
  } else {
    $(this).find('i').removeClass('fa-sun');
    $('link[href="css/light-theme.css"]').attr('href', 'css/dark-theme.css');
    $(this).find('i').addClass('fa-moon');
    $('[data-theme]').attr('data-theme', 'dark');
    
    // update splitter theme
    $('#mainSplitter, #btmSplitter').jqxSplitter({
      theme: "metrodark"
    });
  }
});

// initiate settings color picker
$('[data-selectioncolor]').minicolors({
  opacity: true,
  format: 'rgb',
  change: function(value) {
    $('#selectorstyle').html('\n  /* class for selected element */\n  [data-selected] {\n    outline: 4px dotted '+ value +';\n  }\n');
  }
});
$('.defaultswatch').minicolors({
  opacity: true,
  format: 'rgb',
  change: function() {
    $('[data-animate="fill"], [data-animate="stroke"]').minicolors('destroy');
    $('[data-animate="fill"], [data-animate="stroke"]').minicolors({
      opacity: true,
      format: 'rgb',
      swatches: [$('.defaultswatch')[0].value, $('.defaultswatch')[1].value, $('.defaultswatch')[2].value, $('.defaultswatch')[3].value, $('.defaultswatch')[4].value, $('.defaultswatch')[5].value, $('.defaultswatch')[6].value, $('.defaultswatch')[7].value, $('.defaultswatch')[8].value, $('.defaultswatch')[9].value, $('.defaultswatch')[10].value, $('.defaultswatch')[11].value, $('.defaultswatch')[12].value, $('.defaultswatch')[13].value]
    });
  }
});

// disable scroll with color picker
$('.defaultswatch, [data-selectioncolor]').on('focus', function() {
  $('.settings').css('overflow', 'hidden');
}).on('blur', function() {
  $('.settings').css('overflow', 'auto');
});