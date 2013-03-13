
function init() {
  clock = new THREE.Clock();
  
  $container = $('#container');
  var width = window.innerWidth * 0.99;
  var height = window.innerHeight * 0.99;
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  $container.append(renderer.domElement);
  
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(
    35,             // Field of view
    width / height, // Aspect ratio
    0.01,           // Near plane
    10000           // Far plane
  );
  camera.position.set(500, 000, 2000);
  camera.lookAt(scene.position);
  
  scene.add(camera);
  
  var parent = new THREE.Object3D();
  parent.position.y = 50;
  scene.add( parent );
 
  var colorArray = [10571751.13940574, 3173614.0569316, 9563453.703411205, 13566412.191378772, 3205732.246423457, 510009.23913232866, 5553613.829135051, 9853254.740825217, 4491309.27526584, 11631465.65436683, 14945459.609181136, 8099660.212535102, 14592825.958324742, 9283951.76694582, 2923730.6421383135, 11666026.488244344, 1067065.034054214, 2057363.4906528227, 12416542.963041324, 2390840.056713569, 13317874.108536547, 13024219.977602199, 9886527.488842007, 8380292.230964378, 2406184.8057989506, 5314210.120748375, 3310143.044887588, 14470882.992936859, 7965356.12679025, 11550910.70213703, 422745.1466774242, 3047906.9316118294, 10708356.45548218, 11858674.148636648, 14571121.93227465, 7942466.29612334, 4917391.163931879, 16323339.679396829, 3528461.106093567, 767573.5167490505, 8130699.398185022, 12086219.138980158, 11746055.338943003, 16774037.89472062, 9088119.919243308, 5511252.984003704, 15653468.727136752, 11367309.865424244, 13724763.025690326, 14044767.268335337, 13830761.956872297];

  console.log(colorArray);
  for (var path in statePaths.paths) {
    if (path != 'mi') {
      var shape = transformSVGPath(statePaths.paths[path]);
      var color = colorArray.pop(); 
      var shapeMesh = createShape(shape, color, 0, 0, 0, Math.PI, 0, 0, 1);
      scene.add(shapeMesh);
    }
  }


  var light = new THREE.PointLight(parseInt('#FFFFFF'.replace('#', '0x')));
  light.position.set(10, 13, 7);
  scene.add(light);
  
  controls = new THREE.TrackballControls(camera);
  controls.movementSpeed = 100;
  controls.rollSpeed = Math.PI / 12;;
  controls.autoForward = false;
  controls.dragToLook = true;
  
};

function animate() {
  
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  var delta = clock.getDelta();
  controls.update(delta);
};

function createShape( shape, color, x, y, z, rx, ry, rz, s ) {
  // flat shape
  
  
  var eSettings = {
    size: 3, height: 4, curveSegments: 3,
    bevelThickness: 5, bevelSize: 2, bevelEnabled: false,
    material: 0, extrudeMaterial: 1
  };

  var eGeom = new THREE.ExtrudeGeometry( shape, eSettings );
  var material = new THREE.MeshBasicMaterial({
    color: color, 
    side: THREE.DoubleSide
  });
  
  var mesh = new THREE.Mesh( eGeom, material );
 eGeom.computeBoundingBox();
// THREE.GeometryUtils.center(eGeom);
  mesh.position.set( x-400, y+200, z );
  mesh.rotation.set( rx, ry, rz );
  s = 1 ;
  mesh.scale.set( s, s, s );

var scale = new THREE.Vector3(1,2,1); 

// THREE.GeometryUtils.scale(eGeom, scale);
  return mesh;
}

