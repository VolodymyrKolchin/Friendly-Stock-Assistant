$(document).ready(function() {
    $('#my-custom-cron').cron({
        initial: "0 8 * * *",
        onChange: function() {
            $('#example1-val').text($(this).cron("value"));
        }
    });
});