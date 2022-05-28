module.exports = {
    // my personal preference
    
    settings_file: "/home/user/.var/app/com.vscodium.codium/config/VSCodium/User/settings.json",
    array_of_input_themes: [
        "/var/lib/flatpak/app/com.vscodium.codium/current/active/files/share/codium/resources/app/extensions/theme-defaults/themes/dark_vs.json",
        "/var/lib/flatpak/app/com.vscodium.codium/current/active/files/share/codium/resources/app/extensions/theme-defaults/themes/dark_plus.json",
    ],
    theme_name: "Default Dark+",
    exclusion_rules_keys: [
        "editorIndentGuide.background",//: "#404040", 
        "editorIndentGuide.activeBackground",//: "#707070",
        // these gray lines showing the scope of a block of code
    ],
    normalise: true,
    callback: function(input) {
        //return input // passtrough

        let [r,g,b,a] = input

        r = transform(r)
        g = transform(g)
        b = transform(b)

        function transform(x) {
            /*
            return Math.amplify(x, 1.5, 0.3);
            */
        
            /*
            */
            return Math.bezier4(0, 0, 1, 1, x)
        }
    
        return [r,g,b,a]
    },
}