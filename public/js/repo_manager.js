var RepoManager = {
  onload: function() {
    $("#commits li").click(RepoManager.get_diff)
    
    if (document.location.hash) {
      var sha = document.location.hash.substring(1)
      $("#commit_" + sha).click()
    }
  },
  
  get_diff: function() {
    $("#diffs").html("<p class='diff_loading'>loading...</p>")
    var c    = $(this)
    $("#commits li.selected").removeClass("selected")
    c.addClass("selected")
    var sha  = /[^_]+$/.exec(c.attr("id"))[0]
    $.get("/diffs/" + sha, function(data) { $("#diffs").html(data) })
    $("#sha").html(sha.substring(0,18) + "...")
  }
}

$(RepoManager.onload)
