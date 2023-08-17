function openModal(e) {
  let modal = $(e)
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
  if (!modal.data("backdrop")) {
    $(document).mouseup(function(e) {
      var dialog = $(".modal-dialog");
      if (!dialog.is(e.target) && dialog.has(e.target).length === 0) {
        let backdrop = $('#modal-backdrop');
        if(backdrop) {
          backdrop.remove();
          $('.modal').addClass('hide');
          $('body').removeClass("modal-open");
        }
      }
    });
  }
}

function closeModal(e) {
  let modal = $(e);
  if(modal) {
    modal.removeClass('show');
    $('body').removeClass("modal-open");
    modal.addClass('hide');
    let backdrop = $('#modal-backdrop')
    if(backdrop) {
      backdrop.remove();
    }
  }
}
