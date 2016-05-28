var StrAdminPageName = "Admin.aspx";
var StrLotTableName = "LotTable";
var SelectedAdminLotRowIdAfterSaveLot = -1;

function DocumentReadyLot() {
  /*---begin setting numeric form fields---*/

  $("#edLotBasePrice").keyup(function() {
    if ($(this).val() != "")
      $(this).val($(this).val().replace(/[^0-9\.]/g, ""));
  });

  $("#edLotPriceStep").keyup(function() {
    if ($(this).val() != "")
      $(this).val($(this).val().replace(/[^0-9\.]/g, ""));
  });

  /*---end setting numeric form fields---*/

  /*---begin setting datetime form fields---*/

  $("#edLotEndSaleDate").datetimepicker({ dateFormat: "dd.mm.yy", timeFormat: "HH:mm:ss", defaultDate: new Date() });

  $("#edDateBegin").datepicker({ dateFormat: "dd.mm.yy", defaultDate: new Date(), showButtonPanel: true });
  $("#edDateBegin").datepicker("setDate", new Date());

  $("#edDateEnd").datepicker({ dateFormat: "dd.mm.yy", defaultDate: new Date(), showButtonPanel: true });
  $("#edDateEnd").datepicker("setDate", new Date());
  
  $("#ddlLotListView").change(function () {
    //$("#hfFocusedLotId").get(0).value = -1;
    RefreshLotList();
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

  /*---end setting datetime form fields---*/

  InitLotTabs_Activate();

  $("#btLoadLotAct")
    .button()
    .click(function () {
    $("#FakeLotActUpload").click();
    return false;
  });

  $("#btRefreshLotList").click(function () {
    RefreshLotList();

    return false;
  });

  $("#btAddLot").click(function() {
    GetLotFormDataForAdd();

    return false;
  });

  $("#btDelLot").click(function() {
    var currentLotId = GetCurrnetLotId();
    if (currentLotId >= 0) {
      ShowDlg("Действительно удалить выбранный лот?", DelLot);
    }
    return false;
  });

  $("#btLotInSale").click(function() {
    var currentLotId = GetCurrnetLotId();
    if (currentLotId >= 0) {
      $.ajax({
        url: StrAdminPageName,
        cache: false,
        data: "ajaxCommand=LotInSale&id=" + currentLotId,
        success: function(data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              if ($("#ddlLotListView").get(0).options[$("#ddlLotListView").get(0).selectedIndex].value == 2) {
                RefreshLotList();
              } else {               
                var selectedRowindex = $('#jqgvLotTableData').jqGrid('getGridParam', 'selrow');
                $('#jqgvLotTableData').jqGrid('setCell', selectedRowindex, 'LotStatusId', 2);
                SetEnableDisableLotButtons();
              }
              ShowMsg("Выбранный лот запущен в продажу!");
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function() { ShowErrMsg(arguments[2]); }
      });
    }

    return false;
  });

  $("#btLotRemoveFromSale").click(function() {
    var currentLotId = GetCurrnetLotId();
    if (currentLotId >= 0) {
      $.ajax({
        url: StrAdminPageName,
        cache: false,
        data: "ajaxCommand=LotRemoveFromSale&id=" + currentLotId,
        success: function(data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              if ($("#ddlLotListView").get(0).options[$("#ddlLotListView").get(0).selectedIndex].value == 1) {
                RefreshLotList();
              } else {               
                var selectedRowindex = $('#jqgvLotTableData').jqGrid('getGridParam', 'selrow');
                $('#jqgvLotTableData').jqGrid('setCell', selectedRowindex, 'LotStatusId', 6);
                SetEnableDisableLotButtons();
              }
              ShowMsg("Выбранный лот снят с продажи!");
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function() { ShowErrMsg(arguments[2]); }
      });
    }

    return false;
  });

  $("#btChooseWinnerCancel").click(function() {
    var currentLotId = GetCurrnetLotId();
    if (currentLotId >= 0) {
      $.ajax({
        url: StrAdminPageName,
        cache: false,
        data: "ajaxCommand=ChooseWinnerCancel&id=" + currentLotId,
        success: function(data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              var gvLotSelectedRow = $('#jqgvLotTableData').jqGrid('getGridParam', 'selrow');
              RefreshLotList();
              ShowMsg("Выбор победителя для выделенного лота успешно отменен!");
              SelectedAdminLotRowIdAfterSaveLot = gvLotSelectedRow; //$('#jqgvLotTableData').jqGrid('setGridParam', gvLotSelectedRow);
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function() { ShowErrMsg(arguments[2]); }
      });
    }

    return false;
  });

  $("#btProlongLotEndSaleDate").click(function() {
    var currentLotId = GetCurrnetLotId();
    if (currentLotId >= 0) {
      $.ajax({
        url: StrAdminPageName,
        cache: false,
        data: "ajaxCommand=ProlongLotEndSaleDate&id=" + currentLotId + "&daycount=" + $("#edProlongDayCount").spinner("value"),
        success: function(data) {
          if (data == null) {
            ShowErrMsg("Ошибка при получении данных с сервера!!!");
          } else {
            if (data.ErrorMsg == null) {
              ShowMsg("Срок до заключения договора выбранного лота продлен!");
            } else {
              ShowErrMsg(data.ErrorMsg);
            }
          }
        },
        error: function() { ShowErrMsg(arguments[2]); }
      });
    }

    return false;
  });

  $("#btGetLotAgreement").click(function() {
    var currentLotId = GetCurrnetLotId();
    if (currentLotId >= 0) {
      window.location.href = "DownloadFileFromDB.ashx?FileCategoryInDB=UserAgreementSale&LotId=" + currentLotId + "&nd=" + new Date();
    }

    return false;
  });

  $("#FakeLotActUpload").fileupload({
    url: 'FileUploadHandler.ashx?FileCategoryInDB=ActTechnicalState&LotId=',
    dataType: 'json',
    forceIframeTransport : true,
    done: function (e, data) {
      if (typeof data.result != 'undefined' &&
          typeof data.result.ErrorMsg != 'undefined') {
        ShowErrMsg(data.result.ErrorMsg);
      } else {
        $("#hlViewActtechnicalState").show();
        ShowMsg("Акт успешно загружен!");
      }
    },
    fail: function (e, data) {
      ShowErrMsg(data.errorThrown);
    }
  });

  $("#RegionalAccordion").accordion();

  $("#btCreateListOSForSellerReport")
    .button()
    .click(function () {
    window.location.href = "DownloadFileFromDB.ashx?FileCategoryInDB=ListOSForSellerReport&DateBegin=" + $("#edDateBegin").get(0).value + "&DateEnd=" + $("#edDateEnd").get(0).value + "&nd=" + new Date();
    return false;
  });

  $("#ReportAccordion").accordion();

  $("#btCreateOSListProducedForSaleReport")
    .button()
    .click(function () {
    window.location.href = "DownloadFileFromDB.ashx?FileCategoryInDB=OSListProducedForSaleReport&nd=" + new Date();
    return false;
  });
  
  $("#ddlLotListView").multiselect({
    multiple: false,
    header: false,
    height: 'auto',
    selectedList: 1,
    show: ["fade", 500],
    hide: ["fade", 300],
    minWidth: 'auto',
    close: function () {
      var btn = document.getElementById(this.id + 'Button');
      if (btn != null) {
        btn.focus();
      }
    },
    click: function (event, ui) {
      $('#jqgvLotTableData').jqGrid('setGridParam', { 'postData': { 'LotListView': ui.value } });     //Применяем в качестве фильтра таблицы
      $('#jqgvLotTableData').trigger('reloadGrid');
    }
  });

  InitJQGridLotList();
  
  InitForm('lotForm', "Лот", "Сохранить", SaveLot, 410);

  InitJQGridLotOfferList();
  
  InitJQGridLotHistoryList();
}

function InitJQGridLotList() {
  $('#jqgvLotTableData').jqGrid({
    url: StrAdminPageName + '?ajaxgettabledata=' + StrLotTableName,
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    postData: { 'LotListView': $("[id='ddlLotListView'] option:selected").val() },
    mtype: 'GET',
    colNames: ['№ лота', 'Название лота', 'Местоположение(город)', 'Список номеров ОС', 'LotStatusId'],
    colModel: [
      { name: 'LotId', index: 'LotId', width: 70, align: 'right', key: true },
      { name: 'LotName', index: 'LotName', width: 150 },
      { name: 'LotLocation', index: 'LotLocation', width: 100 },
      { name: 'OSNumbers', index: 'AdvInfo', width: 120 },
      { name: 'LotStatusId', index: 'LotStatusId', width: 1, hidden: true }],
    pager: $('#jqgvLotTableDataPager'),
    rowNum: 10,
    rowList: [10, 20, 30, 100],
    sortname: 'LotId',
    sortorder: 'desc',
    width: 510,
    height: 284,
    onSelectRow: function (id) {
      LotTable_onSelectRow(id);
    },
    ondblClickRow: function (id) {
      if (id) {
        GetLotGridSelectedValues();
      }
    },
    gridComplete: function () {
      if (SelectedAdminLotRowIdAfterSaveLot == -1) {
        var ids = $('#jqgvLotTableData').jqGrid('getDataIDs');
        $('#jqgvLotTableData').jqGrid('setSelection', ids[0]);
      }
      else {
        $('#jqgvLotTableData').jqGrid('setSelection', SelectedAdminLotRowIdAfterSaveLot);
        SelectedAdminLotRowIdAfterSaveLot = -1;
      }

      var recCount = $('#jqgvLotTableData').jqGrid('getGridParam', 'reccount');
      if (recCount == 0) {
        LotTable_onSelectRow(-1);
      }
    }
  });
}

function InitJQGridLotOfferList() {
  $('#jqgvLotOfferTableData').jqGrid({
    url: StrAdminPageName + '?ajaxgettabledata=LotOfferHistoryTable',
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    postData: { 'FilterByLotId': GetCurrnetLotId() },
    mtype: 'GET',
    colNames: ['Дата', 'Ставка', '№ цикла торгов', 'Пользователь'],
    colModel: [
      { name: 'LotOfferDate', index: 'LotOfferDate', width: 140, align: 'center' },
      { name: 'LotOfferPrice', index: 'LotOfferPrice', width: 120, formatter: 'currency', formatoptions: { suffix: ' pуб.', decimalPlaces: 0 }, align: 'right' },
      { name: 'SaleRound', index: 'SaleRound', width: 100, align: 'right' },
      { name: 'UserId', index: 'UserId', width: 180, hidden: true }],
    pager: $('#jqgvLotOfferTableDataPager'),
    rowNum: 10,
    rowList: [10, 20, 30, 100],
    sortname: 'LotOfferDate',
    sortorder: 'desc',
    width: 420,
    height: 260,
    shrinkToFit: false
  });
  
  $("#jqgvLotOfferTableData").jqGrid('navGrid', '#jqgvLotOfferTableDataPager', { edit: false, add: false, del: false, search: false });
}

function InitJQGridLotHistoryList() {
  $('#jqgvLotHistoryTableData').jqGrid({
    url: StrAdminPageName + '?ajaxgettabledata=LotHistoryLogTable',
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    postData: { 'FilterByLotId': GetCurrnetLotId() },
    mtype: 'GET',
    colNames: ['ДатаВремя', 'Логин пользователя', 'Действие', 'Доп. инфо.'],
    colModel: [
      { name: 'DateTime', index: 'DateTime', width: 150, align: 'center' },
      { name: 'UserId', index: 'UserId', width: 180 },
      { name: 'ActionName', index: 'ActionName', width: 120 },
      { name: 'AdvInfo', index: 'AdvInfo', width: 200 }],
    pager: $('#jqgvLotHistoryTableDataPager'),
    rowNum: 10,
    rowList: [10, 20, 30, 100],
    sortname: 'DateTime',
    sortorder: 'desc',
    width: 420,
    height: 260,
    shrinkToFit: false
  });
  
  $("#jqgvLotHistoryTableData").jqGrid('navGrid', '#jqgvLotHistoryTableDataPager', { edit: false, add: false, del: false, search: false });
}

function InitLotTabs_Activate() {
  $("#LotTabs").tabs({
    activate: function (event, ui) {
      if (ui.newTab[0].innerText == "Ставки" &&
        $("#hfLotOfferListRefreshed").get(0).value == 0) {
        RefreshLotOfferList();

        $("#hfLotOfferListRefreshed").get(0).value = 1;
      }
      else if (ui.newTab[0].innerText == "Фото" &&
        $("#hfLotPhotoListRefreshed").get(0).value == 0) {
        RefreshLotPhotoList();

        $("#hfLotPhotoListRefreshed").get(0).value = 1;
      }
      else if (ui.newTab[0].innerText == "История" &&
        $("#hfLotHistoryListRefreshed").get(0).value == 0) {
        RefreshLotHistoryList();

        $("#hfLotHistoryListRefreshed").get(0).value = 1;
      }
    },
    show: { effect: "fadeIn", duration: 150 },
    hide: { effect: "fadeOut", duration: 150 }
  });
}

function SaveLot() {
  $.ajax(
    {
      url: StrAdminPageName,
      type: "POST",
      cache: false,
      data: "ajaxset=" + StrLotTableName + "&rowdata=" +
        "{" +
        "\"LotId\":\"" + $("#edLotId").get(0).innerHTML + "\"," +
        "\"LotName\":" + JSON.stringify($("#edLotName").get(0).value) + "," +
        "\"LotDesc\":" + JSON.stringify($("#edLotDesc").get(0).value) + "," +
        "\"LotBasePrice\":\"" + $("#edLotBasePrice").get(0).value + "\"," +
        "\"LotPriceStep\":\"" + $("#edLotPriceStep").get(0).value + "\"," +
        "\"LotEndSaleDate\":\"" + $("#edLotEndSaleDate").get(0).value + "\"," +
        "\"LotStatusId\":\"" + $("#hfLotStatusId").get(0).value + "\"," +
        "\"OSNumbers\":" + JSON.stringify($("#edOSNumbers").get(0).value) + "," +
        "\"LotLocation\":" + JSON.stringify($("#edLotLocation").get(0).value) + "," +
        "\"ConclusionAgreementDateBefore\":\"" + (($("#edConclusionAgreementDateBefore").get(0).value.toLowerCase() == "null") ? "" : $("#edConclusionAgreementDateBefore").get(0).value) + "\"," +
        "\"AgreementNumberSAP\":" + JSON.stringify($("#edAgreementNumberSAP").get(0).value) + "," +
        "\"WriteOffDocumentNumber\":" + JSON.stringify($("#edWriteOffDocumentNumber").get(0).value) + "," +
        "\"SerialNumber\":" + JSON.stringify($("#edSerialNumber").get(0).value) + "," +
        "\"InventoryNumber\":" + JSON.stringify($("#edInventoryNumber").get(0).value) +
        "}",
      success: function (data) {
        if (data == null || data.ErrorMsg == null) {
          RefreshLotList();
          if (data.LotId != null) {
            SelectedAdminLotRowIdAfterSaveLot = data.LotId;
          }
          //
        } else {
          ShowErrMsg(data.ErrorMsg);
        }
      },
      error: function () {
        ShowErrMsg(arguments[2]);
      }
    }
  );
}

function GetCurrnetLotId() {
  var selectedRowindex = $('#jqgvLotTableData').jqGrid('getGridParam', 'selrow');  
  var currentLotId = -1;
  if (selectedRowindex != null) {
    var selectedRowData = $('#jqgvLotTableData').jqGrid('getRowData', selectedRowindex);
    currentLotId = parseInt(selectedRowData.LotId, 10);
  }

  return currentLotId;
}

function RefreshLotList() {
  $('#jqgvLotTableData').jqGrid('setGridParam', { 'postData': { 'LotListView': $("[id='ddlLotListView'] option:selected").val() } });     //Применяем в качестве фильтра таблицы
  $('#jqgvLotTableData').trigger('reloadGrid');
}

function RefreshLotOfferList() {
  var currentLotId = -1;
  currentLotId = GetCurrnetLotId();
  $('#jqgvLotOfferTableData').jqGrid('setGridParam', { 'postData': { 'FilterByLotId': currentLotId } });     //Применяем в качестве фильтра ведомой таблицы
  $('#jqgvLotOfferTableData').trigger('reloadGrid');
}

function RefreshLotPhotoList() {
  var currentLotId = -1;
  currentLotId = GetCurrnetLotId();
  $('#jqgvLotPhotoTableData').jqGrid('setGridParam', { 'postData': { 'FilterByLotId': currentLotId } });     //Применяем в качестве фильтра ведомой таблицы
  $('#jqgvLotPhotoTableData').trigger('reloadGrid');
}

function RefreshLotHistoryList() {
  var currentLotId = -1;
  currentLotId = GetCurrnetLotId();
  $('#jqgvLotHistoryTableData').jqGrid('setGridParam', { 'postData': { 'FilterByLotId': currentLotId } }); //Применяем в качестве фильтра ведомой таблицы
  $('#jqgvLotHistoryTableData').trigger('reloadGrid');
}

function LotTable_onSelectRow(id) {
  if (id) {    
    $("#hfLotOfferListRefreshed").get(0).value = 0;
    $("#hfLotPhotoListRefreshed").get(0).value = 0;
    $("#hfLotHistoryListRefreshed").get(0).value = 0;

    var activeTab = $("#LotTabs").tabs("option", "active");

    switch (activeTab) {
      case 0:
        RefreshLotOfferList();
        $("#hfLotOfferListRefreshed").get(0).value = 1;
        break;
      case 1:
        RefreshLotPhotoList();
        $("#hfLotPhotoListRefreshed").get(0).value = 1;
        break;
      case 2:
        RefreshLotHistoryList();
        $("#hfLotHistoryListRefreshed").get(0).value = 1;
        break;
      default:
        RefreshLotOfferList();
        $("#hfLotOfferListRefreshed").get(0).value = 1;
    }
  }

  SetEnableDisableLotButtons(); 
}

function DelLot() {
  var currentLotId = GetCurrnetLotId();
  $.ajax({
    url: StrAdminPageName,
    cache: false,
    data: "ajaxdel=" + StrLotTableName +"&id=" + currentLotId,
    success: function (data) {
      if (data == null) {
        ShowErrMsg("Ошибка при удалении лота!!!");
      }
      else {
        if (data.ErrorMsg == null) {
          RefreshLotList();
        }
        else {
          ShowErrMsg(data.ErrorMsg);
        }
      }
    },
    error: function () { ShowErrMsg(arguments[2]); }
  });  
  return false;
}

function GetLotFormDataForAdd() {
  $.ajax(
   {
     url: StrAdminPageName,
     data: "ajaxgetadd=" + StrLotTableName,
     cache: false,
     success: function (data) {
       if (data == null) {
         ShowErrMsg("Ошибка при получении данных формы с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           AssignLotFormFieldValues(data);
           EnableLotFormControls();
           $('#lotForm').dialog("open");
         }
         else {
           ShowErrMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowErrMsg(arguments[2]); }
   });
}

function GetLotFormData(id) {
  $.ajax(
   {
     url: StrAdminPageName,
     cache: false,
     data: "ajaxget=" + StrLotTableName +"&id=" + id,
     success: function (data) {
       if (data == null) {
         ShowErrMsg("Ошибка при получении данных формы с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           AssignLotFormFieldValues(data);
           if (data.LotStatusId == 2 ||
             data.LotStatusId == 3 ||
             data.LotStatusId == 4) {
             $("#edLotName").attr('disabled', 'disabled');
             $("#edLotDesc").attr('disabled', 'disabled');
             $("#edLotBasePrice").attr('disabled', 'disabled');
             $("#edLotPriceStep").attr('disabled', 'disabled');
             $("#edLotEndSaleDate").attr('disabled', 'disabled');
             $("#edOSNumbers").attr('disabled', 'disabled');
             $("#edLotLocation").attr('disabled', 'disabled');
             $("#edSerialNumber").attr('disabled', 'disabled');
             $("#edInventoryNumber").attr('disabled', 'disabled');
           }
           else {
             EnableLotFormControls();
           }
           
           if (data.IsActExists) {
             $("#hlViewActtechnicalState").show();
           }
           else {
             $("#hlViewActtechnicalState").hide();
           }
           
           $('#lotForm').dialog("open");
         }
         else {
           ShowErrMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowErrMsg(arguments[2]); }
   });
}

function EnableLotFormControls() {
  $("#edLotName").removeAttr('disabled');
  $("#edLotDesc").removeAttr('disabled');
  $("#edLotBasePrice").removeAttr('disabled');
  $("#edLotPriceStep").removeAttr('disabled');
  $("#edLotEndSaleDate").removeAttr('disabled');
  $("#edOSNumbers").removeAttr('disabled');
  $("#edLotLocation").removeAttr('disabled');
  $("#edSerialNumber").removeAttr('disabled');
  $("#edInventoryNumber").removeAttr('disabled');
  $("#hlViewActtechnicalState").show();
}

function AssignLotFormFieldValues(data) {
  if (data.LotId < 0) {
    $("#LotActUploadBox").hide();
  }
  else {
    $("#LotActUploadBox").show();
  }

  var ieChg9 = false;
  var ieVersion = GetIEVersion();
  if (ieVersion == "7" ||
      ieVersion == "8" ||
      ieVersion == "9") {
    ieChg9 = true;
  }

  $("#edLotId").get(0).innerHTML = data.LotId;

  $("#edLotName").get(0).value = (ieChg9 && data.LotName == null) ? "" : data.LotName;

  $("#edLotDesc").get(0).value = (ieChg9 && data.LotDesc == null) ? "" : data.LotDesc;

  $("#edLotBasePrice").get(0).value = data.LotBasePrice;

  $("#edLotPriceStep").get(0).value = data.LotPriceStep;

  $("#edLotEndSaleDate").get(0).value = data.LotEndSaleDate;

  $("#edOSNumbers").get(0).value = (ieChg9 && data.OSNumbers == null) ? "" : data.OSNumbers;

  $("#edLotLocation").get(0).value = (ieChg9 && data.LotLocation == null) ? "" : data.LotLocation;

  $("#edStatus").get(0).value = data.LotStatusName;

  $("#hfLotStatusId").get(0).value = data.LotStatusId;

  $("#edConclusionAgreementDateBefore").get(0).value = (ieChg9 && data.ConclusionAgreementDateBefore == null) ? "" : data.ConclusionAgreementDateBefore;

  $("#edConclusionAgreementExpiredCounter").get(0).value = data.ConclusionAgreementExpiredCounter;

  $("#edAgreementNumberSAP").get(0).value = (ieChg9 && data.AgreementNumberSAP == null) ? "" : data.AgreementNumberSAP;

  $("#edWriteOffDocumentNumber").get(0).value = (ieChg9 && data.WriteOffDocumentNumber == null) ? "" : data.WriteOffDocumentNumber;

  $("#edSerialNumber").get(0).value = (ieChg9 && data.SerialNumber == null) ? "" : data.SerialNumber;

  $("#edInventoryNumber").get(0).value = (ieChg9 && data.InventoryNumber == null) ? "" : data.InventoryNumber;
  
  $("#hlViewActtechnicalState").get(0).href = "DownloadFileFromDB.ashx?FileCategoryInDB=ActTechnicalState&LotId=" + data.LotId + "&nd=" + new Date();
}

function GetLotGridSelectedValues() {
  GetLotFormData(GetCurrnetLotId());
}

function OnGetLotTableRowValues(values) {
  var lotStatusId = 1;
  lotStatusId = values;
  
  switch (lotStatusId) {
    case 1: //Cоздан
      $("#btLotInSale").get(0).disabled = false;
      break;
    case 2: //Выставлен на продажу
      $("#btLotRemoveFromSale").get(0).disabled = false;
      break;
    case 3: //Ожидание заключения договора
      $("#btLotRemoveFromSale").get(0).disabled = false;
      $("#btChooseWinnerCancel").get(0).disabled = false;
      $("#btProlongLotEndSaleDate").get(0).disabled = false;
      //$.clientID("btReportLotTender").get(0).disabled = false;
      $("#btGetLotAgreement").get(0).disabled = false;
      break;
    case 4: //Продан
      //$("#btReportLotTender").get(0).disabled = false;
      $("#btGetLotAgreement").get(0).disabled = false;
      break;
    case 5: //Неудачное завершение торгов
      $("#btLotInSale").get(0).disabled = false;
      break;
    case 6: //Снят с продажи
      $("#btLotInSale").get(0).disabled = false;
      break;
    default:
  }
}

function SetEnableDisableLotButtons() {
  var selectedRowindex = $('#jqgvLotTableData').jqGrid('getGridParam', 'selrow');
  var selectedRowData = $('#jqgvLotTableData').jqGrid('getRowData', selectedRowindex);
  var lotStatusId = 1;
  lotStatusId = parseInt(selectedRowData.LotStatusId, 10);

  $("#btLotInSale").get(0).disabled = true;
  $("#btLotRemoveFromSale").get(0).disabled = true;
  $("#btChooseWinnerCancel").get(0).disabled = true;
  $("#btProlongLotEndSaleDate").get(0).disabled = true;
  $("#btGetLotAgreement").get(0).disabled = true;

  if (selectedRowindex >= 0) {
    OnGetLotTableRowValues(lotStatusId);
  }
}

function UploadLotAct() {
  var currentLotId = GetCurrnetLotId();
  if (currentLotId >= 0) {
    $("#FakeLotActUpload").fileupload(
      'option',
      'url',
      'FileUploadHandler.ashx?FileCategoryInDB=ActTechnicalState&LotId=' + currentLotId
    );

    //console.log($("#FakeLotActUpload").html());
    /*$("#FakeLotActUpload").submit();*/
    return false;
  }
}