require "digest/md5"

module Grit
  class Commit
    # Parse out commit information into an array of baked Commit objects
    #   +repo+ is the Repo
    #   +text+ is the text output from the git command (raw format)
    #
    # Returns Grit::Commit[] (baked)
    #
    # really should re-write this to be more accepting of non-standard commit messages
    # - it broke when 'encoding' was introduced - not sure what else might show up
    #
    # THIS IS COPIED AND PASTED FROM grit-2.0.0 WITH CHANGES NOTED WITH 'CHANGED'
    # There wasn't a more surgical hook available.
    def self.list_from_string(repo, text)
      lines = text.split("\n")

      commits = []

      while !lines.empty?
        id = lines.shift.split.last
        tree = lines.shift.split.last

        parents = []
        parents << lines.shift.split.last while lines.first =~ /^parent/

        author, authored_date = self.actor(lines.shift)
        committer, committed_date = self.actor(lines.shift)

        # not doing anything with this yet, but it's sometimes there
        encoding = lines.shift.split.last if lines.first =~ /^encoding/

        lines.shift

        message_lines = []
        message_lines << lines.shift[4..-1] while lines.first =~ /^ {4}/

        # CHANGED
        # lines.shift while lines.first && lines.first.empty?
        lines.shift while lines.first && (lines.first.empty? || lines.first =~ /^:/)

        commits << Commit.new(repo, id, parents, tree, author, authored_date, committer, committed_date, message_lines)
      end

      commits
    end
  end
  
  class Repo
    def whatchanged(glob)
      Commit.list_from_string(self, git.whatchanged({ :pretty => "raw" }, glob))
    end
  end
  
  class Commit
    def merge?
      parents.size > 1
    end
    
    def message_html
      message.
        sub(/(Conflicts:\s*.+)/m, '<span class="conflicts">\1</span>').
        sub("\n\n", "<br />#{'<br />' unless merge?}").
        gsub("\n-", "<br />-")
    end
  end
  
  class Actor
    def gravatar_url(size)
      "http://www.gravatar.com/avatar/#{Digest::MD5.hexdigest email.downcase}?s=#{size}"
    end
  end
end
