# Walter

Walter is a web app you run locally. It's a "git browser" of sorts. Think GitNub or GitX but with more awesome included. Eventually.. ;)

It's early, yet, so I'm not going to fret examples and promises too much.. so, stay tuned!

## Basic Usage

[Get the code.](http://github.com/greatseth/walter)

  $ cd /wheres/walter
  $ rake install
  $ cd /some/project
  $ walt
  
If your estranged, only son was taken from you by a creepy, bearded man, use the `waaaaaaaaalt` alias command.

Once started, you should see a new browser window open with `/some/project` loaded, listing the first page of commits from the current head.

From there you can page through past commits, switch to other local branches, and of course view the diff for any given commit.

## Future Usage

Some things I intend to add:

  * `git whatchanged` support
  * `git log -S` support
  * UI Themes aka CSS FTW

I have more ideas, but I'm not sure I feel comfortable committing them to paper right now. I'd love to hear yours!

## Requirements

You need some [Ruby](http://ruby-lang.org). I recommend Ruby 1.9.1, but try whatever you got, and let me know..

You will definitely need [Pygments](http://pygments.org) for syntax highlighting in diffs. I suppose we could make that optional, though, eh? On that note..

## Contributors

- Seth Thomas Rasmussen [http://greatseth.com](http://greatseth.com)

If you would like to contribute, please [fork the project](http://github.com/greatseth/walter), make your changes in a topic branch, and send me a pull request!