task :log do
  ENV["START"] = "false"
  load File.dirname(__FILE__) + "/bin/nit"
  system "tail -f #{NITGIT_VEGAS_RUNNER.log_file}"
end
