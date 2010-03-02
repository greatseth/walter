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
      $.get(RepoManager.url("diffs", sha), function(data) {
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
      var current_page = RepoManager.current_page
      var new_page     = RepoManager.current_page + 1
      RepoManager.get_commits({ page: new_page })
      RepoManager.current_page += 1
      return false
    })
    
    // observe branch selection
    var branch_select = $("#select_branch select")
    if (branch_select) {
      branch_select.change(function() {
        document.location.href = RepoManager.head_url()
      })
    }
    
    RepoManager.fit_window()
    RepoManager.observe_window_resize()
    RepoManager.observe_hotkeys()
  },
  
  load_first_commit: function() {
    $("#commits li").eq(0).click()
  },
  
  url: function() {
    var args = $.makeArray(arguments)
    args.unshift(RepoManager.project)
    return "/" + args.join("/")
  },
  
  head_url: function() {
    var args = $.makeArray(arguments)
    var head = RepoManager.selected_branch(true)
    if (!head) head = "*"
    
    args.unshift("heads", head)
    return RepoManager.url.apply(null, args)
  },
  
  selected_branch: function(escaped) {
    var branch_select = $("#select_branch select")
    if (branch_select.length == 0) {
      return
    } else {
      var branch_name = branch_select.attr("options")[branch_select.attr("selectedIndex")].value
      if (escaped) branch_name = encodeURIComponent(branch_name.replace(/\//g, '--'))
      return branch_name
    }
  },
  
  observe_hotkeys: function() {
    handlers = {
      h: function(e) {
        document.location.href = $("#home a").attr("href")
      },
      w: function(e) {
        $(".modal").show()
        $(".modal input[type=text]").val("").focus().keypress(function(e) {
          switch(e.keyCode) {
            case 13: // enter
              $(".modal").hide()
              var glob = $(".modal input[type=text]").attr("value")
              document.location.href = RepoManager.url("whatchanged", glob)
              break
            case 27: // esc
              $(".modal").hide()
              $(".modal input[type=text]").attr("value", "")
              $(document).focus()
              break
            default:
          }
        })
      }
    }
    
    $.each(handlers, function(key,handler) {
      $(document).bind('keypress', key, handler)
    })
    
    $("input[type=text]").add("textarea").keydown(function(e) { e.stopPropagation() })
  },
  
  get_commits: function(params) {
    if (!params) var params = {}
    if (!params.page) params.page = RepoManager.current_page
    
    var new_list = params.new_list
    delete params.new_list
    
    if (RepoManager.mode) {
      params.mode = RepoManager.mode
      if (params.mode == "whatchanged") params.glob = $.trim($("#sha").text())
    }
    
    $.ajax({
      async: false,
      url: RepoManager.head_url("commits"),
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