function transformSVGPath(pathStr) {

  const DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46,
      MINUS = 45;

  var path = new THREE.Shape();
  
  var idx = 1, len = pathStr.length, activeCmd,
      x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
      x1 = 0, x2 = 0, y1 = 0, y2 = 0,
      rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;
  
  function eatNum() {
    var sidx, c, isFloat = false, s;
    // eat delims
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE)
        break;
      idx++;
    }
    if (c === MINUS)
      sidx = idx++;
    else
      sidx = idx;
    // eat number
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (DIGIT_0 <= c && c <= DIGIT_9) {
        idx++;
        continue;
      }
      else if (c === PERIOD) {
        idx++;
        isFloat = true;
        continue;
      }
      
      s = pathStr.substring(sidx, idx);
      return isFloat ? parseFloat(s) : parseInt(s);
    }
    
    s = pathStr.substring(sidx);
    return isFloat ? parseFloat(s) : parseInt(s);
  }
  
  function nextIsNum() {
    var c;
    // do permanently eat any delims...
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE)
        break;
      idx++;
    }
    c = pathStr.charCodeAt(idx);
    return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
  }
  
  var canRepeat;
  activeCmd = pathStr[0];
  while (idx <= len) {
    canRepeat = true;
    switch (activeCmd) {
        // moveto commands, become lineto's if repeated
      case 'M':
        x = eatNum();
        y = eatNum();
        path.moveTo(x, y);
        activeCmd = 'L';
        break;
      case 'm':
        x += eatNum();
        y += eatNum();
        path.moveTo(x, y);
        activeCmd = 'l';
        break;
      case 'Z':
      case 'z':
        canRepeat = false;
        if (x !== firstX || y !== firstY)
          path.lineTo(firstX, firstY);
        break;
        // - lines!
      case 'L':
      case 'H':
      case 'V':
        nx = (activeCmd === 'V') ? x : eatNum();
        ny = (activeCmd === 'H') ? y : eatNum();
        path.lineTo(nx, ny);
        x = nx;
        y = ny;
        break;
      case 'l':
      case 'h':
      case 'v':
        nx = (activeCmd === 'v') ? x : (x + eatNum());
        ny = (activeCmd === 'h') ? y : (y + eatNum());
        path.lineTo(nx, ny);
        x = nx;
        y = ny;
        break;
        // - cubic bezier
      case 'C':
        x1 = eatNum(); y1 = eatNum();
      case 'S':
        if (activeCmd === 'S') {
          x1 = 2 * x - x2; y1 = 2 * y - y2;
        }
        x2 = eatNum();
        y2 = eatNum();
        nx = eatNum();
        ny = eatNum();
        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
        x = nx; y = ny;
        break;
      case 'c':
        x1 = x + eatNum();
        y1 = y + eatNum();
      case 's':
        if (activeCmd === 's') {
          x1 = 2 * x - x2;
          y1 = 2 * y - y2;
        }
        x2 = x + eatNum();
        y2 = y + eatNum();
        nx = x + eatNum();
        ny = y + eatNum();
        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
        x = nx; y = ny;
        break;
        // - quadratic bezier
      case 'Q':
        x1 = eatNum(); y1 = eatNum();
      case 'T':
        if (activeCmd === 'T') {
          x1 = 2 * x - x1;
          y1 = 2 * y - y1;
        }
        nx = eatNum();
        ny = eatNum();
        path.quadraticCurveTo(x1, y1, nx, ny);
        x = nx;
        y = ny;
        break;
      case 'q':
        x1 = x + eatNum();
        y1 = y + eatNum();
      case 't':
        if (activeCmd === 't') {
          x1 = 2 * x - x1;
          y1 = 2 * y - y1;
        }
        nx = x + eatNum();
        ny = y + eatNum();
        path.quadraticCurveTo(x1, y1, nx, ny);
        x = nx; y = ny;
        break;
        // - elliptical arc
      case 'A':
        rx = eatNum();
        ry = eatNum();
        xar = eatNum() * DEGS_TO_RADS;
        laf = eatNum();
        sf = eatNum();
        nx = eatNum();
        ny = eatNum();
        if (rx !== ry) {
          console.warn("Forcing elliptical arc to be a circular one :(",
                       rx, ry);
        }
        // SVG implementation notes does all the math for us! woo!
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // step1, using x1 as x1'
        x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
        y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
        // step 2, using x2 as cx'
        var norm = Math.sqrt(
          (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) /
          (rx*rx * y1*y1 + ry*ry * x1*x1));
        if (laf === sf)
          norm = -norm;
        x2 = norm * rx * y1 / ry;
        y2 = norm * -ry * x1 / rx;
        // step 3
        cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
        cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;
        
        var u = new THREE.Vector2(1, 0),
            v = new THREE.Vector2((x1 - x2) / rx,
                                  (y1 - y2) / ry);
        var startAng = Math.acos(u.dot(v) / u.length() / v.length());
        if (u.x * v.y - u.y * v.x < 0)
          startAng = -startAng;
        
        // we can reuse 'v' from start angle as our 'u' for delta angle
        u.x = (-x1 - x2) / rx;
        u.y = (-y1 - y2) / ry;
        
        var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
        // This normalization ends up making our curves fail to triangulate...
        if (v.x * u.y - v.y * u.x < 0)
          deltaAng = -deltaAng;
        if (!sf && deltaAng > 0)
          deltaAng -= Math.PI * 2;
        if (sf && deltaAng < 0)
          deltaAng += Math.PI * 2;
        
        path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
        x = nx;
        y = ny;
        break;
      default:
        throw new Error("weird path command: " + activeCmd);
    }
    if (firstX === null) {
      firstX = x;
      firstY = y;
    }
    // just reissue the command
    if (canRepeat && nextIsNum())
      continue;
    activeCmd = pathStr[idx++];
  }
  
  return path;
}





$(function() {

    var renderer;
    var controls;
    var scene;
    var camera;
    var $container;
    var clock;

    var xx=0;
    var yy=0;
    var zz=0;
    init();
    animate();

});

