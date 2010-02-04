require "rack/reloader"
require "sinatra"

module Sinatra
  # class Rack::Reloader
  #   def safe_stat(file)
  #     $stderr.puts "trying safe stat for #{file.inspect}"
  #     return unless file
  #     stat = ::File.stat(file)
  #     return file, stat if stat.file?
  #   rescue Object, Errno::ENOENT, Errno::ENOTDIR => e
  #     $stderr.puts "safe stat failed for #{e.inspect}"
  #     @cache.delete(file) and false
  #   end
  # end
  
  class Reloader < Rack::Reloader
    def safe_load(file, mtime, stderr = $stderr)
      ::Sinatra::Application.reset! if file == Sinatra::Application.app_file
      super
    end
  end
end

# TODO these will obviously be deps when we're a bona fide gem
require "grit"
require "haml"

NITGIT_LIB_DIR = File.expand_path(File.join(File.dirname(__FILE__)))
$: << NITGIT_LIB_DIR

require "albino"
require "nitgit/string_extensions"
require "nitgit/grit_extensions"

class NitGit < Sinatra::Base
  def logger; Vegas::Runner.logger; end
  
  configure :development do
    use Sinatra::Reloader
  end
  
  set :environment => :development,
      :root        => File.join(NITGIT_LIB_DIR, ".."),
      :server      => "thin"
  
  enable :static, :logging, :dump_errors
  enable :show_exceptions if development?
  
  def repo
    logger.info "attempting to load repo at #{self.class.pwd.inspect}"
    @repo ||= Grit::Repo.new(self.class.pwd)
  end
  
  def commits_for_page(page = @page)
    page = setup_page unless page
    commits = repo.commits(@selected_branch, commits_per_page, ((page - 1) * commits_per_page))
    commits.reject! { |c| c.merge? } if @hide_merges
    commits
  end
  
  def commits_per_page
    20
  end
  
  get "/" do
    @selected_branch = repo.head.name
    redirect "/#{@selected_branch}"
  end
  
  get "/:head/?" do |head|
    @project_name    = File.basename(self.class.pwd)
    @selected_branch = head.gsub(/--/, "/")
    @branches        = repo.branches.map { |b| b.name }
    @commits         = commits_for_page
    haml :index
  end
  
  get "/diffs/:sha" do |sha|
    @sha      = sha
    @commit   = repo.commit(@sha)
    @branches = repo.branches.map { |b| b.name }
    haml :diffs, :layout => false
  end
  
  def setup_page
    @page = params[:page] ? params[:page].to_i : 1
  end
end
