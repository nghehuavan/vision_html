/* Init */

var canvas = document.getElementById('canvas')
var newdrawCanvas = new drawCanvas(canvas)

/* Change Frame */
$('#frame-selection button').click(function (e) {
  let objectRender = newdrawCanvas.getObject()
  e.preventDefault();
  $('#frame-selection button.active').removeClass('active');
  let button = $(this)
  if (objectRender.frame != button.data('frame')) {
    newdrawCanvas.setFrame(button.data('frame'))
    newdrawCanvas.draw()
  }
  button.addClass('active')
});

/* Button confirm */

$('#btn-edit').click(function (e) {
  $('#frame-choice').addClass('d-none')
  $('#frame-step').addClass('d-none')
  $('#frame-edit').removeClass('d-none')
  $('#frame-edit-footer').removeClass('d-none')
})

function resetData() {
  $('#frame-choice').removeClass('d-none')
  $('#frame-step').removeClass('d-none')
  $('#frame-edit').addClass('d-none')
  $('#frame-edit-footer').addClass('d-none')
  $('#btn-check-move').removeClass('checked')
  $('#btn-check-rotate').removeClass('checked')
}

/* nav pill */
$('#nav-tabs li').click(function (e) {
  e.preventDefault();
  $('#nav-tabs li').removeClass('active');
  let button = $(this)
  button.addClass('active')
  $('#nav-content .nav-content-item').removeClass('active')
  $(`#nav-content #${button.data('edit')}`).addClass('active')
})

/* File handler */
$('#input-file').change(function () {
  var input = this;
  var url = $(this).val();
  var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
  let fileSize = input.files[0].size / (1024 * 1024)

  /* Check file legal */
  if (input.files && input.files[0] && (ext == "png" || ext == "jpeg" || ext == "jpg") && (fileSize < 5)) {
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = function (e) {
      let image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        if (image.width < 640 || image.height < 640) {
          input.value = ""
          window.location.href = './error.html'
        } else {
          newdrawCanvas.setFile(e.target.result)
          activeButton('#step2')
          newdrawCanvas.setStep(2)
          $('#btn-file').removeClass('btn-primary')
          $('#btn-file').addClass('btn-outline-primary')
          newdrawCanvas.draw()
          showFullOption()
        }
      };
    }
  } else {
    input.value = ""
    window.location.href = './error.html'
  }
});

/* Funtion */
function showFullOption() {
  let objectRender = newdrawCanvas.getObject()
  if (objectRender.step1 && objectRender.step2) {
    $('.wrapper-btn-file').addClass('active')
    $('#btn-edit').removeClass('d-none')
    $('#btn-file').html('変更')
    $('#btn-confirm').prop('disabled', !objectRender.step1)
  }
}

function openFile(e) {
  $('#input-file').trigger('click');
}

function activeButton(id) {
  let buttonActive = $(id)
  buttonActive.addClass('active')
  buttonActive.children('.btn').removeClass('btn-primary')
  buttonActive.children('.btn').addClass('btn-outline-primary')
  let label = $(id).children('.label')
  label.children('.icon-text').addClass('d-none')
  label.children('.icon-tick').addClass('d-flex')
  label.children('.icon-tick').removeClass('d-none')
}

function deActiveButton(id) {
  let buttonActive = $(id)
  buttonActive.removeClass('active')
  buttonActive.children('.btn').addClass('btn-primary')
  buttonActive.children('.btn').removeClass('btn-outline-primary')
  let label = $(id).children('.label')
  label.children('.icon-text').removeClass('d-none')
  label.children('.icon-tick').removeClass('d-flex')
  label.children('.icon-tick').addClass('d-none')
}

function getImage(id) {
  let objectRender = newdrawCanvas.getObject()
  newdrawCanvas.setManga(id)
  activeButton('#step1')
  newdrawCanvas.setStep(1)
  $('#btn-confirm').prop('disabled', !objectRender.step2)
  newdrawCanvas.clearCanvas()
  newdrawCanvas.draw()
  setTimeout(() => {
    closeModal('#modal-frame')
  }, 100);
  showFullOption()
}

function finalStep() {
  let imgFinal = canvas.toDataURL();
  window.localStorage.setItem( "frame-image-final", imgFinal);
  window.location.href = './design-frame-result.html'
}

function renderModal() {
  let html = ''
  dataSynchroFrame.categoryAndManga.forEach((element, index) => {
    html += `<p class="title m-0">${element.name}</p>`
    html += `<div class="list-frame justify-between d-flex flex-wrap">`
    element.mangas.forEach(ele => {
      html += `<div class="list-frame-item" onClick="getImage(${ele.id})">
                <img src="${ele.img}" alt=""/>
              </div>`
    })
    html += `</div>`
  });
  $('#content-frame').html(html)
}

function onLoadFrame() {
  renderModal()
  checkAge()
  newdrawCanvas.draw()
}

/* End Funtion */
