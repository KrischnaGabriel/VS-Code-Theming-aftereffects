
const placeholder_props = {


    settings_file: undefined, /*
        The location of your settings.json file.
        If undefined, it will print the lines you need to add to your settings.json file. That might be a lot of lines.
    */
    settings_file_in: undefined,
    settings_file_out: undefined,
    // in case you don't want your settings.json be modified.
    // unly really used for debugging
    // this should NOT be used
    
    array_of_input_themes: [], /*
        The path to the themes json file.
        It can be multiple as some themes depend on other themes.
        Example: the Dark+ theme depends on the Dark VS theme
    */

    theme_name: undefined, /*
        The internal name of a theme. 
        Example: the internal name of the Dark+ theme is "Default Dark+".
        I cannot extract that information from the file as it weirdly is not specified there.
        You can see that name inn the Settings theme select in brackets "[]" after the name of the theme 
    */
    // you will always have to specify these, only making color adjustments on a per-theme basis. there's not way to do it without forking and modding vs code or using a proxy window wrapper with a gpu shader of some sort

   
    exclusion_rules_keys: [], // in case certain properties should not be changed. 
    exclusion_rules_values: [], // in case certain properties should not be changed. 
    /* 
    If a property is in an object and that object has a value that should be excluded, don't worry. If while going trough the tree a key/value matches, parsing of all upcomming properties of that object will be canceled.
    Example:

		{
			"name": "Constants and enums",
			"scope": [
				"variable.other.constant",
				"variable.other.enummember"
			],
			"settings": {
				"foreground": "#4FC1FF",
			}
		},
		{
			"name": "Object keys, TS grammar specific",
			"scope": [
				"meta.object-literal.key"
			],
			"settings": {
				"foreground": "#9CDCFE"
			}
		},

    To exclude the color change of "Constants and enums", specify it as a value.
    Parsing of the upcomming "foregound" child property will be cancelled
    */


    manual_rules: {
        "workbench.colorCustomizations": {
        },
        "editor.tokenColorCustomizations": {
        },
        "editor.semanticTokenColorCustomizations": {
        },
    },

    /*dummy tip: 
    if you want to change/exclude a ui component of which you don't know the name, zoom in in vscode, screenshot it, in gimp select the color of the component with the color picker (careful with antialiased fonts!) and then search in the theme file for that color hex value (mind to disable capitalisation when searching). Some ui components have a color with an opacity value, on which this trick does not work
    */

    normalise: false,
    // by default the color value is a number between 0 and 255.
    // Normalised means it goes from 0 to 1

    callback: function(color) {
        let [r,g,b,a] = input

        return [r,g,b,a]
    }/*
        This is the function that will do the color transformation.
        This function declared here is obviously a dummy. 
	Also, you don't have to worry that your returned color value may not be in range. It will be clipped if it is not.
        Have fun! 
    */
}

// Here some helper functions:
Math.lerp = function(a,b,i) {
    return a*(1-i) + b*i
}
Math.bezier3 = function(a, b, c, i){
    return Math.lerp( Math.lerp(a,b, i), Math.lerp(b,c, i), i );
}
Math.bezier4 = function(a, b, c, d, i){
    return Math.lerp( Math.bezier3(a,b,c, i), Math.bezier3(b,c,d, i), i );
}
Math.amplify = function(value, amount, offset){
    if (typeof amount == 'function') {
        return amout(value-offset)+offset
    }else{// if typeof == number
        return (value-offset)*amount+offset
    }
}








const args = process.argv.slice(2)
const user_props = require(args[0].match(/\/|\\/g) ? args[0] : "./"+args[0])


const fs = require('fs')

function parseFile(path) {

    let body = fs.readFileSync(path, 'utf8')
    let bodyObj = Parse(body, "Could not parse the file: "+path)
    return bodyObj

    function Parse(string, errorMessage) { // advanced JSON.parse
        let obj;
        try{
            obj = JSON.parse(string)
        }catch(e_json) {
            try{
                obj = eval(`(${string})`)
            }catch(e_eval) {
                console.log(errorMessage)
                console.log("JSON.parse: ",e_json)
                console.log("eval(): ",e_eval)
                process.exit(1);
            }
        }
        return obj
    }
}


