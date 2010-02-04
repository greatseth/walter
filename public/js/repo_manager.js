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
    $("#commits li").live("click", RepoManager.get_diff)
  },
  
  handle_branch_search: function() {
    
  },
  
  reset_branch_search: function() {
    $("#branches").hide()
  },
  
  observe_branch_selection: function() {
    $("#select_branch_search").keypress(function(e) {
      $("#branches").show()
      switch(e.keyCode) {
        case 27:
          $("#selected_branch").show()
          $(this).attr("value", "").hide()
          break
        case 38: // up
          RepoManager.move_branch_search_selection_up()
          // TODO
          break
        case 40: // down
          // TODO
          break
        case 8: // backspace
          break
        case 9: // tab
          break
        case 13: // return
          break
        default:
          RepoManager.handle_branch_search()
      }
      
      setTimeout(RepoManager.reset_branch_search, 2000)
    })
    
    /*
    $("#select_branch_search").autoSuggest(RepoManager.branches, {
      start: function() { console.log("entering autoSuggest start hook") },
      startText: "",
      selectionClick: RepoManager.branch_selection_handler
    })
    */
    
    $("#select_branch").click(function() {
      $("#selected_branch").hide()
      $("#select_branch_search").show().focus()
    })
  },
  
  branch_selection_handler: function(selection) {
    console.log("selected branch", selection)
    document.location = "/" + selection.html()
  },
  
  observe_hotkeys: function() {
    $(document).bind('keyup', 'b', function() {
      $("#select_branch").click()
    })
    
    $(document).bind('keyup', 'h', function() {
      document.location.href = $("#home a").attr("href")
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
  },
  
  // TODO return early when .selected
  get_diff: function() {
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
  },
  
  select_branch: function() {
    var select = $(this)
    var selected_branch = select.attr("options")[select.attr("selectedIndex")].value
    document.location.href = "/" + encodeURIComponent(selected_branch.replace(/\//g, '--'))
  }
}

$(RepoManager.onload)
