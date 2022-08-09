// $(function() {
//     $("#myTable").tablesorter({widgets: ['zebra']});
// });

$(function() {
    // call the tablesorter plugin
    $("#myTable").tablesorter({
        theme : 'blue',

        // change the default sorting order from 'asc' to 'desc'
        sortInitialOrder: "desc"
    });
}); 