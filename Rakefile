require "rubygems"
require "echoe"

class Echoe
  def honor_gitignore!
    self.ignore_pattern += \
      Dir["**/.gitignore"].inject([]) do |pattern,gitignore| 
        pattern.concat \
          File.readlines(gitignore).
            map    { |line| line.strip }.
            reject { |line| "" == line }.
            map    { |glob| 
              d = File.dirname(gitignore)
              d == "." ? glob : File.join(d, glob)
            }
      end.flatten.uniq
  end
end

Echoe.new "walter" do |p|
  p.author = "Seth Thomas Rasmussen"
  p.email  = "sethrasmussen@gmail.com"
  p.url    = "http://github.com/greatseth/walter"
  
  p.description = p.summary = "A cross-platform, graphical interface to Git repositories."
  
  p.runtime_dependencies = ["vegas", "sinatra", "grit", "haml", "open4"]
  
  p.ignore_pattern = %w( test/**/* )
  p.retain_gemspec = true
  
  p.use_sudo = false
  p.honor_gitignore!
end

desc "Tail the Vegas log file"
task :log do
  ENV["START"] = "false"
  load File.dirname(__FILE__) + "/bin/nit"
  system "tail -f #{NITGIT_VEGAS_RUNNER.log_file}"
end

desc "Restart ./bin/walt"
task :restart do
  system "./bin/walt -k"
  system "./bin/walt"
end