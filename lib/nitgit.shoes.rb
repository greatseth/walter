Shoes.setup do
  gem "grit"
end

%w(
grit
iconv
).each { |lib| require lib }

%w(
grit_extensions
settings
colors
repo_manager
pagination
layout
table
).each { |support| require "lib/#{support}" }

# spinner 
%w(
commit_list_item
labeled_check
).each { |widget| require "lib/#{widget}"}

APP_WIDTH     = 900
COMMITS_WIDTH = 280

###

Shoes.app :title => "nitgit - git browser supreme", :width => APP_WIDTH do
  extend Settings, Colors, RepoManager, Pagination, Layout
  
  def nav
    stack :height => 36 do
      background black

      @menu = flow :margin => [7,7,7,0] do
        para "nitgit", :font => "Century Gothic", :size => 16, :stroke => white, :margin => 0

        button "open repo", :margin => 0, :displace_top => -4 do
          open_repo ask_open_folder
        end

        @name = para "", :font => "Century Gothic", :stroke => blue, :margin => [0,4,6,0]

        @select_branches = list_box :margin => [0,3,0,0], :displace_top => -4 do |b|
          @selected_branch = b.text
          run_action :commits
        end
        
        @view_branches = button "branches" do
          run_action :branches
        end

        @hide_merges = labeled_check("hide merges",
          :width => 100, :stroke => white, :size => base_font_size,
          :checked => repo_settings[:hide_merges]) do
            repo_settings[:hide_merges] = @hide_merges.checked?
            save_settings!
            load_repo @page
        end

        @pagination = flow :width => 200, :right => 5, :margin => 0, &method(:pagination_browse)

        # @spinner = spinner
      end
    end
  end
  
  def branches
    unless @repo
      open_repo ask_open_folder
      load_repo
    end
    
    dates = []
    sorted_branches = @repo.branches.sort_by do |b|
      c = @repo.commits(b.name).last
      dates << c.committed_date
      dates[-1]
    end
    
    dates.reverse!
    sorted_branches.reverse!
    
    t = table :headers => [
      ["branch", 200],
      ["last updated", 100]
    ]
    sorted_branches.each_with_index do |b,i|
      t.rows << [b.name, dates[i].strftime("%m/%d/%y")]
    end
    t.render!
  end
  
  def commits
    @commits = stack :width => COMMITS_WIDTH
    @diffs   = stack :width => -COMMITS_WIDTH-gutter

    open_repo ask_open_folder
    load_repo
  end
  
  ###
  
  def run_action(action)
    @frame.clear { send action }
  end
  
  ### LAYOUT
  
  nav
  background blue
  @frame = stack
  
  ### INIT
  
  run_action :commits
end
