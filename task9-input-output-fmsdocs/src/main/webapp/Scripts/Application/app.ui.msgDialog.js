$(document).ready(function () {
  var dialog = $("#msgDialog").dialog({
    dialogClass: "no-close",
    autoOpen: false,
    modal: true,
    open: function(event, ui) {
      //$(".ui-dialog-titlebar-close").hide();
      dialog.overlay.addClass("ui-widget-overlay-fade");
      $("#msgDialogText").width($('#msgDialog').width() - $('#imgDialogIcon').parent().outerWidth(true));
    },
    maxHeight: $("#MainForm").height(),
    position: { my: "center", at: "center", of: $("#MainForm") },
    show: "fade",
    hide: "fade"
  }).data("ui-dialog");
});

function ShowMsg(msgText, closeHandler) {
  $("#msgDialog").off("dialogclose");
  $("#msgDialog").dialog("option", "title", "Информация");
  $("#imgDialogIcon").get(0).src = "Images/Information.png";
  $("#msgDialogText").css("height", "auto");  
  $("#msgDialogText").text(msgText);
  $("#msgDialog").dialog("option", "resizable", false );
  $("#msgDialog").dialog("option", "buttons", [
    {
      text: "Закрыть",
      click: function() {
        $(this).dialog("close");
      }
    }
  ]);
  $("#msgDialog").on("dialogclose", closeHandler);
  $("#msgDialog").dialog("open");  
}

function ShowErrMsg(msgText) {
  $("#msgDialog").off("dialogclose");
  $("#msgDialog").dialog("option", "title", "Ошибка");
  $("#msgDialog").dialog("option", "maxHeight", $("#MainForm").height());
  $("#imgDialogIcon").get(0).src = "Images/Error.png";
  $("#msgDialogText").css("height", "auto");
  $("#msgDialogText").text(msgText);
  $("#msgDialog").dialog("option", "resizable", false);
  $("#msgDialog").dialog("option", "buttons", [
    {
      text: "Закрыть",
      click: function () {
        $(this).dialog("close");
      }
    }
  ]);
  $("#msgDialog").off("dialogclose");
  $("#msgDialog").dialog("open");
}

function ShowDlg(msgText, yesHandler) {
  $("#msgDialog").off("dialogclose");
  $("#msgDialog").dialog("option", "title", "Вопрос");
  $("#msgDialog").dialog("option", "maxHeight", $("#MainForm").height());
  $("#imgDialogIcon").get(0).src = "Images/Question.png";
  $("#msgDialogText").css("height", "auto");
  $("#msgDialogText").text(msgText);
  $("#msgDialog").dialog("option", "resizable", false);  

  var yesCliked = false;
  $("#msgDialog").dialog("option", "buttons", [
    {
      text: "Да",
      click: function () {
        $(this).dialog("close");
        yesCliked = true;
      }
    },
    {
      text: "Нет",
      click: function () {
        $(this).dialog("close");
      }
    }
  ]);
  
  $("#msgDialog").on("dialogclose", function () {
    if (yesCliked) {
      yesHandler();
    }
    yesCliked = false;
  });
  
  $("#msgDialog").dialog("open");
}