"use strict";
if ((typeof(ajuc) === 'undefined')) {
	ajuc = {};
}
if ((typeof(ajuc.gfx) === 'undefined')) {
	ajuc.gfx = {};
}
if ((typeof(ajuc.gfx.engine) === 'undefined')) {
	ajuc.gfx.engine = {};
}

ajuc.gfx.engine.webgl = (function(utils) {

	function version() {
		return 0.01;
	};
	function name() {
		return "webgl";
	};

	var canvas;
	var gl;

	var verticesBuffer;
	var verticesTextureCoordBuffer;
	var verticesIndexBuffer;

	var levelVerticesBuffer;
	var levelTextureCoordBuffer;
	var levelIndexBuffer;

	var vertices = [];
	var textureCoords = [];
	var indices = [];
	
	var spritesVerticesBuffer;
	var spritesTextureCoordBuffer;
	var spritesIndexBuffer;
	
	var spritesVertices = [];
	var spritesTextureCoords = [];
	var spritesIndices = [];
	
	var lastCubeUpdateTime = 0;

	var spriteImages;
	var spriteTextures;
	
	var backgroundImages;
	var backgroundTextures;
	
	var tileImages;
	var tileTextures;

	var mvMatrix;
	var perspectiveMatrix;
	
	var shaderProgram;
	
	var vertexPositionAttribute;
	var textureCoordAttribute;
	var canvasObj;

	var sectorWidth = 64 * 1024;
	var sectorHeight = 64 * 1024;
	var sectors = [];
	
	
	var inited = false;
	
	function isInited() {
		return inited;
	}
	
	function initBuffers() {
		verticesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

		
		
		var vertices = [
			-1.0, -1.0,  1.0,
			 1.0, -1.0,  1.0,
			 1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		verticesTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesTextureCoordBuffer);
		  
		var textureCoordinates = [
		             			0.0,  1.0,
		            			1.0,  1.0,
		            			1.0,  0.0,
		            			0.0,  0.0
		            		];
			

		gl.bufferData(	gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
						gl.STATIC_DRAW );

		verticesIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer);
		  
		var vertexIndices = [
			0,  1,  2,      0,  2,  3
		];
		  
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(vertexIndices), gl.STATIC_DRAW);
	}
	
	function updateSpritesBuffers(objects) { // TODO
//		spritesVertices = [];
//		spritesTextureCoords = [];
//		spritesIndices = [];
//
//		var firstVertexOfLastQuadIndex = 0;
//		var tx;
//		var ty;
//		for (var i=0;i<objects.length;i++) {
//			
//			spritesVertices.push(-1.0+2*x);
//			spritesVertices.push(-1.0+2*yy);
//			spritesVertices.push(1);
//				
//			spritesVertices.push(1.0+2*x);
//			spritesVertices.push(-1.0+2*yy);
//			spritesVertices.push(1);
//				
//			spritesVertices.push( 1.0+2*x);
//			spritesVertices.push( 1.0+2*yy);
//			spritesVertices.push(1);
//				
//			spritesVertices.push(-1.0+2*x);
//			spritesVertices.push( 1.0+2*yy);
//			spritesVertices.push(1);
//				
//			tx = (1+Math.floor((tileImageNo-1)%16))/16;
//			ty = (Math.floor((tileImageNo-1)/16))/16;
//			spritesTextureCoords.push(tx+0.0/16.0);
//			spritesTextureCoords.push(ty+1.0/16.0);
//			
//			spritesTextureCoords.push(tx+1.0/16.0);
//			spritesTextureCoords.push(ty+1.0/16.0);
//			
//			spritesTextureCoords.push(tx+1.0/16.0);
//			spritesTextureCoords.push(ty+0.0/16.0);
//			
//			spritesTextureCoords.push(tx+0.0/16.0);
//			spritesTextureCoords.push(ty+0.0/16.0);
//
//			spritesIndices.push(firstVertexOfLastQuadIndex*4+0);
//			spritesIndices.push(firstVertexOfLastQuadIndex*4+1);
//			spritesIndices.push(firstVertexOfLastQuadIndex*4+2);
//			
//			spritesIndices.push(firstVertexOfLastQuadIndex*4+0);
//			spritesIndices.push(firstVertexOfLastQuadIndex*4+2);
//			spritesIndices.push(firstVertexOfLastQuadIndex*4+3);
//			
//			firstVertexOfLastQuadIndex ++;
//		}
//		
//		
//		if (levelVerticesBuffer !== undefined) {
//			gl.deleteBuffer(levelVerticesBuffer);
//		}
//		levelVerticesBuffer = gl.createBuffer();
//		gl.bindBuffer(gl.ARRAY_BUFFER, levelVerticesBuffer);
//		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//		
//		if (levelTextureCoordBuffer !== undefined) {
//			gl.deleteBuffer(levelTextureCoordBuffer);
//		}
//		levelTextureCoordBuffer = gl.createBuffer();
//		gl.bindBuffer(gl.ARRAY_BUFFER, levelTextureCoordBuffer);
//		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
//		
//		if (levelIndexBuffer !== undefined) {
//			gl.deleteBuffer(levelIndexBuffer);
//		}		
//		levelIndexBuffer = gl.createBuffer();
//		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, levelIndexBuffer);
//		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
//		
		//alert("END updateLevelBuffer()");

	}

	function updateLevelBuffer(level,z) {
		//alert("BEGIN updateLevelBuffer()");
		vertices = [];
		textureCoords = [];
		indices = [];
		var firstVertexOfLastQuadIndex = 0;
		var tx;
		var ty;
		var y;
		var x;
		for (y=0;y<level.rows;y++) {
			for (x=0;x<level.columns;x++) {
				if (level &&
					level.layers[z] &&
					level.layers[z].cells &&
					level.layers[z].cells[y*level.columns+x] !== undefined
				) {
					
					var tileImageNo = level.layers[z].cells[y*level.columns+x];
					var yy = -y;
					if (tileImageNo!==undefined) {
						tileImageNo = tileImageNo-1;
						
						
						if (tileImageNo>=0 || x==0 && y==0) {
							vertices.push(-1.0+2*x);
							vertices.push(-1.0+2*yy);
							vertices.push(1);
							
							vertices.push(1.0+2*x);
							vertices.push(-1.0+2*yy);
							vertices.push(1);
							
							vertices.push( 1.0+2*x);
							vertices.push( 1.0+2*yy);
							vertices.push(1);
							
							vertices.push(-1.0+2*x);
							vertices.push( 1.0+2*yy);
							vertices.push(1);
							
							tx = (1+Math.floor((tileImageNo-1)%16))/16;
							ty = (Math.floor((tileImageNo-1)/16))/16;
							textureCoords.push(tx+0.0/16.0);
							textureCoords.push(ty+1.0/16.0);
							
							textureCoords.push(tx+1.0/16.0);
							textureCoords.push(ty+1.0/16.0);
							
							textureCoords.push(tx+1.0/16.0);
							textureCoords.push(ty+0.0/16.0);
							
							textureCoords.push(tx+0.0/16.0);
							textureCoords.push(ty+0.0/16.0);

							indices.push(firstVertexOfLastQuadIndex*4+0);
							indices.push(firstVertexOfLastQuadIndex*4+1);
							indices.push(firstVertexOfLastQuadIndex*4+2);
							
							indices.push(firstVertexOfLastQuadIndex*4+0);
							indices.push(firstVertexOfLastQuadIndex*4+2);
							indices.push(firstVertexOfLastQuadIndex*4+3);
							
							firstVertexOfLastQuadIndex ++;
						}
						
					}
				}
			}
		}
		
		
		if (levelVerticesBuffer !== undefined) {
			gl.deleteBuffer(levelVerticesBuffer);
		}
		levelVerticesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, levelVerticesBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		
		if (levelTextureCoordBuffer !== undefined) {
			gl.deleteBuffer(levelTextureCoordBuffer);
		}
		levelTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, levelTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
		
		if (levelIndexBuffer !== undefined) {
			gl.deleteBuffer(levelIndexBuffer);
		}		
		levelIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, levelIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		
		//alert("END updateLevelBuffer()");

	}

	function updateLevel(level, z) {
		updateLevelBuffer(level, z);
	}

	//
	// initTextures
	//
	// Initialize the textures we'll be using, then initiate a load of
	// the texture images. The handleTextureLoaded() callback will finish
	// the job; it gets called each time a texture finishes loading.
	//
	function initTexture(filename, callback) {
		var texture = gl.createTexture();
		var image = new Image();
		image.onload = function() {
			handleTextureLoaded(image, texture);
			callback();
		};
		image.src = filename;
		return texture;
	}

	function handleTextureLoaded(image, texture) {
		//console.log("handleTextureLoaded, image = " + image);
		gl.bindTexture( gl.TEXTURE_2D, texture );
		gl.texImage2D(	gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
						gl.UNSIGNED_BYTE, image );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
		gl.generateMipmap( gl.TEXTURE_2D );
		gl.bindTexture( gl.TEXTURE_2D, null );
	}

	//
	// initShaders
	//
	// Initialize the shaders, so WebGL knows how to light our scene.
	//
	function initShaders() {
	  var fragmentShader = getShader(gl, "shader-fs");
	  var vertexShader = getShader(gl, "shader-vs");
	  // Create the shader program
	  
	  shaderProgram = gl.createProgram();
	  gl.attachShader(shaderProgram, vertexShader);
	  gl.attachShader(shaderProgram, fragmentShader);
	  gl.linkProgram(shaderProgram);
	  
	  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    alert("Unable to initialize the shader program.");
	  }
	  
	  gl.useProgram(shaderProgram);

	  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	  gl.enableVertexAttribArray(vertexPositionAttribute);
	  
	  textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	  gl.enableVertexAttribArray(textureCoordAttribute);

	
	}

	//
	// getShader
	//
	// Loads a shader program by scouring the current document,
	// looking for a script with the specified ID.
	//
	function getShader(gl, id) {
	  var shaderScript = document.getElementById(id);
	  if (!shaderScript) {
	    return null;
	  }
	  var theSource = "";
	  var currentChild = shaderScript.firstChild;
	  
	  while(currentChild) {
	    if (currentChild.nodeType == 3) {
	      theSource += currentChild.textContent;
	    }
	    
	    currentChild = currentChild.nextSibling;
	  }
	  var shader;
	  
	  if (shaderScript.type == "x-shader/x-fragment") {
	    shader = gl.createShader(gl.FRAGMENT_SHADER);
	  } else if (shaderScript.type == "x-shader/x-vertex") {
	    shader = gl.createShader(gl.VERTEX_SHADER);
	  } else {
	    return null;  // Unknown shader type
	  }
	  gl.shaderSource(shader, theSource);
	  gl.compileShader(shader);
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
	    return null;
	  }
	  
	  return shader;
	}

	function initTextures(callback) {
		var loadedTiles = 0;
		var maxLoadedTiles = 5;

		function hideLoadingScreenIfPossible() { // closures are so cool
			loadedTiles++;
			$("#ProgressBarInside").width(Math.round(95*loadedTiles/maxLoadedTiles)+"%");
			$("#ProgressBarInside").text(Math.round(100*loadedTiles/maxLoadedTiles)+" %");
			if (loadedTiles>=maxLoadedTiles) {
				
				callback();
				
				inited = true;
			};
		};
		
		spriteTextures = new Array(3);
		spriteTextures[0] = initTexture("gfx/sprites/ship0.png", hideLoadingScreenIfPossible);
		spriteTextures[1] = initTexture("gfx/sprites/bullet0.png", hideLoadingScreenIfPossible);
		spriteTextures[2] = initTexture("gfx/sprites/sprites_1.png", hideLoadingScreenIfPossible);
		
		backgroundTextures = new Array(2);
		backgroundTextures[0] = initTexture("gfx/others/clouds.png", hideLoadingScreenIfPossible);
		
		tileTextures = new Array(2);
		tileTextures[0] = initTexture("gfx/tiles/tiles_1.png", hideLoadingScreenIfPossible);
	}
	
	function init(callback) {
		canvas = $("#TiledArcadeWebGLCanvas").get(0);
		
		gl = null;
		
		try {
			gl = canvas.getContext("experimental-webgl");
		} catch(e) {
			return false;
		}
		if (!gl) {
			return false;
			//alert("Unable to initialize WebGL. Your browser may not support it.");
		}
		
		if (gl) {
		    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
		    gl.clearDepth(1.0);                 // Clear everything
		    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
		    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		    gl.enable(gl.BLEND);
		    
		    initShaders();
		    
		    initBuffers();
		    
		    initTextures(callback);
		} else {
			return false;
		}
		return true;
	}
	
	function resize() {
		$("#TiledArcadeCanvas").css("display","none");
		$("#TiledArcadeBackgroundCanvas").css("display","none");
		$("#TiledArcadeSpritesCanvas").css("display","none");
		$("#TiledArcadeWebGLCanvas").css("display","block");
		
		canvas = $("#TiledArcadeWebGLCanvas").get(0);
		canvas.width = Math.round(($(window).width()*7)/10);
		canvas.height = Math.round(($(window).height()*80)/100);
		gl.viewport(0, 0, canvas.width, canvas.height);
		
//		var ctx2 = $("#TiledArcadeBackgroundCanvas").get(0).getContext('2d');
//		try {
//			ctx2.drawImage(backgrounds[0], 0, 0);
//		} catch (err) {
//
//		};
	}
	
	function clear(camera) {
		if (gl) {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.clearColor(0.0, 0.0, Math.sin(new Date().getTime()*0.01)*0.5+0.5, 1.0);  // Clear to black, fully opaque
	    	gl.clearDepth(1.0);                 // Clear everything
		} else {
			alert("!gl w clear");
		}
	}
	
	function loadIdentity() {
	  mvMatrix = Matrix.I(4);
	}

	function multMatrix(m) {
	  mvMatrix = mvMatrix.x(m);
	}

	function mvTranslate(v) {
		multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
	}
	function mvScale(s) {
		multMatrix(Matrix.Scale($V([s[0], s[1], s[2]])).ensure4x4());
	}
	
	function setMatrixUniforms() {
	  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

	  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
	}

	var mvMatrixStack = [];

	function mvPushMatrix(m) {
	  if (m) {
	    mvMatrixStack.push(m.dup());
	    mvMatrix = m.dup();
	  } else {
	    mvMatrixStack.push(mvMatrix.dup());
	  }
	}

	function mvPopMatrix() {
	  if (!mvMatrixStack.length) {
	    throw("Can't pop from an empty matrix stack.");
	  }
	  
	  mvMatrix = mvMatrixStack.pop();
	  return mvMatrix;
	}

	function mvRotate(angle, v) {
	  var inRadians = angle * Math.PI / 180.0;
	  
	  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
	  multMatrix(m);
	}
	
	function beforeRedraw(camera) {
		if (gl) {
			gl.viewport(0, 0, canvas.width, canvas.height);
			perspectiveMatrix = makePerspective(45, canvas.width/canvas.height, 0.1, 1000.0);
			loadIdentity();
			mvTranslate([-0.0, 0.0, -175.0]);
		}
	}
	
	function afterRedraw(camera) {
		//
	}
	
	function drawBackground(camera) {
		mvPushMatrix();

		var tx = 0;
		var ty = 0;

		mvTranslate([(16+tx)/32.0, (-64+128-ty)/32.0, 151]);
		mvScale([25, 25, 1]);
		
		
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		  
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesTextureCoordBuffer);
		gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
			
		gl.bindTexture(gl.TEXTURE_2D, backgroundTextures[0]);
		
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer);
		
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
		gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureScale"), 1);
		gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTx"), 0);
		gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTy"), 0);
		  
		
		  
		setMatrixUniforms();
		
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		  
		mvPopMatrix();

	}
	
	function drawTiles(level, camera, x0, y0, x1, y1, z) {

		mvPushMatrix();

		var resultY = (0.5+(level.topLeft.y - camera.position.y + camera.screen.height / 2 + level.cellHeight + 0 * level.cellHeight-level.cellHeight))|0;
		var resultX = (0.5+(level.topLeft.x - camera.position.x + camera.screen.width / 2 + level.cellWidth + 0 * level.cellWidth- level.cellWidth))|0;
		mvTranslate([(16+resultX)/32.0, (-64+128-resultY)/32.0, 151]);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, levelVerticesBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		  
		gl.bindBuffer(gl.ARRAY_BUFFER, levelTextureCoordBuffer);
		gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		  
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, tileTextures[0]);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, levelIndexBuffer);
		
		  
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
		
		gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureScale"), 1);
		gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTx"), 0);
		gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTy"), 0);
		  
		setMatrixUniforms();
		//alert("drawElements");				  
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		  
		mvPopMatrix();
		
	}
	
	function drawSprites(objects, camera, z) {
		//TODO
		
		
		
		
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		  
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesTextureCoordBuffer);
		gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer);
		
		  
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
		var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		

		var lastSpriteImageNo = undefined;
		for (var i=0; i<objects.length; i++) {
			if (objects[i].z===z &&
				(objects[i].position.x + objects[i].size.x >= camera.position.x-5*camera.screen.width/2 &&
				objects[i].position.y + objects[i].size.y >= camera.position.y-5*camera.screen.width/2 &&
				objects[i].position.x - objects[i].size.x <= camera.position.x+5*camera.screen.width/2 &&
				objects[i].position.y - objects[i].size.y <= camera.position.y+5*camera.screen.height/2)
				||
				(objects[i].oldPosition.x + objects[i].size.x >= camera.oldPosition.x-5*camera.screen.width/2 &&
				objects[i].oldPosition.y + objects[i].size.y >= camera.oldPosition.y-5*camera.screen.width/2 &&
				objects[i].oldPosition.x - objects[i].size.x <= camera.oldPosition.x+5*camera.screen.width/2 &&
				objects[i].oldPosition.y - objects[i].size.y <= camera.oldPosition.y+5*camera.screen.height/2)
			) {
				var spriteImageNo = objects[i].spriteNo || 0;
				if (spriteImageNo===undefined || spriteImageNo===null) {
					//nic
				} else {
					mvPushMatrix();
					

					var tx = objects[i].position.x
							- camera.position.x
							+ camera.screen.width / 2
							//- (sprites[spriteImageNo].width/2)
							//- (sprites[spriteImageNo].width/2)
							;

					var ty = objects[i].position.y
							- camera.position.y
							+ camera.screen.height / 2;
							//-  (sprites[spriteImageNo].height/2)
							//-  (sprites[spriteImageNo].height/2);

					
					mvTranslate([(16+tx)/32.0, (-64+128-ty)/32.0, 151]);
					mvTranslate([-(24)/32.0, (24)/32.0, 0]);

					mvRotate(-objects[i].spriteRotation*180.0/Math.PI-90.0, [0, 0, 1]);

					mvScale([0.25, 0.5*Math.sqrt((tx2-tx1)*(tx2-tx1)+(ty2-ty1)*(ty2-ty1)), 1]);
					
					
					
					if (lastSpriteImageNo === undefined || lastSpriteImageNo!==spriteImageNo) {
						
						if (spriteImageNo>3) {
							
							if (lastSpriteImageNo===undefined || lastSpriteImageNo<=3) {
								gl.bindTexture(gl.TEXTURE_2D, spriteTextures[2]);
							}
	
							gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureScale"), 1.0/16.0);
							  
							gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTx"), (1+Math.floor((spriteImageNo-3)%16))/16);
							gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTy"), (Math.floor((spriteImageNo-3)/16))/16);
	
						} else {
							if (lastSpriteImageNo===undefined || lastSpriteImageNo>3) {
								gl.bindTexture(gl.TEXTURE_2D, spriteTextures[2]);
							}

							gl.bindTexture(gl.TEXTURE_2D, spriteTextures[spriteImageNo]);
							gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureScale"), 1);
							gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTx"), 0);
							gl.uniform1f(gl.getUniformLocation(shaderProgram, "textureTy"), 0);
	
						}
						lastSpriteImageNo=spriteImageNo;
					} 
					
					//setMatrixUniforms();
					gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
					
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
					  
					mvPopMatrix();


//					if (objects[i].needsRotation()) {
//						rotate(objects[i].spriteRotation+0.5*3.14159265);
//					}
//					ctxSprites.translate( (0.5 - (sprites[spriteImageNo].width/2)) | 0,
//								   (0.5 - (sprites[spriteImageNo].height/2)) | 0);
//
//					ctxSprites.drawImage(   sprites[spriteImageNo],
//									 0,
//									 0
//								 );
//					ctxSprites.restore();
				}
			}
		}
	}
	
	function drawSprite() {
		// TODO
	};
	
	function freeResources() {
		// TODO
	};

	function getInfo() {
		if (canvasObj != undefined) {
			return "webgl["+canvasObj.width+"x"+canvasObj.height+"]";
		} else {
			return "webgl[uninitialized]";
		}
	};

	function drawGoal(camera, player, goal) {
		//TODO
	};
	
	function drawRelations(game, relations, objects, player, camera) {
		//TODO
	};
	
	return {
		version : version,
		name : name,
		
	    init : init,
	    resize: resize,
	    
	    isInited : isInited,
	    
	    beforeRedraw: beforeRedraw,
	    afterRedraw: afterRedraw,
	    
	    clear : clear,
	    drawBackground : drawBackground,
	    drawTiles : drawTiles,
	    drawSprite : drawSprite, // maybe not needed, maybe not optimal
	    drawSprites : drawSprites,
	    drawGoal: drawGoal,
	    drawRelations : drawRelations,
	    
	    updateLevel : updateLevel,
	    
	    freeResources : freeResources,
	    
	    getInfo: getInfo
	};
})(ajuc.utils);
