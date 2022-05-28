# VS-Code-Theming-aftereffects
Changes contrast, saturation or hue of the vs code default themes if you'd like to.

# Usage

Create a js file that exports an object with all the options specified.
Open the applyTheme.js file to see the which options need to be specified and what they mean.
In your created file you specify things like which theme you want to mod, the color changing algorithm and where your settings.json file is.
To visualize the equasions used by the color changing algorithm you can use tools like geogebra to visualise the value mapping.
Example: a cubic_bezier(0,0,1,1) will amplify greyish pale colors dynamically.

To apply the theme run `node applyTheme.js <filename.js>`


# How it works

It reads in json theme files, finds all the color codes in them, does some arithemic that you specify to change the color and then instead of overwriting the original theme (which is bad, and only works partially. the theme gets reset after a restart weirdly),
the program will translate the options with the modified values into the by vs-code accepted colorCustomizations objects, which you (or the program automatically) can be put into your vscode settings.json file.

