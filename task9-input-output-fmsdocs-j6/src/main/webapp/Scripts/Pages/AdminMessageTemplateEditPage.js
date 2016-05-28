function DocumentReadyMessageTemplate() {
  $("#btSaveMessageTemplate")
    .button()
    .click(function () {
    var currnetMessageTemplateId = GetCurrnetMessageTemplateId();
    //var messgaeTemplateData = { "MessageTemplateId": currnetMessageTemplateId, "MessageTemplateData": $("#edMessageTemplateData").get(0).value.replace("\\", "\\\\") };
    //var messgaeTemplateDataString = JSON.stringify(messgaeTemplateData);
    $.ajax(
      {
        url: "Admin.aspx",
        type: "POST",
        cache: false,
        data: "ajaxset=MessageTemplateTable&rowdata=" + 
              "{" +

                "\"MessageTemplateId\":\"" + currnetMessageTemplateId + "\"," +

                "\"MessageTemplateData\":" + JSON.stringify($("#edMessageTemplateData").get(0).value) +

              "}",
        success: function (data) {
          if (data == null || data.ErrorMsg == null) {
            ShowMsg("Шаблон письма сохранен!");
          }
          else {
            ShowErrMsg(data.ErrorMsg);
          }
        },
        error: function () {
          ShowErrMsg(arguments[2]);
        }
      }
    );
    return false;
  });
  
  $('#jqgvMessageTemplateTableData').jqGrid({
    url: 'Admin.aspx?ajaxgettabledata=MessageTemplateTable',
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    mtype: 'GET',
    colNames: ['MessageTemplateId', 'Название шаблона сообщения'],
    colModel: [
      { name: 'MessageTemplateId', index: 'MessageTemplateId', width: 1, hidden: true, key: true },
      { name: 'MessageTemplateName', index: 'MessageTemplateName', width: 180 }],
    pager: $('#jqgvMessageTemplateTableDataPager'),
    rowNum: 13,
    rowList: [10, 20, 30, 100],
    sortname: 'MessageTemplateId',
    sortorder: 'asc',
    width: 480,
    height: 320,
    onSelectRow: function (id) {
      if (id) {
        GetMessageTemplateData();
      }
    },
    gridComplete: function() {
      jQuery('#jqgvMessageTemplateTableData').setSelection(1);
    }
  });
  
  $("#jqgvMessageTemplateTableData").jqGrid('navGrid', '#jqgvMessageTemplateTableDataPager', { edit: false, add: false, del: false, search: false });
}

function GetCurrnetMessageTemplateId() {
  var currentMessageTemplateId = -1;
  var selectedRowindex = $('#jqgvMessageTemplateTableData').jqGrid('getGridParam', 'selrow');
  if (selectedRowindex) {
    var selectedRowData = $('#jqgvMessageTemplateTableData').jqGrid('getRowData', selectedRowindex);
    currentMessageTemplateId = parseInt(selectedRowData.MessageTemplateId, 10);
  }

  return currentMessageTemplateId;
}

function GetMessageTemplateData() {
  var currnetMessageTemplateId = GetCurrnetMessageTemplateId();

  $.ajax(
   {
     url: "Admin.aspx",
     cache: false,
     data: "ajaxget=MessageTemplateTable&id=" + currnetMessageTemplateId,
     success: function (data) {
       if (data == null) {
         ShowErrMsg("Ошибка при получении данных формы с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           $("#edMessageTemplateData").get(0).value = data.MessageTemplateData;
         }
         else {
           ShowErrMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowErrMsg(arguments[2]); }
   });
}