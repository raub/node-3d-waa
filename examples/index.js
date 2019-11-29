'use strict';

const init = require('3d-core-raub');
const webaudio3d = require('..');


const {
	webaudio,
	three,
	window,
	requestAnimationFrame,
} = init({ plugins: [webaudio3d] });

(async () => { try {
	
	const objects = [];
	const scene = new three.Scene();
	
	
	// Camera
	
	const camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(0, 2, 4.5);
	
	
	// Lights
	
	const ambientLight = new three.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );
	
	const directionalLight = new three.DirectionalLight( 0xffffff, 0.7 );
	directionalLight.position.set( 0, 5, 5 );
	scene.add( directionalLight );
	
	const d = 5;
	directionalLight.castShadow = true;
	directionalLight.shadow.camera.left = -d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = -d;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 20;
	directionalLight.shadow.mapSize.x = 1024;
	directionalLight.shadow.mapSize.y = 1024;
	
	
	// Audio
	
	const audioLoader = new three.AudioLoader();
	const listener = new three.AudioListener();
	camera.add( listener );
	
	
	// Floor
	
	const floorGeometry = new three.PlaneBufferGeometry( 10, 10 );
	const floorMaterial = new three.MeshLambertMaterial( { color: 0x4676b6 } );
	const floor = new three.Mesh( floorGeometry, floorMaterial );
	floor.rotation.x = Math.PI * -0.5;
	floor.receiveShadow = true;
	scene.add( floor );
	
	
	// Objects
	
	const count = 6;
	const radius = 3;
	const ballGeometry = new three.SphereBufferGeometry( 0.3, 32, 16 );
	ballGeometry.translate( 0, 0.3, 0 );
	const ballMaterial = new three.MeshLambertMaterial( { color: 0xcccccc } );
	
	const buffer = await new Promise(
		res => audioLoader.load(`${__dirname}/sounds/hit.wav`, res)
	);
	
	// Create objects when audio buffer is loaded
	for (let i = 0; i < count; i++) {
		const s = i / count * Math.PI * 2;
		const ball = new three.Mesh( ballGeometry, ballMaterial );
		ball.castShadow = true;
		ball.userData.down = false;
		ball.position.x = radius * Math.cos( s );
		ball.position.z = radius * Math.sin( s );
		const audio = new three.PositionalAudio( listener );
		audio.setBuffer( buffer );
		audio._buf = buffer;
		ball.add( audio );
		scene.add( ball );
		objects.push( ball );
	}
	
	const renderer = new three.WebGLRenderer( { antialias: true } );
	renderer.shadowMap.enabled = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000 );
	renderer.setPixelRatio( window.devicePixelRatio );
	
	//
	// const controls = new three.OrbitControls( camera, renderer.domElement );
	// controls.minDistance = 1;
	// controls.maxDistance = 25;
	//
	
	window.addEventListener( 'resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	});
	
	const speed = 0.001;
	const height = 3;
	const offset = 0.5;
	
	const render = () => {
		const time = Date.now();
		for ( let i = 0; i < objects.length; i++ ) {
			const ball = objects[ i ];
			const previousHeight = ball.position.y;
			const al = i * offset + ( time * speed );
			
			ball.position.y = Math.abs( Math.sin( al ) * height );
			
			if (ball.position.y === previousHeight) {
				continue;
			}
			
			if ( ball.position.y < previousHeight ) {
				ball.userData.down = true;
			} else {
				// If ball changed direction from down to up
				if ( ball.userData.down === true ) {
					
					const audio = ball.children[ 0 ];
					
					// play audio with perfect timing when ball hits the surface
					audio.play();
					
					ball.userData.down = false;
					
				}
			}
		}
		renderer.render( scene, camera );
	};
	
	const animate = () => {
		requestAnimationFrame( animate );
		render();
	};
	
	animate();
	
} catch (e) { console.error(e); } })();
