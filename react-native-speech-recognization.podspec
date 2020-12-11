require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-speech-recognization"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-speech-recognization
                   DESC
  s.homepage     = "https://github.com/httol/react-native-speech-recognization"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "httol" => "dingjianqun@outlook.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/httol/react-native-speech-recognization.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  # ...
  # s.dependency "..."
end

