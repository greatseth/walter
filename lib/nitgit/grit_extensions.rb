require "digest/md5"

module Grit
  class Commit
    def merge?
      parents.size > 1
    end
  end
  
  class Diff
    # There is already @repo, but for some stupid reason it's not accessible..
    attr_reader :repo
  end
  
  class Actor
    def gravatar_url(size)
      "http://www.gravatar.com/avatar/#{Digest::MD5.hexdigest email.downcase}?s=#{size}"
    end
  end
end
