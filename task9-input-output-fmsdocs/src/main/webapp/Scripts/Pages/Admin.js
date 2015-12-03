$(document).ready(function () {
  DocumentReadyLot();
  DocumentReadyLotPhoto();
  DocumentReadyMessageTemplate();
  DocumentReadyUser();
  DocumentReadyGlobalSettings();
  
  $('.tooltip').tooltipster();

  //исправление отображения грида на невидимом табе Tab Widjet JQuery UI :
  //gvLotTableData.AdjustControl();
  //gvMailTemplateList.AdjustControl();
  /*gvUserTableData.AdjustControl();*/
  
  /*onHoverIn = function () {
    if (!$(this).hasClass('ui-state-disabled')) {
      $(this).addClass("ui-state-hover");
    }
  };

  onHoverOut = function () {
    $(this).removeClass("ui-state-hover");
  };*/
  

});

function OnLoad() {
  //$("#loadingPlaceHolder").fadeIn(100);      
}