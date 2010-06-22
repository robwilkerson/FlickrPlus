#!/usr/bin/ruby 

require 'logger'
require 'FileUtils'

build_dir = '../builds/' + File.basename( FileUtils.pwd ).gsub( /Dev\.safariextension/, '.safariextension' )

puts 'Generating a build in ' + build_dir
puts '  -> Removing existing directory (' + build_dir + ')'

FileUtils.rm_r build_dir if File.exists? build_dir

puts '  -> Recreating the directory (' + build_dir + ')'

FileUtils.mkdir_p build_dir

puts '  -> Archiving the latest copy of the master branch'

system 'git archive master | tar x -C ' + build_dir

puts 'Switching to the build directory (' + build_dir + ')'

Dir.chdir build_dir

puts '  -> Deleting files not required for execution of the extension'

FileUtils.rm Dir.glob( 'README.*' )
FileUtils.rm Dir.glob( '*-update.plist' )
FileUtils.rm_r 'css'
FileUtils.rm_r 'img'
FileUtils.rm %w( build.rb js/jquery.colorbox-min.js zoom.js )

puts 'Done.'
puts ''
puts 'Don\'t forget to: '
puts '  1. Open the build directory in extension builder and compile the extension.'
puts '  2. SCP the compiled extension and the updater as shown below.'

puts ''

puts 'scp FlickrPlus.safariextz FlickrPlus-update.plist robwilkerson:www/_resources/projects/safari/extensions'
