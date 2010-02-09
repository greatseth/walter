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
      RepoManager.load_first_commit()
    }
    
    // observe link to next page of commits
    $("#more a").click(function() {
      var current_page = PAGE
      var new_page     = PAGE + 1
      RepoManager.get_commits({ page: new_page })
      PAGE += 1
      return false
    })
    
    // observe branch selection
    $("#select_branch select").change(function() {
      var select = $(this)
      var selected_branch = select.attr("options")[select.attr("selectedIndex")].value
      document.location.href = "/" + PROJ + "/heads/" + encodeURIComponent(selected_branch.replace(/\//g, '--'))
    })
    
    RepoManager.fit_window()
    RepoManager.observe_window_resize()
    RepoManager.observe_hotkeys()
  },
  
  load_first_commit: function() {
    $("#commits li").eq(0).click()
  },
  
  observe_hotkeys: function() {
    handlers = {
      /*
      b: function() {
        $("#select_branch select option:first").click()
      },
      c: function() {
        $("#sha").click()
      },
      */
      h: function() {
        // $("#home a").click() doesn't work, sadly, 
        // but perhaps understandably..
        document.location.href = $("#home a").attr("href")
      },
      w: function() {
        var glob = prompt("Find commits that changed:")
        RepoManager.get_commits({ whatchanged: glob, new_list: true })
        RepoManager.load_first_commit()
      }
    }
    
    $.each(handlers, function(key,handler) {
      $(document).bind('keydown', key, handler)
    })
  },
  
  get_commits: function(params) {
    if (!params) var params = {}
    if (!params.page) params.page = PAGE
    
    var new_list = params.new_list
    delete params.new_list
    
    $.ajax({
      async: false,
      url: "/" + PROJ + "/commits",
      data: params,
      success: function(commits) {
        $("#commits ol li:last").addClass("page-end")
        
        if (new_list) {
          $("#commits ol").html(commits)
        } else {
          $("#commits ol").append(commits)
        }
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
