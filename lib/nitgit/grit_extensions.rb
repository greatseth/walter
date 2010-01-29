require "digest/md5"

module Grit
  class Commit
    def merge?
      parents.size > 1
    end
    
    def message_html
      message.
        sub(/(Conflicts:\s*.+)/m, '<span class="conflicts">\1</span>').
        sub("\n\n", "<br /><br />").
        gsub("\n-", "<br />-")
    end
  end
  
  class Actor
    def gravatar_url(size)
      "http://www.gravatar.com/avatar/#{Digest::MD5.hexdigest email.downcase}?s=#{size}"
    end
  end
end
