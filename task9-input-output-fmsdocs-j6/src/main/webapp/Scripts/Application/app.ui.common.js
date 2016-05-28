$.extend({
  clientID: function (id) {
    return $("[id$='_" + id + "']");
  }
});

function InitForm(formId, formTitle, saveText, saveHandler, formWidth) {
  var saveClicked = false;
  var dialog = $('#' + formId).dialog({
    dialogClass: "no-close",
    autoOpen: false,
    modal: true,
    resizable: false,
    height: "auto",
    width: (typeof formWidth == "undefined") ? 300 : formWidth,
    title: formTitle,
    maxHeight: $("#MainForm").height(),
    position: { my: "center", at: "center", of: $("#MainForm") },
    show: "fade",
    hide: "fade",
    open: function (event, ui) {
      dialog.overlay.addClass("ui-widget-overlay-fade");
    },
    buttons: [
      {
        text: saveText,
        click: function () {
          $(this).dialog("close");
          saveClicked = true;
        }
      },
      {
        text: "Отмена",
        click: function () {
          $(this).dialog("close");
        }
      }
    ]
  }).data("ui-dialog");
  
  $('#' + formId).off("dialogclose");
  $('#' + formId).on("dialogclose", function () {
    
    if (saveClicked) {
      saveHandler();
    }
    saveClicked = false;
  });
}

function InitSimpleForm(formId, formTitle, formWidth, myPos, atPos) {
  var dialog = $('#' + formId).dialog({
    autoOpen: false,
    modal: true,
    resizable: false,
    height: "auto",
    width: (typeof formWidth == "undefined") ? 300 : formWidth,
    title: formTitle,
    maxHeight: $("#MainForm").height(),
    position: { my: (typeof myPos == "undefined") ? "center" : "left", at: (typeof atPos == "undefined") ? "center" : "left", of: $("#MainForm") },
    show: "fade",
    hide: "fade",
    open: function (event, ui) {
      dialog.overlay.addClass("ui-widget-overlay-fade");
    },
  }).data("ui-dialog");
}

function GetKeyDataFromFocusedRow(hfData, focusedRowIndex) {
  var tableKeyData = hfData;
  var tableKeyDataRegex = /(\d+\:\w+)/;
  var tableKeysPair = tableKeyData.split(tableKeyDataRegex);
  for (var i in tableKeysPair) {
    var tableKeyPair = tableKeysPair[i];
    if (tableKeyPair != null &&
      tableKeyPair != "" &&
      tableKeyPair != ";") {
      var tableKeyPairRegex = /(\d+):/;
      var keyPairData = tableKeyPair.split(tableKeyPairRegex);
      if (keyPairData != null &&
        keyPairData instanceof Array &&
        keyPairData.length > 0 &&
        keyPairData[1] == focusedRowIndex) {
        return keyPairData[2];
      }
    }
  }
}

function InitDDLList(ddlName, hfddlName, ajaxurl, ajaxdata, msg, textPropertyName, valuePropertyName) {
  if ($(ddlName).get(0).options.length > 1) {
    return;
  }

  $.ajax(
   {
     url: ajaxurl,
     data: ajaxdata,
     cache: false,
     success: function (data) {
       if (data == null) {
         ShowMsg("Ошибка при получении данных " + msg + " с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           $(ddlName).get(0).options.length = 0;
           $.each(data, function (index, item) {
             $(ddlName).get(0).options[index] = new Option(item[textPropertyName], item[valuePropertyName]);
           });

           if ($(ddlName).get(0).options.length > 0) {
             $(ddlName).get(0).selectedIndex = 0;

             $.each($(ddlName).get(0).options, function (index, item) {
               if (item.value == $(hfddlName).get(0).value) {
                 $(ddlName).get(0).selectedIndex = index;
                 return false;
               }
             });
             
             $(ddlName).multiselect('refresh');
           }

         }
         else {
           ShowMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowMsg(arguments[2]); }
   });
}

function GetIEVersion() {
  if (document.all && !document.querySelector) {
    return "7";
  }
  else if (document.all && document.querySelector && !document.addEventListener) {
    return "8";
  }
  else if (document.all && document.querySelector && document.addEventListener && !window.atob) {
    return "9";
  }
  else {
    return "10";
  }
}