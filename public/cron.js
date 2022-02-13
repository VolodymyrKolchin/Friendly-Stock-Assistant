$(document).ready(function() {
    $('#my-custom-id').cron({
        initial: "42 3 * * *",
        onChange: function() {
            $('#example1-val').text($(this).cron("value"));
        }
    });
});