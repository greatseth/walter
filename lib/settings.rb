module Settings
  SETTINGS_PATH = File.expand_path("~/.nitgit")

  DEFAULT_SETTINGS = {
    :repos => {}
  }
  
  DEFAULT_REPO_SETTINGS = {
    :hide_merges => false
  }
  
  def settings
    save_settings! DEFAULT_SETTINGS if not File.exist? SETTINGS_PATH
    reload_settings! unless @settings
    @settings
  end
  
  def repo_settings
    # prevent errors before a repo is loaded
    return {} unless @name
    
    if not settings[:repos][@name.text]
      settings[:repos][@name.text] = DEFAULT_REPO_SETTINGS
      save_settings!
    end
    
    settings[:repos][@name.text]
  end
  
  def save_settings!(settings = self.settings)
    File.open(SETTINGS_PATH, "w") { |f| f.puts settings.to_yaml }
    reload_settings!
  end
  
  def reload_settings!
    @settings = YAML.load_file SETTINGS_PATH
  end
end
