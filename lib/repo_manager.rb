module RepoManager
  def commits_per_page
    20
  end
  
  ###
  
  def view_commit(commit)
    # @spinner.show
    slot.scroll_top = 0
    @diffs.clear { view_diffs commit }
    # @spinner.hide
  end
  
  def view_diffs(commit)
    commit.diffs.each do |d|
      stack :margin => [0,0,0,10] do
        d.diff.split("\n").each do |l|
          present_line l
        end
      end
    end
  rescue Grit::Git::GitTimeout
    stack do
      background red
      stack :margin => 5 do
        para "Whoa, timed out! You probably have a ", 
          strong("HUMONGO"), " file in this commit."
        para "We'll try to handle this better in the future. Sorry. :("
      end
    end
  end
  
  def present_line(line)
    style = { :size => base_font_size, :margin => 0, :family => "Courier" }
    
    if line =~ /^(\-|\+){3}/
      style.merge! :weight => "bold", :stroke => white
    end
    
    stack do
      background color_for_line(line)
      stack :margin => 1 do
        para Iconv.conv("UTF-8", "LATIN1", line), style
      end
    end
  end
  
  ###
  
  ###
  
  def open_repo(directory)
    @repo = begin
      Grit::Repo.new(directory)
    rescue Grit::InvalidGitRepositoryError
      alert "Not a Git repo, son!"
      return
    end
    
    @name.text = File.basename directory
    
    @select_branches.items = @repo.branches.map { |b| b.name }
    @select_branches.choose "master"
    
    load_repo
  end
  
  def load_repo(page = 1)
    @page_display.text = @page = page
    
    @diffs.clear if @diffs
    
    @hide_merges.checked = repo_settings[:hide_merges]
    
    @commits.clear do
      commits_for_page.each_with_index do |commit,i|
        default_bg_color = if commit.merge?
          "#E8F8BD"
        else
          i%2==0 ? gray(0.9) : white
        end
        
        commit_list_item commit, default_bg_color
      end
    end if @commits
    
    @prev.state = ("disabled" if page == 1) 
    @next.state = ("disabled" if commits_for_page(@page + 1).empty?)
  end
  
  def commits_for_page(page = @page)
    commits = @repo.commits(@selected_branch, commits_per_page, ((page - 1) * commits_per_page))
    commits.reject! { |c| c.merge? } if @hide_merges.checked?
    commits
  end
  
  def color_for_line(line)
    case line
    when /^(\-|\+){3}/ then gray(0.3)
    when /^\+{1}/      then green
    when /^\-{1}/      then red
    else white
    end
  end
end
