$.ajaxSetup({
  beforeSend: function() { $("#header .spinner").show() },
  complete:   function() { $("#header .spinner").hide() }
})

// http://javascriptly.com/2008/09/javascript-to-detect-google-chrome/
var userAgent = navigator.userAgent.toLowerCase();
$.browser = {
  version: (userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1],
  chrome:  /chrome/.test( userAgent ),
  safari:  /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),
  opera:   /opera/.test( userAgent ),
  msie:    /msie/.test( userAgent ) && !/opera/.test( userAgent ),
  mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
}

var RepoManager = {
  get_commits: function(page) {
    $.ajax({
      async: false,
      url: document.location.pathname,
      data: { page: page },
      success: function(commits) {
        $("#commits ol li:last").addClass("page-end")
        $("#commits ol").append(commits)
      }
    })
  },
  
  onload: function() {
    // observe commit selection
    $("#commits li").live("click", function() {
      $("#diffs").removeClass("hiding_overflow")
      $("#diffs .content").html("")
      $("#diffs .spinner").show()

      var c = $(this)
      $("#commits li.selected").removeClass("selected")
      c.addClass("selected")

      var sha = /[^_]+$/.exec(c.attr("id"))[0]
      $.get("/diffs/" + sha, function(data) {
        $("#diffs .spinner").hide()
        $("#diffs").addClass("hiding_overflow")
        $("#diffs .content").html(data)
      })
      document.location.hash = sha
      $("#sha").html(sha)
    })
    
    // fetch first page of commits
    RepoManager.get_commits(PAGE)
    
    // load initial commit
    if (document.location.hash) {
      var sha = document.location.hash.substring(1)
      console.log("loading requested commit", sha)
      $("#commit_" + sha).click()
    } else {
      console.log("loading first commit")
      $("#commits li").eq(0).click()
    }
    
    // observe link to next page of commits
    $("#more a").click(function() {
      var current_page = PAGE
      var new_page     = PAGE + 1
      RepoManager.get_commits(new_page)
      PAGE += 1
      return false
    })
    
    // observe branch selection
    $("#select_branch select").change(function() {
      var select = $(this)
      var selected_branch = select.attr("options")[select.attr("selectedIndex")].value
      document.location.href = "/" + encodeURIComponent(selected_branch.replace(/\//g, '--'))
    })
    
    // Now do general app onload-ery..
    RepoManager.fit_window()
    RepoManager.observe_window_resize()
    RepoManager.observe_hotkeys()
  },
  
  observe_hotkeys: function() {
    // $(document).bind('keyup', 'b', function() {
    //   $("#select_branch").click()
    // })
    
    $(document).bind('keyup', 'h', function() {
      $("#home a").click()
    })
    
    // $(document).bind('keyup', 'c', function() {
    //   $("#sha").click()
    // })
  },
  
  observe_window_resize: function() {
    $(window).resize(RepoManager.fit_window)
  },
  
  fit_window: function() {
    // TODO test other browsers.. number used here is specific to Firefox.. wah wah..
    var height      = window.innerHeight - parseInt($("#header").css("height")) - 18
    var diffs_width = window.innerWidth  - parseInt($("#commits").css("width")) - RepoManager.fit_window_width_offset()
    
    $("#commits").css({ height: height })
    $("#diffs").css({ width: diffs_width, height: height })
  },
  
  fit_window_width_offset: function() {
    if ($.browser.chrome || $.browser.safari) {
      return 16
    } else { // firefox
      return 3
    }
  }
}

$(RepoManager.onload)
