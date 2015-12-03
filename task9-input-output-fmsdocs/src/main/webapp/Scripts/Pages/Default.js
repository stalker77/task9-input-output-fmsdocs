var StrLotTableName = "LotTable";

/*var StrDownloadFileFromDBName = "http://localhost:21455/";
var StrDownloadFileFromDBName = "http://kvk-web-servicesnet4.megafon.ru/OSSDataService/";*/

$(document).ready(function () {
  $("#ddlLotListView").multiselect({
    multiple: false,
    header: false,
    height: 'auto',
    selectedList: 1,
    show: ["fade", 500],
    hide: ["fade", 300],
    close: function () {
      var btn = document.getElementById(this.id + 'Button');
      if (btn != null) {
        btn.focus();
      }
    },
    click: function (event, ui) {
      var jqgvLotTableData = $('#jqgvLotTableData');
      jqgvLotTableData.jqGrid('setGridParam', { 'postData': { 'LotListView': ui.value } });     //Применяем в качестве фильтра таблицы
      jqgvLotTableData.trigger('reloadGrid');
    }
  });

  InitJQGridLotBidList();
});

function InitJQGridLotBidList() {
  var  jqgvLotTableData = $('#jqgvLotTableData');
  jqgvLotTableData.jqGrid({
    url: 'default?ajaxgettabledata=LotTable',
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    postData: { 'LotListView': $("#ddlLotListView").val() },
    mtype: 'GET',
    colNames: ['№ лота', 'Фото', 'Название лота', 'Кол-во ставок', 'Цена', 'Оставшееся время'],
    colModel: [
      { name: 'id', index: 'id', width: 70, align: 'center', key: true },
      { name: 'LotPhotoId', width: 100, formatter: LotPhotoFormatter, align: 'center' },
      { name: 'LotName', index: 'LotName', width: 150 },
      { name: 'LotBids', index: 'LotBids', width: 100, align: 'right' },
      { name: 'LotPrice', index: 'LotPrice', width: 120, align: 'right', formatter: 'currency', formatoptions: { suffix: ' pуб.', decimalPlaces: 0 } },
      { name: 'TimeLeft', index: 'TimeLeft', width: 150 }],
    pager: $('#jqgvLotTableDataPager'),
    rowNum: 10,
    rowList: [10, 20, 30, 100],
    sortname: 'LotId',
    sortorder: 'desc',
    autowidth: true,
    height: 284,    
    ondblClickRow: function (id) {
      if (id) {
        var selectedRowindex = jqgvLotTableData.jqGrid('getGridParam', 'selrow');
        var selectedRowData = jqgvLotTableData.jqGrid('getRowData', selectedRowindex);
        var currentLotId = -1;
        currentLotId = parseInt(selectedRowData.LotId, 10);
        if (currentLotId >= 0) {
          window.location.href = "LotPage.aspx?LotId=" + currentLotId;
        }
      }
    }
  });

  jqgvLotTableData.jqGrid('navGrid', '#jqgvLotTableDataPager', { edit: false, add: false, del: false, search: false });
}

function LotPhotoFormatter(cell, options, row) {
  if (row.LotPhotoId == undefined) {
    return "<img src='Images/no_photo.png' alt style='height:50px;'/>";
  } else {
    return "<img src='" + /*StrDownloadFileFromDBName +*/ "downloadFileFromDB?FileCategoryInDB=LotPhotoImage&LotPhotoId=" + row.LotPhotoId + "&nd=" + new Date() + "' alt style='height:50px;'/>";
  }
}