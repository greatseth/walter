$.ajaxSetup({
  beforeSend: function() { $("#spinner").show() },
  complete:   function() { $("#spinner").hide() }
})

var RepoManager = {
  onload: function() {
    $("#commits li").click(RepoManager.get_diff)
    
    if (document.location.hash) {
      var sha = document.location.hash.substring(1)
      $("#commit_" + sha).click()
    } else {
      $("#commits li").eq(0).click()
    }
    
    $("#select_branch").change(RepoManager.select_branch)
  },
  
  get_diff: function() {
    $("#diffs").removeClass("hiding_overflow").html('<p class="diff_loading">loading...</p>')
    var c = $(this)
    $("#commits li.selected").removeClass("selected")
    c.addClass("selected")
    var sha = /[^_]+$/.exec(c.attr("id"))[0]
    $.get("/diffs/" + sha, function(data) {
      $("#diffs").addClass("hiding_overflow").html(data)
    })
    document.location.hash = sha
    $("#sha").html(sha.substring(0,18) + "...")
  },
  
  select_branch: function() {
    var select = $(this)
    var selected_branch = select.attr("options")[select.attr("selectedIndex")].value
    document.location.href = "/" + encodeURIComponent(selected_branch.replace(/\//g, '--'))
  }
}

$(RepoManager.onload)
