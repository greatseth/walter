require "rubygems"

gem     "grit"
require "grit"

gem     "sinatra"
require "sinatra"

# $LOAD_PATH.unshift File.join(File.dirname(__FILE__))
# require 'nitgit/grit_extensions'

class NitGit < Sinatra::Base
  set :root, File.expand_path(File.join(File.dirname(__FILE__), ".."))
  
  enable :static
  
  enable :logging
  def logger; Vegas::Runner.logger; end
  
  set :server, "mongrel"
  
  def repo
    logger.info "attempting to load repo at #{self.class.pwd.inspect}"
    @repo ||= Grit::Repo.new(self.class.pwd)
  end
  
  get "/" do
    @heads = repo.heads.map { |x| x.name }.join("\n")
    haml :index
  end
end
