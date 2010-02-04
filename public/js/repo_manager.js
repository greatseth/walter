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
    $("#commits li").live("click", RepoManager.get_diff)
    
    if (document.location.hash) {
      var sha = document.location.hash.substring(1)
      $("#commit_" + sha).click()
    } else {
      $("#commits li").eq(0).click()
    }
    
    $("#select_branch").change(RepoManager.select_branch)
    
    RepoManager.observe_window_resize()
  },
  
  observe_window_resize: function() {
    RepoManager.fit_window()
    $(window).resize(RepoManager.fit_window)
  },
  
  fit_window: function() {
    // TODO test other browsers.. 20 used here is specific to Mac Firefox
    var height      = window.innerHeight - parseInt($("#header").css("height")) - 20
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
    $("#sha").html(sha.substring(0,18) + "...")
  },
  
  select_branch: function() {
    var select = $(this)
    var selected_branch = select.attr("options")[select.attr("selectedIndex")].value
    document.location.href = "/" + encodeURIComponent(selected_branch.replace(/\//g, '--'))
  }
}

$(RepoManager.onload)
