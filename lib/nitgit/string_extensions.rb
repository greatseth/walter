class String
  def utf8
    require "iconv"
    Iconv.conv("UTF-8", "LATIN1", self)
  end
  
  def diff_change_line?
    match /^(\-|\+){1,2}/
  end
  
  def diff_add_line?
    if m = diff_change_line?
      m[1] == "+"
    end
  end
  
  def diff_remove_line?
    if m = diff_change_line?
      m[1] == "-"
    end
  end
  
  def diff_overview_line?
    self =~ /^(\-|\+){3}/
  end
end
