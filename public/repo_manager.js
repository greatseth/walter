$(function() {
  $("#commits li").click(function() {
    var c    = $(this)
    var sha  = /[^_]+$/.exec(c.attr("id"))[0]
    $.get("/diffs/" + sha, function(data) {
      $("#diffs").html(data)
    })
  })
})
