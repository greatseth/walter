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
      $.get("/" + PROJ + "/diffs/" + sha, function(data) {
        $("#diffs .spinner").hide()
        $("#diffs").addClass("hiding_overflow")
        $("#diffs .content").html(data)
      })
      document.location.hash = sha
      $("#sha").html(sha)
    })
    
    // fetch first page of commits
    RepoManager.get_commits()
    
    // load initial commit
    if (document.location.hash) {
      var sha = document.location.hash.substring(1)
      $("#commit_" + sha).click()
    } else {
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
      document.location.href = "/" + PROJ + "/heads/" + RepoManager.selected_branch(true)
    })
    
    RepoManager.fit_window()
    RepoManager.observe_window_resize()
    RepoManager.observe_hotkeys()
  },
  
  selected_branch: function(escaped) {
    var select = $("#select_branch select")
    var branch_name = select.attr("options")[select.attr("selectedIndex")].value
    
    if (escaped) branch_name = encodeURIComponent(branch_name.replace(/\//g, '--'))
    return branch_name
  },
  
  observe_hotkeys: function() {
    handlers = {
      h: function() {
        document.location.href = $("#home a").attr("href")
      }
    }
    
    $.each(handlers, function(key,handler) {
      $(document).bind('keydown', key, handler)
    })
    
    $("input[type=text]").add("textarea").keydown(function(e) { e.stopPropagation() })
  },
  
  get_commits: function(page) {
    if (!page) var page = PAGE
    
    $.ajax({
      async: false,
      url: "/" + PROJ + "/heads/" + RepoManager.selected_branch(true) + "/commits",
      data: { page: page },
      success: function(commits) {
        $("#commits ol li:last").addClass("page-end")
        $("#commits ol").append(commits)
      }
    })
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
