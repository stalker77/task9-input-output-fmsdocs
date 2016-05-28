/*var StrDownloadFileFromDBName = "http://localhost:21455/";
var StrDownloadFileFromDBName = "http://kvk-web-servicesnet4.megafon.ru/OSSDataService/";*/

function DocumentReadyLotPhoto() {
  /*---begin setting numeric form fields---*/

  $("#edLotPhotoOrderNumber").keyup(function() {
    if ($(this).val() != "")
      $(this).val($(this).val().replace(/[^0-9\.]/g, ""));
  });

  /*---end setting numeric form fields---*/

  $("#btAddLotPhoto").click(function() {
    GetLotPhotoFormDataForAdd();
    return false;
  });

  $("#btDelLotPhoto").click(function() {
    var currentLotPhotoId = GetCurrentLotPhotoId();
    if (currentLotPhotoId >= 0) {
      ShowDlg("Действительно удалить выбранное фото лота?", DelLotPhoto);
    }
    return false;
  });

  $("#edLotPhotoImage").click(function() {
    $("#FakeLotPhotoUpload").click();
  });

  $("#FakeLotPhotoUpload").fileupload({
    url: 'FileUploadHandler.ashx?FileCategoryInDB=LotPhoto',
    dataType: 'json',
    done: function (e, data) {
      if (typeof data.result != 'undefined' &&
          typeof data.result.ErrorMsg != 'undefined') {
        ShowErrMsg(data.result.ErrorMsg);
      } else {
        $.each(data.result.files, function(index, file) {
          $("#edLotPhotoImage").get(0).src = file.Name;
        });
      }
    },
    fail: function (e, data) {
      ShowErrMsg(data.errorThrown);
    }
  });
  
  $('#jqgvLotPhotoTableData').jqGrid({
    url: 'Admin.aspx?ajaxgettabledata=LotPhotoTable',
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    postData: { 'FilterByLotId': GetCurrnetLotId() },
    mtype: 'GET',
    colNames: ['LotPhotoId', '№ пп', 'Изображение', 'Главная'],
    colModel: [
      { name: 'LotPhotoId', index: 'LotPhotoId', width: 1, hidden: true, key: true },
      { name: 'LotPhotoOrderNumber', index: 'LotPhotoOrderNumber', width: 20, align: 'right' },
      { name: 'LotPhotoImage', width: 100, formatter: LotPhotoFormatter, align: 'center' },
      { name: 'PhotoInList', index: 'PhotoInList', formatter: 'checkbox', width: 100, align: 'center' }],
    pager: $('#jqgvLotPhotoTableDataPager'),
    rowNum: 13,
    rowList: [10, 20, 30, 100],
    sortname: 'LotPhotoId',
    sortorder: 'asc',
    width: 420,
    height: 211,
    ondblClickRow: function (id) {
      if (id) {
        GetLotPhotoGridSelectedValues();
      }
    }
  });
  
  $("#jqgvLotPhotoTableData").jqGrid('navGrid', '#jqgvLotPhotoTableDataPager', { edit: false, add: false, del: false, search: false });
  
  InitForm('lotPhotoForm', "Фото лота", "Сохранить", SaveLotPhoto, 350);
}