function doTheThing(props) {

    // theme template object
    let themeObj = {
        colors: {},
        tokenColors: [],
        //semanticTokenColors: {},
    }

    
    // fill template with the merged themes and apply coloring
    for (const path of props.array_of_input_themes) {
        
        let bodyObj = parseFile(path);

        if (bodyObj.include 
            && !props.array_of_input_themes.reduce((bool,path)=>{
                return bool || path.split(/\/|\\/g).at(-1) == bodyObj.include.split(/\/|\\/g).at(-1)
            },false)
        ) {
            console.log("!! the theme specified has a dependency to \""+bodyObj.include.split(/\/|\\/g).at(-1)+"\" which you did not specified !!")
        }

        {// change colors
        
            function walk(obj) {
                for (const [key,value] of Object.entries(obj)) {
                    if (props.exclusion_rules_keys.includes(key)
                        || props.exclusion_rules_values.includes(value)
                    ) break;
                    if (typeof value == "object") {
                        walk(value)
                    }
                    if (typeof value == "string" 
                        && value.match(/#[0-9a-fA-F]{3,8}/g)
                    ) {
                        let string = value.substring(1)

                        let color = [0,0,0,"ff"]
                        let h = string.length>=6 ? 1:0
                        for (let i=0; i<string.length; i+=1+h) {
                            color[i/(1+h)] = string[i] + string[i+h]
                        }
                        color = color.map(str=>Number("0x"+str))

                        function callback(value) {
                            if (props.normalise) {
                                value = value.map(x=>x/255)
                                value = props.callback(value)
                                return value.map(x=>x*255)
                            }else{
                                return props.callback(value)
                            }
                        }

                        function parse(a) {

                            function limit(out) {
                                if (out>255) {
                                    return 255
                                }else if (out<0) {
                                    return 0
                                }else return out
                            }
                            function toString(number) {
                                return number.toString(16).toUpperCase()
                            }
                            function zeropadding(string) {
                                if (string.length == 1) {
                                    return "0"+string
                                }else{
                                    return string+""
                                }
                            }
            
                            a = Math.round(a)
                            a = limit(a);
                            a = toString(a);
                            a = zeropadding(a);
                            return a
                        }

                        obj[key] = callback(color).reduce((last,val)=>last+parse(val),"#")
                    }
                }
            }
            
            walk(bodyObj)
        }


        Object.assign(themeObj.colors, bodyObj.colors)

        //themeObj.tokenColors.concat( bodyObj.tokenColors )// wtf this shit does not work
        themeObj.tokenColors = [...themeObj.tokenColors, ...bodyObj.tokenColors]

        // semanticTokenColors is not implementable
        // see https://code.visualstudio.com/docs/getstarted/themes#_customizing-a-color-theme
    }
    

    



    let theme_name = `[${props.theme_name}]`
    let packedThemeData = {
        "workbench.colorCustomizations": {
            [theme_name]: Object.assign(themeObj.colors, 
                props.manual_rules.colors 
                || props.manual_rules["workbench.colorCustomizations"]
            ),
        },
        "editor.tokenColorCustomizations": {
            [theme_name]: Object.assign(
                props.manual_rules["editor.tokenColorCustomizations"],
                {
                    "textMateRules": Object.assign(
                        themeObj.tokenColors, 
                        props.manual_rules.tokenColors
                    ),
                }
            ),
        },
        "editor.semanticTokenColorCustomizations": {
            [theme_name]: props.manual_rules.semanticTokenColors    
            || props.manual_rules["editor.semanticTokenColorCustomizations"]
        },
    }


    if (props.settings_file_in || props.settings_file) {

        let targetObj = parseFile(props.settings_file_in || props.settings_file)   
            
        for (const [key,value] of Object.entries(packedThemeData)) {
            if (!targetObj[key]) targetObj[key] = {}
            Object.assign(targetObj[key], value)
        }

	    fs.writeFileSync(props.settings_file_out || props.settings_file, JSON.stringify(targetObj, null, 4))

    }else{
        console.log(JSON.stringify(packedThemeData))
    }
    
}


doTheThing({...placeholder_props, ...user_props})
