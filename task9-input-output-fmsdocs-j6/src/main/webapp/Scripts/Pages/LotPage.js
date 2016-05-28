$(document).ready(function () { 
  $("#edUserPrice").keyup(function () {
    if ($(this).val() != "")
      $(this).val($(this).val().replace(/[^0-9\.]/g, ""));
  });

  $("#edUserPrice").spinner({
    numberFormat: "n",
    min: 1,
    change: function(event, ui) {
      var val = parseInt(this.value, 10) || 1;
      $(this).spinner('value', val < 1 ? 1 : val);
    }
  });
  
  $("#edUserPrice").spinner().parent().addClass('app-ui-spinner');
  $("#edUserPrice").focus(function () {
    $(this).parent().addClass('app-ui-spinner-focus');
  });
  $("#edUserPrice").focusout(function () {
    $(this).parent().removeClass('app-ui-spinner-focus');
  });
  

  $("#edProlongDayCount").keyup(function () {
    if ($(this).val() != "")
      $(this).val($(this).val().replace(/[^0-9\.]/g, ""));
  });

  $("#edProlongDayCount").spinner({
    numberFormat: "n",
    min: 1,
    max: 365,
    change: function (event, ui) {
      var val = parseInt($(this).spinner('value'), 10) || 1;
      $(this).spinner('value', val > 365 ? 365 : val);
      $(this).spinner('value', val < 1 ? 1 : val);
    }
  });
  

  $("#edProlongDayCount").spinner().parent().addClass('app-ui-spinner');
  $("#edProlongDayCount").focus(function () {
    $(this).parent().addClass('app-ui-spinner-focus');
  });
  $("#edProlongDayCount").focusout(function () {
    $(this).parent().removeClass('app-ui-spinner-focus');
  });
  
  $("#btProlongLotEndSaleDate")
    .button()
    .click(function () {
    $.ajax({
      url: "LotPage.aspx",
      cache: false,
      data: "ajaxCommand=ProlongLotEndSaleDate&id=" + $.url().param('LotId') + "&daycount=" + $("#edProlongDayCount").spinner("value"),
      success: function (data) {
        if (data == null) {
          ShowErrMsg("Ошибка при получении данных с сервера!!!");
        } else {
          if (data.ErrorMsg == null) {            
            ShowMsg("Срок до заключения договора выбранного лота продлен!", RefreshPage);
          } else {
            ShowErrMsg(data.ErrorMsg);
          }
        }
      },
      error: function () { ShowErrMsg(arguments[2]); }
    });
    
    return false;
  });

  $(".closeOld").click(function () {
    $(".dialogOverlayOld").fadeOut();
    return false;
  });

  $("#btBuy")
    .button()
    .click(function () {
    var isOverStdPrice = false;
    var newPrice = $("#lLotPrice").text();
    var userPrice = $("#edUserPrice").spinner('value');//edUserPrice.GetValue();
    if (userPrice != null) {
      if (userPrice > newPrice) {
        newPrice = userPrice;
        isOverStdPrice = true;
      }
      else if (userPrice < newPrice) {
        ShowErrMsg("Введенная Вами цена не может быть меньше предложенной автоматически!!!");
        return false;
      }
    }
    
    $.ajax({
      url: "LotPage.aspx",
      type: "POST",
      cache: false,
      data: "ajaxCommand=NewLotOffer&data=" + 
            "{" +
            "\"LotId\":\"" + $("#lLotId").text() + "\"," +
            "\"LotOfferPrice\":\"" + newPrice + "\"," +
            "\"IsOverStdPrice\":\"" + isOverStdPrice + "\"" +
            "}",
      success: function (data) {
        if (data == null) {
          ShowErrMsg("Ошибка при получении данных с сервера!!!");
        } else {
          if (data.ErrorMsg == null) {
            ShowMsg("Ваша ставка успешно принята!", RefreshPage);
          } else {
            ShowErrMsg(data.ErrorMsg);
          }
        }
      },
      error: function () { ShowErrMsg(arguments[2]); }
    });
    
    return false;
    });

  $("#btRefusalBuying")
    .button()
    .click(function (event) {
      $.ajax({
        url: "LotPage.aspx",
        type: "GET",
        cache: false,
        data: "ajaxCommand=RefusalBuying&id=" + $("#lLotId").text(),
        success: function(data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              ShowMsg("Отказ от покупки успешно принят!", RefreshPage);
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function () { ShowErrMsg(arguments[2]); }
      });

      event.preventDefault();
    });

  $("#btSaveSAPData")
    .button()
    .click(function (event) {
      $.ajax({
        url: "LotPage.aspx",
        type: "POST",
        cache: false,
        data: "ajaxCommand=SaveSAPData&data=" + 
              "{" +
              "\"LotId\":\"" + $("#lLotId").text() + "\"," +
              "\"AgreementNumberSAP\":\"" + $("#edAgreementNumberSAP").get(0).value + "\"," +
              "\"WriteOffDocumentNumber\":\"" + $("#edWriteOffDocumentNumber").get(0).value +  "\"" + 
              "}",
        success: function(data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              ShowMsg("Данные SAP успешно сохранены!", RefreshPage);
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function () { ShowErrMsg(arguments[2]); }
      });

      event.preventDefault();
    });

  $("#btIsSold")
    .button()
    .click(function (event) {
      $.ajax({
        url: "LotPage.aspx",
        type: "GET",
        cache: false,
        data: "ajaxCommand=IsSold&id=" + $("#lLotId").text(),
        success: function(data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              ShowMsg("Подтверждение продажи лота успешно принято!", RefreshPage);
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function () { ShowErrMsg(arguments[2]); }
      });

      event.preventDefault();
    });

  $("#btChooseWinnerCancel")
    .button()
    .click(function (event) {
      $.ajax({
        url: "LotPage.aspx",
        type: "GET",
        cache: false,
        data: "ajaxCommand=ChooseWinnerCancel&id=" + $("#lLotId").text(),
        success: function (data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              ShowMsg("Успешно отменен выбор победителя!", RefreshPage);
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function () { ShowErrMsg(arguments[2]); }
      });

      event.preventDefault();
    });
  
  $("#LotInfoTabs").tabs({
    show: { effect: "fadeIn", duration: 150 },
    hide: { effect: "fadeOut", duration: 150 }
  });

  InitJQGridLotOfferList();

  InitSimpleForm("lotPhotoForm", "Фото лота", 680);

  RefreshLotInfo();
});

function InitPage() {
  $("#pnlSaleParams").hide();
  $("#btIsSold").hide();
  $("#pnlProlongLotEndSaleDate").hide();
  $("#btRefusalBuying").hide();
  $("#pnlConclusionAgreement").hide();
  $("#pnlIsSold").hide();
  $("#btChooseWinnerCancel").hide();
  $("#btSaveSAPData").hide();
  $("#pnlIsSold").height(97);
  $("#hlViewAct").hide();
}

function Test() {
  /*$("#pnlSaleParams").show();
  $("#btIsSold").show();
  $("#pnlProlongLotEndSaleDate").show();
  $("#btRefusalBuying").show();
  $("#pnlConclusionAgreement").show();
  $("#pnlIsSold").show();
  $("#btChooseWinnerCancel").show();
  $("#btSaveSAPData").show();*/
}

function RefreshLotInfo() {
  $.ajax({
       url: 'LotPage.aspx',
       cache: false,
       data: "ajaxCommand=GetLotPageInfo&id=" + $.url().param('LotId'),
       success: function (data) {
         if (data == null ||
             data.Lot == null ||
             data.User == null) {
           ShowErrMsg("Ошибка при получении данных страницы лота с сервера!!!");
         }
         else {
           if (data.ErrorMsg == null) {
             AssignLotFieldValues(data);
           }
           else {
             ShowErrMsg(data.ErrorMsg);
           }
         }
       },
       error: function () { ShowErrMsg(arguments[2]); }
  });
}

function AssignLotFieldValues(data) {
  SetInterfaceElementsVisible(data);

  var ieChg9 = false;
  var ieVersion = GetIEVersion();
  if (ieVersion == "7" ||
      ieVersion == "8" ||
      ieVersion == "9") {
    ieChg9 = true;
  }
  
  $("#lLotName").text((ieChg9 && data.Lot.LotName == null) ? "" : data.Lot.LotName);
  var re = /(\d{2})\.(\d{2})\.(\d{4})\s+/g;
  var tmpDate = new Date(data.Lot.LotEndSaleDate.replace(re, '$3-$2-$1T'));
  var dateStr = ('0' + tmpDate.getDate()).slice(-2) + '.' + ('0' + (tmpDate.getMonth() + 1)).slice(-2) + '.' + tmpDate.getFullYear();
  $("#lLotEndSaleDate").text((ieChg9 && data.Lot.LotEndSaleDate == null) ? "" : "(" + dateStr + ")");
  $("#lTimeLeft").text(data.Lot.TimeLeft);
  $("#lLotPrice").text(data.Lot.LotPrice);
  
  $('#edUserPrice').spinner('option', {
    max: Number.MAX_VALUE, min: data.Lot.LotPrice, step: data.Lot.LotPriceStep
  });
  
  $('#edUserPrice').spinner('value', data.Lot.LotPrice);
  $('#edProlongDayCount').spinner('value', 1);
  
  $("#lLotId").text(data.Lot.LotId);
  $("#lLotLocation").text(data.Lot.LotLocation);
  $("#lOSNumbers").text(data.Lot.OSNumbers);
  $("#lSerialNumber").text(data.Lot.SerialNumber);
  $("#lInventoryNumber").text(data.Lot.InventoryNumber);

  $("#lConclusionAgreementDateBefore").text(data.Lot.ConclusionAgreementDateBefore);
  $("#edAgreementNumberSAP").get(0).value = data.Lot.AgreementNumberSAP;
  $("#edWriteOffDocumentNumber").get(0).value = data.Lot.WriteOffDocumentNumber;

  ParseTextToRichText(data.Lot.LotDesc);
  if (data.Lot.IsActExists) {
    $("#hlViewAct").show();
  }
  else {
    $("#hlViewAct").hide();
  }
  
  $("#hlViewAct").get(0).href = "DownloadFileFromDB.ashx?FileCategoryInDB=ActTechnicalState&LotId=" + data.Lot.LotId;

  PrepareLotPhotoCarousel(data.LotPhoto);
}

function InitJQGridLotOfferList() {
  $('#jqgvLotOfferTableData').jqGrid({
    url: 'LotPage.aspx?ajaxgettabledata=LotOfferHistoryTable',
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    postData: { 'FilterByLotId': $.url().param('LotId') },
    mtype: 'GET',
    colNames: ['Дата', 'Ставка', 'Пользователь'],
    colModel: [
      { name: 'LotOfferDate', index: 'LotOfferDate', width: 140, align: 'center' },
      { name: 'LotOfferPrice', index: 'LotOfferPrice', width: 120, formatter: 'currency', formatoptions: { suffix: ' pуб.', decimalPlaces: 0 }, align: 'right' },
      { name: 'UserId', index: 'UserId', width: 220, hidden: true }],
    pager: $('#jqgvLotOfferTableDataPager'),
    rowNum: 10,
    rowList: [10, 20, 30, 100],
    sortname: 'LotOfferDate',
    sortorder: 'desc',
    width: 397,
    height: 320,
    shrinkToFit: false
  });
  
  $("#jqgvLotOfferTableData").jqGrid('navGrid', '#jqgvLotOfferTableDataPager', { edit: false, add: false, del: false, search: false });
}

function PrepareLotPhotoCarousel(data) {
  if (data == null ||
      data.length == 0) {
    $("#LotPhotoCarousel").hide();
    $("#ImgLotNoPhoto").show();
  }
  else {
    for (index = 0; index < data.length; index++) {
      $("#LotPhotoCarousel").append("<li><img src='DownloadFileFromDB.ashx?FileCategoryInDB=LotPhotoImage&LotPhotoId=" + data[index].LotPhotoId + "&nd=" + (new Date()).getTime() + "' id='LotPhotoSmall_" + data[index].LotPhotoId + "' class='CarouselImg' alt /></li>");
      $("#LotPhotoSmall_" + data[index].LotPhotoId)
        .click(function() {
          $("#LotPhotoBig").attr("src", $(this).attr("src"));
          $('#lotPhotoForm').dialog('open');
        });
    }

    $("#LotPhotoCarousel").jcarousel({
      vertical: true,
      scroll: 1,
      visible: 4,
      wrap: 'circular'
    });
  }
}
  
function ParseTextToRichText(inputText) {
  $("#edLotDescription").html('');

  var posUrlTagBegin = 0,
      posUrlTagEnd = 0,
      urlTagBegin = "[url]",
      urlTagEnd = "[/url]",
      resultText = "",
      text = "";
  while (inputText != "") {
    posUrlTagBegin = inputText.indexOf(urlTagBegin);
    if (posUrlTagBegin >= 0) {
      text = inputText.substr(0, posUrlTagBegin);
      inputText = inputText.substr(posUrlTagBegin + urlTagBegin.length);
      posUrlTagEnd = inputText.indexOf(urlTagEnd);
      resultText += text;

      if (posUrlTagEnd >= 0) {
        text = inputText.substr(0, posUrlTagEnd);
        resultText += "<a href='" + text + "'>" + text + "</a>";
        inputText = inputText.substr(posUrlTagEnd + urlTagEnd.length);
      }
    }
    else {
      resultText = inputText;
      break;
    }
  }

  resultText = resultText.replace("\n", "<br/>");
  resultText = resultText.replace("\t", "&nbsp;&nbsp;&nbsp;");
  $("#edLotDescription").html(resultText);
}

function SetInterfaceElementsVisible(data) {
  switch (data.Lot.LotStatusId) {
    case 2://InSale
      $("#pnlSaleParams").show();
      $("#btBuy").get(0).disabled = data.Lot.IsCurrentUserLastOffer;
      break;
    case 3://WaitingConclusionAgreement
      $("#pnlIsSold").height(136);
      $("#btIsSold").show();
      $("#pnlProlongLotEndSaleDate").show();

      if (data.UserIdIsWinnerSale) {
        $("#btRefusalBuying").show();
        $("#pnlConclusionAgreement").show();
      }
      break;
    case 4://IsSold
      $("#btRefusalBuying").hide();
      break;
  }

  if (data.User.IsAdmin) {
    $("#pnlIsSold").show();

    if (data.Lot.ConclusionAgreementExpiredCounter > 0) {
      $("#btChooseWinnerCancel").show();
    }

    AddUserIdColumnToOfferList();

    if (data.Lot.LotStatusId == 3) { //WaitingConclusionAgreement
      $("#pnlIsSold").height(136);
      $("#btSaveSAPData").show();
      $("#edAgreementNumberSAP").prop('readonly', false);
      $("#edWriteOffDocumentNumber").prop('readonly', false);
    }
  }
  else {
    if (data.User.IsAuditor) {
      AddUserIdColumnToOfferList();
    }

    if (data.User.IsAccountant) {
      $("#pnlIsSold").show();

      if (data.Lot.ConclusionAgreementExpiredCounter > 0) {
        $("#btChooseWinnerCancel").show();
      }

      if (data.Lot.LotStatusId == 3) { //WaitingConclusionAgreement
        $("#pnlIsSold").height(136);
        $("#btSaveSAPData").show();
        $("#edAgreementNumberSAP").prop('readonly', false);
        $("#edWriteOffDocumentNumber").prop('readonly', false);
      }
    }
  }

  if (!data.MaxRateOfferExists) {
    $("#btChooseWinnerCancel").hide();
  }
  
  if (data.Lot.LotStatusId == 4) {
    $("#pnlProlongLotEndSaleDate").hide();
    $("#pnlIsSold").hide();
    $("#btSaveSAPData").hide();
  }
}

function AddUserIdColumnToOfferList() {
  $('#jqgvLotOfferTableData').jqGrid('showCol', 'UserId');
}

function RefreshPage() {
  RefreshLotInfo();
  $('#jqgvLotOfferTableData').trigger('reloadGrid');
}