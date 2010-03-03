require "rack/reloader"
require "sinatra"

module Sinatra
  class Reloader < Rack::Reloader
    def safe_load(file, mtime, stderr = $stderr)
      Sinatra::Application.reset! if file == Sinatra::Application.app_file
      begin
        super
      # This seems to be an issue on 1.8.7. I don't recommend using 1.8.7 
      # at any rate, but perhaps this helps..
      rescue Errno::ETIMEDOUT, Errno::EIO => e
        Vegas.logger.warn "ignoring #{e}, raised trying to stat #{file}"
      end
    end
  end
end
