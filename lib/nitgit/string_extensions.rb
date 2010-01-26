class String
  def utf8
    require "iconv"
    Iconv.conv("UTF-8", "LATIN1", self)
  end
  
  LEADING_LINE_JUNK = /\s*(?:<span.*?>)?\s*/
  
  def diff_change_line?
    match /^#{LEADING_LINE_JUNK}(\-|\+){1,2}/
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
    self =~ /^#{LEADING_LINE_JUNK}(\-|\+){3}/
  end
  
  def diff_special_line?
    [:diff_overview_line?, :diff_add_line?, :diff_remove_line?].any? { |x| send(x) }
  end
  
  # TODO this is exclusively a view helper.. diff special line sort of is too
  def diff_container_class
    if    diff_overview_line? then "overview"
    elsif diff_remove_line?   then "remove"
    elsif diff_add_line?      then "add"
    end
  end
  
  def highlight(lexer)
    require "albino"
    Albino.new(self, lexer)
  end
end
