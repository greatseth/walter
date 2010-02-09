require "rack/reloader"
require "sinatra"

module Sinatra
  class Reloader < Rack::Reloader
    def safe_load(file, mtime, stderr = $stderr)
      Sinatra::Application.reset! if file == Sinatra::Application.app_file
      super
    end
  end
end

require "grit"
Grit.debug = true
require "haml"

WALTER_LIB_DIR = File.expand_path(File.join(File.dirname(__FILE__))) unless defined? WALTER_LIB_DIR
$: << WALTER_LIB_DIR unless $:.include? WALTER_LIB_DIR

require "albino"
require "walter/string_extensions"
require "walter/grit_extensions"

class Walter < Sinatra::Base
  ### CONFIG, SETUP, ETC
  
  def logger; Vegas::Runner.logger; end
  
  configure :development do
    use Sinatra::Reloader
  end
  
  set :environment => :development,
      :root        => File.join(WALTER_LIB_DIR, ".."),
      :server      => "thin"
  
  enable :static, :logging, :dump_errors
  enable :show_exceptions if development?
  
  ### ROUTES
  
  get "/" do
    setup_project
    redirect "/#{@project}/heads/#{repo.head.name.gsub("/", "--")}"
  end
  
  get "/:repo/heads/:head/?" do
    setup_page # need for layout, for JS
    setup_project
    @branches = repo.branches.map { |b| b.name }
    @selected_branch = params[:head].gsub("--", "/")
    haml :index
  end
  
  get "/:repo/heads/:head/commits/?" do
    setup_page
    @selected_branch = params[:head].gsub("--", "/")
    @commits = commits @selected_branch
    haml :commits, :layout => false
  end
  
  get "/:repo/diffs/:sha/?" do
    @sha    = params[:sha]
    @commit = repo.commit(@sha)
    etag @sha
    haml :diffs, :layout => false
  end
  
  ### HELPERS
  
  def repo
    @repo ||= begin
      logger.info "attempting to load repo at #{self.class.pwd.inspect}"
      Grit::Repo.new(self.class.pwd)
    end
  end
  
  def commits(head = repo.head.name)
    setup_page unless @page
    
    commits = if params[:whatchanged]
      repo.whatchanged(params[:whatchanged])
    else
      repo.commits(head, commits_per_page, ((@page - 1) * commits_per_page))
    end
    
    commits.reject! { |c| c.merge? } if @hide_merges
    commits
  end
  
  def commits_per_page
    20
  end
  
  def setup_page
    @page = params[:page] ? params[:page].to_i : 1
  end
  
  def setup_project
    @project = File.basename(self.class.pwd)
  end
end
