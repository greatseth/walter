require "rubygems"

gem     "grit"
require "grit"

gem     "sinatra"
require "sinatra"

# $LOAD_PATH.unshift File.join(File.dirname(__FILE__))
# require 'nitgit/grit_extensions'

class NitGit < Sinatra::Base
  enable :logging
  set :server, "mongrel"
  
  get "/" do
    "hi"
  end
end