function SaveLotPhoto() {
  $.ajax(
    {
      url: "Admin.aspx",
      type: "POST",
      cache: false,
      data: "ajaxset=LotPhotoTable&rowdata=" +
        "{" +
        "\"LotPhotoId\":\"" + $("#hfLotPhotoId").get(0).value + "\"," +
        "\"LotId\":\"" + $("#hfLotId").get(0).value + "\"," +
        "\"LotPhotoOrderNumber\":\"" + $("#edLotPhotoOrderNumber").get(0).value + "\"," +
        "\"PhotoTmpSrc\":\"" + (($("#edLotPhotoImage").get(0).src.indexOf('DownloadFileFromDB.ashx') > -1) ? "" : $("#edLotPhotoImage").get(0).src) + "\"," +
        "\"PhotoInList\":\"" + $("#edPhotoInList").get(0).checked + "\"" +
        "}",
      success: function(data) {
        if (data == null || data.ErrorMsg == null) {
          RefreshLotPhotoList();
          $("#hfLotPhotoListRefreshed").get(0).value = 1;
        } else {
          ShowErrMsg(data.ErrorMsg);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        /*alert(jqXHR.responseText);
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
        console.log(arguments);*/
        ShowErrMsg(arguments[2]);
      }
    }
  );
}

function LotPhotoFormatter(cell, options, row) {
  return "<img src='" + /*StrDownloadFileFromDBName +*/ "DownloadFileFromDB.ashx?FileCategoryInDB=LotPhotoImage&LotPhotoId=" + row.LotPhotoId + "&nd=" + new Date() + "' alt style='height:50px;'/>";
}

function DelLotPhoto() {
  var currentLotPhotoId = GetCurrentLotPhotoId();
  $.ajax({
    url: "Admin.aspx",
    cache: false,
    data: "ajaxdel=LotPhotoTable&id=" + currentLotPhotoId,
    success: function (data) {
      if (data == null) {
        ShowMsg("Ошибка при удалении фото лота!!!");
      }
      else {
        if (data.ErrorMsg == null) {
          RefreshLotPhotoList();
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

function GetLotPhotoFormDataForAdd() {
  //var index = gvLotTableData.GetFocusedRowIndex();
  var FocusedLotId = GetCurrnetLotId();//$("tr[id$='gvLotTableData_DXDataRow" + index + "']").children("td").get(0).childNodes[0].data;
  $.ajax(
   {
     url: "Admin.aspx",
     data: "ajaxgetadd=LotPhotoTable&id=" + FocusedLotId,
     cache: false,
     success: function (data) {
       if (data == null) {
         ShowMsg("Ошибка при получении данных формы с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           AssignLotPhotoFormFieldValues(data);
           $('#lotPhotoForm').dialog("open");
           //$.clientID("edLotPhotoOrderNumber").focus();
         }
         else {
           ShowErrMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowErrMsg(arguments[2]); }
   });
}

function GetLotPhotoFormData(id) {
  $.ajax(
   {
     url: "Admin.aspx",
     cache: false,
     data: "ajaxget=LotPhotoTable&id=" + id,
     success: function (data) {
       if (data == null) {
         ShowMsg("Ошибка при получении данных формы с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           AssignLotPhotoFormFieldValues(data);
           $('#lotPhotoForm').dialog("open");
           //$.clientID("edLotPhotoOrderNumber").focus();
         }
         else {
           ShowErrMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowErrMsg(arguments[2]); }
   });
}

function AssignLotPhotoFormFieldValues(data) {

  $("#hfLotPhotoId").get(0).value = data.LotPhotoId;

  $("#hfLotId").get(0).value = data.LotId;

  $("#edLotPhotoOrderNumber").get(0).value = data.LotPhotoOrderNumber;

  $("#edLotPhotoImage").get(0).src = "Images/no_photo.png";
  if (data.LotPhotoImage != null) {
    var selectedRowindex = $('#jqgvLotPhotoTableData').jqGrid('getGridParam', 'selrow');
    if (selectedRowindex >= 0) {
      var selectedRowData = $('#jqgvLotPhotoTableData').jqGrid('getRowData', selectedRowindex);
      var lotPhotoSrc = /*StrDownloadFileFromDBName +*/ "DownloadFileFromDB.ashx?FileCategoryInDB=LotPhotoImage&LotPhotoId=" + selectedRowData.LotPhotoId + "&nd=" + new Date();
      $("#edLotPhotoImage").get(0).src = lotPhotoSrc;
    }
  }

  $("#edPhotoInList").get(0).checked = data.PhotoInList;

}

function GetCurrentLotPhotoId() {
  var selectedRowindex = $('#jqgvLotPhotoTableData').jqGrid('getGridParam', 'selrow');
  var selectedRowData = $('#jqgvLotPhotoTableData').jqGrid('getRowData', selectedRowindex);
  var currentLotId = -1;
  currentLotId = parseInt(selectedRowData.LotPhotoId, 10);

  return currentLotId;
}

function GetLotPhotoGridSelectedValues() {
  GetLotPhotoFormData(GetCurrentLotPhotoId());
}

function UploadLotPhoto() {
  $("#FakeLotPhotoUpload").submit();
}