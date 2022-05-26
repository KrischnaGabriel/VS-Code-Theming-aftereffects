const fs = require('fs')


Math.lerp = function(a,b,i) {
    return a*(1-i) + b*i
}
Math.bezier3 = function(a, b, c, i){
    return Math.lerp( Math.lerp(a,b, i), Math.lerp(b,c, i), i );
}
Math.bezier4 = function(a, b, c, d, i){
    return Math.lerp( Math.bezier3(a,b,c, i), Math.bezier3(b,c,d, i), i );
}


function callback(input) {

	/* passtrough
	let out = input
	*/

	//let out = input * 1.1

	//let offset = 128
	//let out = ((input-offset)* 2 )+offset

	/*
	*/
	let i = input /255
	let ee = Math.bezier4(0, 0, 1, 1, i)
	let out = ee*255


	return out
}
change('dark_plus_in.json','dark_plus_out.json',callback)
change('dark_vs_in.json','dark_vs_out.json',callback)


function change(fin, fout, callback) {

	//fs.rm('dark_plus_out.json',()=>{})

	function limit(out) {
		if (out>255) {
			return 255
		}else if (out<0) {
			return 0
		}else return out
	}

	function toString(number) {
		return Math.round(number).toString(16).toUpperCase()
	}

	function zeropadding(string) {
		if (string.length == 1) {
			return "0"+string
		}else{
			return string
		}
	}

	let body = fs.readFileSync(fin, 'utf8')

	body = body.replaceAll(/#[0-9a-zA-Z]{6}/g, function gg(string) {
			let a = Number("0x"+string.substring(1,3));
			let b = Number("0x"+string.substring(3,5));
			let c = Number("0x"+string.substring(5,7));
			a = callback(a);
			b = callback(b);
			c = callback(c);
			a = limit(a);
			b = limit(b);
			c = limit(c);
			a = toString(a);
			b = toString(b);
			c = toString(c);
			a = zeropadding(a);
			b = zeropadding(b);
			c = zeropadding(c);
			return `#${a}${b}${c}`
		})

	fs.writeFileSync(fout, body)
}