$(document).ready(function () {
  $("a#aSubscribe").click(function () {
    if ($("a#aSubscribe").text() == "Подписаться") {
      $.ajax(
        {
          url: "",
          data: "ajaxCommand=AddNewSubscribeUser",
          cache: false,
          success: function (data) {
            if (data != null && data.ErrorMsg == null) {
              $("a#aSubscribe").text("Отписаться");
            }
          },
          error: function () {
            ShowMsg(arguments[2]);
          }
        }
      );
    }
    else {
      $.ajax(
        {
          url: "",
          data: "ajaxCommand=DeleteSubscribeUser",
          cache: false,
          success: function (data) {
            if (data != null && data.ErrorMsg == null) {
              $("a#aSubscribe").text("Подписаться");
            }
          },
          error: function () {
            ShowMsg(arguments[2]);
          }
        }
      );
    }

    return false;
  });
 
  var mi = $('#miHome');
  if (document.URL.toLowerCase().indexOf('admin.aspx') > -1) {
    mi = $('#miAdmin');
  }
  else if (document.URL.toLowerCase().indexOf('about.aspx') > -1) {
    mi = $('#miAbout');
  }

  ResetMenuClasses();
  mi.attr('class', 'active');
});

function ResetMenuClasses() {
  $('#miHome').attr('class', '');
  $('#miAdmin').attr('class', '');
  $('#miAbout').attr('class', 'last');
}