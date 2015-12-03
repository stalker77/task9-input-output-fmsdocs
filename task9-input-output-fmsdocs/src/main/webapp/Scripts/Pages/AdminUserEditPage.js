function DocumentReadyUser() {
  $("#btRefreshUserList").click(function () {
    $('#jqgvUserTableData').jqGrid().trigger("reloadGrid");

    return false;
  });

  $("#btAddUser").click(function () {
    GetUserFormDataForAdd();

    return false;
  });

  $("#btDelUser").click(function () {
    var currentSUserId = GetCurrnetSUserId();
    if (currentSUserId >= 0) {
      ShowDlg("Действительно удалить выбранного пользователя?", DelUser);
    }
    return false;
  });
     
  $("#ddlUserTypeId").multiselect({
    multiple: false,
    header: false,
    selectedList: 1,
    show: ["fade", 500],
    hide: ["fade", 300],
    close: function () {
      var btn = document.getElementById(this.id + 'Button');
      if (btn != null) {
        btn.focus();
      }
    },
    beforeopen: function() {
      InitDDLList("#ddlUserTypeId", "#hfUserTypeId", "Admin.aspx", "ajaxget=RefUserTypeTable", "RefUserTypeList", "UserTypeName", "UserTypeId");     
    }
  });
  
  $('#jqgvUserTableData').jqGrid({
    url: 'Admin.aspx?ajaxgettabledata=UserTable',
    datatype: 'json',
    jsonReader: {
      repeatitems: false,
      cell: ""
    },
    mtype: 'GET',
    colNames: ['SUserId', 'Логин пользователя', 'Email пользователя', 'Тип пользователя'],
    colModel: [
      { name: 'SUserId', index: 'SUserId', width: 1, hidden: true, key: true },
      { name: 'UserId', index: 'UserId', width: 180 },
      { name: 'UserEmail', index: 'UserEmail', width: 230 },
      { name: 'UserTypeName', index: 'UserTypeName', width: 120 }],
    pager: $('#jqgvUserTableDataPager'),
    rowNum: 10,
    rowList: [10, 20, 30, 100],
    sortname: 'SUserId',
    sortorder: 'asc',
    width: 557,
    height: 280,
    ondblClickRow: function (id) {
      if (id) {
        GetUserGridSelectedValues();
      }
    }
  });
  
  /*$('.modalDialogContent').mCustomScrollbar({
    scrollInertia: 150,
    theme: "dark-thick",
    autoHideScrollbar: true,
    scrollButtons: {
      enable: true
    }
  });*/
  
  InitForm('userForm', "Пользователь", "Сохранить", SaveUser, 350);
}

function SaveUser() {
  $.ajax(
    {
      url: "Admin.aspx",
      type: "POST",
      cache: false,
      data: "ajaxset=UserTable&rowdata=" +
            "{" +

              "\"SUserId\":\"" + $("#hfSUserId").get(0).value + "\"," +

              "\"UserId\":\"" + $("#edUserId").get(0).value.replace("\\", "\\\\") + "\"," +

              "\"UserEmail\":\"" + $("#edUserEmail").get(0).value + "\"," +

              "\"UserTypeId\":\"" + $("#ddlUserTypeId").get(0).options[$("#ddlUserTypeId").get(0).selectedIndex].value + "\"" +
          
            "}",
      success: function (data) {
        if (data == null || data.ErrorMsg == null) {
          $('#jqgvUserTableData').jqGrid().trigger("reloadGrid");
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
}

function GetCurrnetSUserId() {
  var currentSUserId = -1;
  var selectedRowindex = $('#jqgvUserTableData').jqGrid('getGridParam', 'selrow');
  if (selectedRowindex) {
    var selectedRowData = $('#jqgvUserTableData').jqGrid('getRowData', selectedRowindex);
    currentSUserId = parseInt(selectedRowData.SUserId, 10);
  }

  return currentSUserId;
}

function GetUserGridSelectedValues() {
  GetUserFormData(GetCurrnetSUserId());
}

function GetUserFormDataForAdd() {
  $.ajax(
   {
     url: "Admin.aspx",
     data: "ajaxgetadd=UserTable",
     cache: false,
     success: function (data) {
       if (data == null) {
         ShowErrMsg("Ошибка при получении данных формы с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           AssignUserFormFieldValues(data);
           $('#userForm').dialog("open");
           //$.clientID("edUserId").focus();
         }
         else {
           ShowErrMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowErrMsg(arguments[2]); }
   });
}

function GetUserFormData(id) {
  $.ajax(
   {
     url: "Admin.aspx",
     cache: false,
     data: "ajaxget=UserTable&id=" + id,
     success: function (data) {
       if (data == null) {
         ShowErrMsg("Ошибка при получении данных формы с сервера!!!");
       }
       else {
         if (data.ErrorMsg == null) {
           AssignUserFormFieldValues(data);
           $('#userForm').dialog("open");
           //$.clientID("edUserId").focus();
         }
         else {
           ShowErrMsg(data.ErrorMsg);
         }
       }
     },
     error: function () { ShowErrMsg(arguments[2]); }
   });
}

function DelUser() {
  var currentSUserId = GetCurrnetSUserId();
//  HideDlg();
  $.ajax({
    url: "Admin.aspx",
    cache: false,
    data: "ajaxdel=UserTable&id=" + currentSUserId,
    success: function (data) {
      if (data == null) {
        ShowMsg("Ошибка при удалении пользователя!!!");
      }
      else {
        if (data.ErrorMsg == null) {
          $('#jqgvUserTableData').jqGrid().trigger("reloadGrid");
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

function AssignUserFormFieldValues(data) {

  $("#hfSUserId").get(0).value = data.SUserId;

  $("#edUserId").get(0).value = data.UserId;

  $("#edUserEmail").get(0).value = data.UserEmail;

  $("#hfUserTypeId").get(0).value = data.UserTypeId;  
  /*$.clientID("ddlUserTypeId").get(0).options.length = 0;
  $.clientID("ddlUserTypeId").get(0).options[0] = new Option(data.UserTypeName, data.UserTypeId);
  $.clientID("ddlUserTypeId").get(0).selectedIndex = 0;*/
  

  $("#ddlUserTypeId").get(0).options.length = 0;
  $("#ddlUserTypeId").get(0).options[0] = new Option(data.UserTypeName, data.UserTypeId);
  $("#ddlUserTypeId").get(0).selectedIndex = 0;
  $("#ddlUserTypeId").multiselect('refresh');
}

function SetEnableDisableUserButtons() {
  
}