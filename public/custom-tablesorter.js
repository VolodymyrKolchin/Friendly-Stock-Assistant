
$(function() {
    $("#myTable").tablesorter({
        theme : 'dropbox',
        cssIcon: 'tablesorter-icon',
        initialized : function(table){
          $(table).find('thead .tablesorter-header-inner').append('<i class="tablesorter-icon"></i>');
        }
      });
});