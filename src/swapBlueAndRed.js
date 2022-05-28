module.exports = {
    // just as a demonstartion
    
    settings_file: "/home/user/.var/app/com.vscodium.codium/config/VSCodium/User/settings.json",
    array_of_input_themes: [
        "/var/lib/flatpak/app/com.vscodium.codium/current/active/files/share/codium/resources/app/extensions/theme-defaults/themes/dark_vs.json",
        "/var/lib/flatpak/app/com.vscodium.codium/current/active/files/share/codium/resources/app/extensions/theme-defaults/themes/dark_plus.json",
    ],
    theme_name: "Default Dark+",
    
    normalise: false,
    callback: function(input) {

        let [r,g,b,a] = input
    
        return [b,g,r,a]
    },
}