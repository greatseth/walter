# Walter

Walter is a web app you run locally. It's a "git browser" of sorts. Think GitNub or GitX but with more awesome! ;)

## Basic Usage

[Get the code.](http://github.com/greatseth/walter)

    $ cd /wheres/walter
    $ rake install
    $ cd /some/project
    $ walt

If you would prefer not to install the Ruby gem, you can run `./bin/walt` from within the Walter source code to run Walter against itself.

If your estranged, only son was taken from you by a creepy, bearded man, use the `waaaaaaaaalt` alias command.

Once started, you should see a new browser window open with `/some/project` loaded, listing the first page of commits from the current head.

From there you can page through past commits, switch to other local branches, and of course view the diff for any given commit.

### Hotkeys

Walter supports some hotkey shortcuts for certain actions. Some actions are currently accessible via hotkey *only*, e.g. whatchanged search(press "w" for that, by the way).

Press "/" to see a list of available hotkeys.

## Requirements

You need some [Ruby](http://ruby-lang.org). I recommend Ruby 1.9.1, but try whatever you got, and let me know..

You will definitely need [Pygments](http://pygments.org) for syntax highlighting in diffs. I suppose we could make that optional, though, eh? On that note..

## Contributors

- Seth Thomas Rasmussen [http://greatseth.com](http://greatseth.com)

If you would like to contribute, please [fork the project](http://github.com/greatseth/walter), make your changes in a topic branch, and send me a pull request! If you don't use GitHub, you can email me or whatever, too.
