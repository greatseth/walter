$.ajaxSetup({
  beforeSend: function() { $("#spinner").show() },
  complete:   function() { $("#spinner").hide() }
})

var RepoManager = {
  onload: function() {
    // Do this right away so the code immediately following works the way it is..
    RepoManager.observe_commit_selection()
    
    if (document.location.hash) {
      var sha = document.location.hash.substring(1)
      $("#commit_" + sha).click()
    } else {
      $("#commits li").eq(0).click()
    }
    
    // Now do general app onload-ery..
    RepoManager.fit_window()
    RepoManager.observe_window_resize()
    RepoManager.observe_branch_selection()
    RepoManager.observe_hotkeys()
  },
  
  observe_commit_selection: function(){
    $("#commits li").click(function() {
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
    })
  },
  
  observe_branch_selection: function(){
    $("#select_branch").change(function() {
      var select = $(this)
      var selected_branch = select.attr("options")[select.attr("selectedIndex")].value
      document.location.href = "/" + encodeURIComponent(selected_branch.replace(/\//g, '--'))
    })
  },
  
  observe_hotkeys: function() {
    $(document).bind('keyup', 'b', function() {
      // TODO we'll need to implement our own 'select' for this to work
      // $("#select_branch").click()
    })
    
    $(document).bind('keyup', 'c', function() {
      // TODO implement "click on sha to enter sha" feature :)
      // $("#sha").click()
    })
  },
  
  observe_window_resize: function() {
    $(window).resize(RepoManager.fit_window)
  },
  
  fit_window: function() {
    // TODO test other browsers.. 20 used here is specific to Mac Firefox
    var height      = window.innerHeight - parseInt($("#header").css("height")) - 20
    var diffs_width = window.innerWidth  - parseInt($("#commits").css("width")) - 3
    
    $("#commits").css({ height: height })
    $("#diffs").css({ width: diffs_width, height: height })
  }
}

$(RepoManager.onload)
