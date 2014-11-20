
var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    
	var vertices = [
        vec2( -0.75, -0.4 ),
        vec2(  0, 0.8 ),
        vec2( 0.75, -0.4 )
    ];

    divideSegment( vertices[0], vertices[1], NumTimesToSubdivide );
    divideSegment( vertices[2], vertices[0], NumTimesToSubdivide );
    divideSegment( vertices[1], vertices[2], NumTimesToSubdivide );

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

/* TODO Write a function named segment (analogous to the gasket program's
   triangle function) that will add two points to the points array */
function segment( a, b )
{
    points.push( a, b );
}

/* TODO Write a recursive function named divideSegment (analogous to the
   gasket program's divideTriangle function) that does the following:
    * when terminal condition is reached, draw a segment
    * otherwise, compute three intermediate points as follows
       - v0 is one-third of the way along the vector from a to b
       - v1 can be obtained by using vector (x0, y0) to compute the 
		 desired perpendicular vector as (-y0, x0), multiplying it by 
		 sqrt(3)/2, and then adding it to the midpoint between a and b
       - v2 is two-thirds of the way along the vector from a to b
    * note! you'll have to draw four segments in the non-terminal case
*/
function divideSegment( a, b, count )
{

    if ( count === 0 ) {
        segment( a, b );
    }
    else {

		// Two-thirds of the way from a to b, and from b to a
		var t0 = divide( add( multiply ( a, 2 ), b ), 3);
		var t1 = divide( add( multiply ( b, 2 ), a ), 3);
		
		// Midpoint
		var t2 = divide( add( a, b ), 2);
        
		// Perpendicular vector
		var v1 = divide( subtract( t2, a ), length( t2, a ) );
		var v2 = [-v1[1], v1[0]];
		var t3 = add( multiply( v2, Math.sqrt(3)/6 * length( b, a ) ), t2 );
		
        --count;
    
        divideSegment( a, t0, count );
        divideSegment( t0, t3, count );
		divideSegment( t3, t1, count );
		divideSegment( t1, b, count );
    
    }

}

function multiply(v, num) {
	return [v[0]*num, v[1]*num];
}

function divide(v, num){
    return [v[0]/num, v[1]/num];
}
 
function add(a, b){
    return [a[0]+b[0], a[1]+b[1]];
}

function subtract(a, b){
    return [a[0]-b[0], a[1]-b[1]];
}

function length(a, b){
    return Math.sqrt(Math.pow(a[0] - b[0],2) + Math.pow(a[1] - b[1],2));
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
}

