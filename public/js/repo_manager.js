var RepoManager = {
  onload: function() {
    $("#commits li").click(RepoManager.get_diff)
    
    if (document.location.hash) {
      var sha = document.location.hash.substring(1)
      $("#commit_" + sha).click()
    }
  },
  
  get_diff: function() {
    var c    = $(this)
    var sha  = /[^_]+$/.exec(c.attr("id"))[0]
    $.get("/diffs/" + sha, function(data) { $("#diffs").html(data) })
    document.location.hash = sha
    $("#sha").html(sha)
  }
}

$(RepoManager.onload)
