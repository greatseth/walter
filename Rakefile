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

Echoe.new "nitgit" do |p|
  p.description = "A graphical interface to a Git repository, implemented using web technologies."
  p.author = "Seth Thomas Rasmussen"
  p.email = "sethrasmussen@gmail.com"
  p.url = "http://github.com/greatseth/nitgit"
  p.ignore_pattern = %w( test/**/* )
  p.retain_gemspec = true
  p.honor_gitignore!
end

task :log do
  ENV["START"] = "false"
  load File.dirname(__FILE__) + "/bin/nit"
  system "tail -f #{NITGIT_VEGAS_RUNNER.log_file}"
end
