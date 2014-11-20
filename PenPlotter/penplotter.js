
var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;
var left = 0;
var right = 2;
var first = true;

var t1, t2;

var cIndex = 0;

var colors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0), // cyan
    vec4(1.0, 0.0, 0.0, 0.5), // pink
    vec4(0.0, 0.0, 1.0, 0.5), // light blue
    vec4(1.0, 1.0, 1.0, 1.0)  // white
];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW);
    
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
	
    var m = document.getElementById("mymenu");
    
	m.addEventListener("click", function() {
       cIndex = m.selectedIndex;
    });
	
	window.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
			case 48:
				cIndex = 9;
				break;
			case 49:
				cIndex = 0;
				break;
			case 50:
				cIndex = 1;
				break;
			case 51:
				cIndex = 2;
				break;
			case 52:
				cIndex = 3;
				break;
			case 53:
				cIndex = 4;
				break;
			case 54:
				cIndex = 5;
				break;
			case 55:
				cIndex = 6;
				break;
			case 56:
				cIndex = 7;
				break;
			case 57:
				cIndex = 8;
				break;
      default:
        break;
		}
	});
    
    canvas.addEventListener("mousedown", function(event) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        if (event.button === left) {
            first = false;
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            t1 = vec2(2*event.clientX/canvas.width-1, 2*(canvas.height-event.clientY)/canvas.height-1);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index), flatten(t1));
            
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            t = vec4(colors[cIndex]);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index), flatten(t));
        } else if (event.button === right && !first) {
            first = true;
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            t2 = vec2(2*event.clientX/canvas.width-1, 2*(canvas.height-event.clientY)/canvas.height-1);
			
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index), flatten(t1));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t2));
            
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            t = vec4(colors[cIndex]);
            
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(t));
            index += 2;
		    }
    });
	
    render();
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);
	
    for(var i = 0; i < index; i += 2) 
        gl.drawArrays(gl.LINES, i, 2);
        
    if (!first)
        gl.drawArrays(gl.POINTS, 8*(index), 1);
        
    window.requestAnimFrame(render, canvas);
    
}

// Disables the context menu on right click
document.oncontextmenu = function() {
	return false;
}