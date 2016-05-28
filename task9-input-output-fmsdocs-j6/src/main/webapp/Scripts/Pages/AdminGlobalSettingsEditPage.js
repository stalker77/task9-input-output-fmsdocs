function DocumentReadyGlobalSettings() {
  GetGlobalOptionsValues();

  $("#edWaitingTimeConclusionAgreement").keyup(function () {
    if ($(this).val() != "")
      $(this).val($(this).val().replace(/[^0-9\.]/g, ""));
  });

  $("#edWaitingTimeConclusionAgreement").spinner({
    min: 1
  });

  $("#edRefusalBuyerCount").keyup(function () {
    if ($(this).val() != "")
      $(this).val($(this).val().replace(/[^0-9\.]/g, ""));
  });
  
  $("#edRefusalBuyerCount").spinner({
    min: 0
  });
  
  $("#edWaitingTimeConclusionAgreement").spinner().parent().addClass('app-ui-spinner');
  $("#edWaitingTimeConclusionAgreement").focus(function() {
    $(this).parent().addClass('app-ui-spinner-focus');
  });
  $("#edWaitingTimeConclusionAgreement").focusout(function () {
    $(this).parent().removeClass('app-ui-spinner-focus');
  });

  $("#edRefusalBuyerCount").spinner().parent().addClass('app-ui-spinner');
  $("#edRefusalBuyerCount").focus(function () {
    $(this).parent().addClass('app-ui-spinner-focus');
  });
  $("#edRefusalBuyerCount").focusout(function () {
    $(this).parent().removeClass('app-ui-spinner-focus');
  });

  $("#btSaveGlobalOptions")
    .button()
    .click(function () {
    $.ajax({
      url: "admin",
      type: "POST",
      cache: false,
      data: "ajaxset=GlobalOptions&rowdata=" +
            "{" +
              "\"WaitingTimeConclusionAgreement\":\"" + $("#edWaitingTimeConclusionAgreement").get(0).value + "\"," +
              "\"RefusalBuyerCount\":\"" + $("#edRefusalBuyerCount").get(0).value + "\"" +
            "}",
      success: function (data) {
        if (data == null) {
          ShowErrMsg("Ошибка при сохранении глобальных параметров!!!");
        }
        else {
          if (data.ErrorMsg != null) {
            ShowErrMsg(data.ErrorMsg);
          }
          else {
            ShowMsg("Глобальные параметры сохранены.");
          }
        }
      },
      error: function () { ShowErrMsg(arguments[2]); }
    });
    return false;
  });
  
  $("#btLoadAgreementTemplate")
    .button()
    .click(function () {
    $("#FakeAgreementTemplateUpload").click();
    return false;
  });
  
  $("#FakeAgreementTemplateUpload").fileupload({
    url: 'fileUpload?FileCategoryInDB=AgreementTemplate',
    dataType: 'json',
    forceIframeTransport: true,
    done: function (e, data) {
      if (typeof data.result != 'undefined' &&
          typeof data.result.ErrorMsg != 'undefined') {
        ShowErrMsg(data.result.ErrorMsg);
      } else {
        ShowMsg("Шаблон договора успешно загружен!");
      }
    },
    fail: function(e, data) {
      ShowErrMsg(data.errorThrown);
    }
  });
}

function GetGlobalOptionsValues() {
  $.ajax({
    url: "admin",
    cache: false,
    data: "ajaxget=GlobalOptions",
    success: function (data) {
      if (data == null) {
        ShowErrMsg("Ошибка при получении глобальных параметров с сервера!!!");
      }
      else {
        if (data.ErrorMsg == null) {
          $("#edWaitingTimeConclusionAgreement").get(0).value = data.WaitingTimeConclusionAgreement;
          $("#edRefusalBuyerCount").get(0).value = data.RefusalBuyerCount;
        }
        else {
          ShowErrMsg(data.ErrorMsg);
        }
      }
    },
    error: function () { ShowErrMsg(arguments[2]); }
  });
}

function UploadAgreementTemplate() {
    $("#FakeAgreementTemplateUpload").fileupload(
      'option',
      'url',
      'fileUpload?FileCategoryInDB=AgreementTemplate'
    );

  //console.log($("#FakeAgreementTemplateUpload").html());
  /*$("#FakeAgreementTemplateUpload").submit();*/
}