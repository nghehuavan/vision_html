var limitAge = 13;
var keyAge = 'gr_age_checked';
var ageSelected = '';
$(document).ready(function() {
  if ($('#slider-toppage').length) {
    $("#slider-toppage").owlCarousel({
      center: true,
      nav : false,
      loop: true,
      margin: 30,
      dots: true,
      items: 1.4,
      autoplay: true,
      slideSpeed : 300,
      paginationSpeed : 400,
      autoplayTimeout: 2000,
      autoplayHoverPause: true,
    });
  }

  if ($('#slider-common').length) {
    $("#slider-common .owl-carousel").owlCarousel({
      center: true,
      nav : false,
      loop: true,
      margin: 30,
      dots: false,
      items: 1.5,
      autoplay: true,
      slideSpeed : 500,
      paginationSpeed : 500,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
    });
  }

  if ($('#barcode').length) {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#barcode'),
        constraints: {
          width: 375,
          height: 400,
          facingMode: "environment"
        },
      },
      decoder : {
        readers : [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
          "i2of5_reader"
        ],
        debug: {
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingPatchLabels: true,
          boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true
          }
        }
      }
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
        Quagga.onDetected(function (result) {
          $('#barcode-result').text(result.codeResult.code);
          console.log("Barcode detected and processed : [" + result.codeResult.code + "]");
        });
    });
  }
  if($('#selected-age').length) {
    for (var i = 1; i <= 119; i++) {
      $('#selected-age').append("<option value="+ i +">"+ i + "歳" +"</option>");
    }
  }
  let btnOpenMenu = $('#btn-open-menu');
  let btnCloseMenu = $('#btn-close-menu');
  let menuCollapse = $('.menu-collapse');
  let maskCollapse = $('.mask-collapse');
  $(btnOpenMenu).click(function() {
    $(menuCollapse).addClass('active-menu')
    $(maskCollapse).removeClass('d-none')
  });
  $(btnCloseMenu).click(function() {
    $(menuCollapse).removeClass('active-menu')
    $(maskCollapse).addClass('d-none')
  });
});

$(function() {
  $('#selected-age').change(function() {
    if($(this).val() == 0) {
      $('.btn-confirm-age').removeClass('active-btn');
    } else {
      $('.btn-confirm-age').addClass('active-btn');
      ageSelected = $(this).val();
    }
  });
});

function handleConfirmAge() {
  if(ageSelected != '' ) {
    if(parseInt(ageSelected) >= limitAge) {
      localStorage.setItem(keyAge, '1');
      closeModal('#modal-age');
    } else {
      localStorage.setItem(keyAge, '0');
      $('.body-age-select').addClass('hide-body-age');
      $('.btn-confirm-age').css('display', 'none');
      $('.body-age-warning').css('display', 'flex');
    }
  }
}

function openMenu() {
  $(".menu-collapse").fadeIn();
  $(".mask-collapse").fadeIn();
}

function closeMenu() {
  $(".menu-collapse").fadeOut();
  $(".mask-collapse").fadeOut();
}

function loadToppage() {
  checkAge();
  let animateMSG1 = $('.animation-msg1');
  let animateMSG2 = $('.animation-msg2');
  if (window.matchMedia("(max-width: 767px)").matches) {
    $(window).scroll(function (event) {
      if (animateMSG1.length) {
        scrollAnimate(animateMSG1);
      }
      if (animateMSG2.length) {
        scrollAnimate(animateMSG2);
      }
    });
  } else {
    if($('.container-app').length) {
      $('.container-app').scroll(function (event) {
        if (animateMSG1.length) {
          scrollAnimate(animateMSG1);
        }
        if (animateMSG2.length) {
          scrollAnimate(animateMSG2);
        }
      });
    }
  }
}

function checkAge() {
  var checkAge = localStorage.getItem(keyAge);
  if(checkAge == null || checkAge == '0') {
    let modal = $('#modal-age');
    if(modal) {
      modal.addClass('animate-in');
      modal.removeClass('hide');
      modal.addClass('show');
      setTimeout( () => {
        modal.removeClass('animate-in');
      }, 600 );
      $('body').append("<div id='modal-backdrop' class='modal-backdrop'></div>");
      $('body').addClass("modal-open");
    }
  }
}

function handleCheck(checkedClass, callback) {
  let isChecked = $(checkedClass).hasClass('checked');
  if(isChecked) {
    $(checkedClass).removeClass('checked');
  } else {
    $(checkedClass).addClass('checked');
  }
  if(callback) {
    callback(!isChecked);
  }
}

function activeBtnPlay(bool) {
  if(bool) {
    $('.btn-try-play').removeClass('disabled');
  } else {
    $('.btn-try-play').addClass('disabled');
  }
}

function scrollAnimate(e) {
  let currentScrollTop = $(window).scrollTop();
  $(e).each(function(index, el) {
    let elementOffset = $(this).offset();
    let positionDelay = Math.min( $(this).height() / 3, $(window).height() / 2 );
    if((currentScrollTop + $(window).height() - positionDelay ) > elementOffset.top) {
      $(this).addClass('animated');
    } else {
      $(this).removeClass('animated');
    }
  });
}
