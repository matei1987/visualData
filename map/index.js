window.Map = {
  Models: {},
  Collections: {},
  Controllers: {},
  Views: {}
};

Map.Controllers.App = (function() {
  var renderer,
  appView; 

  return {
    camera: null,
    controls: null,
    scene: null,
    pointLight: null,
    projector: null,

    initialize: function() {

      _.bindAll( this, "animate", "render" );

      $container = $('#container');

      containerWidth = $container.width();

      containerHeight = $container.height();
       // Create scene
      this.scene = new THREE.Scene();
      

      // Create Light
      this.pointLight = new THREE.PointLight(0xFFFFFF);

      this.pointLight.position.x = 10;
      this.pointLight.position.y = 50;
      this.pointLight.position.z = 1000;


      // Create Camera
      this.camera = new THREE.PerspectiveCamera(
          35,             // Field of view
          containerWidth / containerHeight, // Aspect ratio
          .08,           // Near plane
          100000           // Far plane
        );
      this.camera.position.set(0, -2000, 2000);
      this.camera.lookAt(this.scene.position);
     
      this.scene.add(this.camera);
     

      //Create Projector
      this.projector = new THREE.Projector(); 

      // Create Controls
      this.controls = new THREE.TrackballControls(this.camera);
      this.controls.movementSpeed = 50;
      this.controls.rollSpeed = Math.PI / 12;

      // Create renderer
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(containerWidth, containerHeight);
      
      // Load scene
      appView = new Map.Views.App({ el: renderer.domElement });
      
      $container.append(renderer.domElement);
    },

    animate: function() {

      requestAnimationFrame(this.animate);
      this.controls.update();
      this.render();
    },

    render: function() {
      renderer.render(this.scene, this.camera);
    }

  };

})();


Map.Models.State = Backbone.Model.extend({

createShape: function (data) {
    data = data || 'pensions';

    var amount = this.get('data.pensions.state') * 3 || 1;
    var eGeom = new THREE.ExtrudeGeometry( this.get('shape'), {amount: amount, bevelEnabled: false } );
    var material = new THREE.MeshLambertMaterial({
      color: this.get('color'),
      shading: THREE.SmoothShading
    });

    var mesh = new THREE.Mesh( eGeom, material );
    mesh.position.set(window.innerWidth/(1.5), window.innerHeight/(1.6), 2 * amount);

    return mesh;
  }
});

Map.Collections.States = Backbone.Collection.extend({
  model: Map.Models.State,
  url: 'schema.json'
});


Map.Views.App = Backbone.View.extend({
  events: {
    "mousemove": "hoverInfo"
  },

  initialize: function() {
    // _.bindAll(this, "update");

    this.collection = new Map.Collections.States();
    this.collection.fetch();
   console.log(this.collection); 
    this.initMap();
  },

  initMap: function() {
    _.each(this.collection.models, function(state){
        var mesh = new Map.Views.State({model: state}).render();
        Map.Controllers.App.scene.add( mesh );
    });
  },

  hoverInfo: function(e) {


    var $tip = $("#tip"),
    position = $('canvas').position(),
    offsetY = position.top,
    offsetX = position.left;

    var mouseVector = {};
    mouseVector.x = 2 * ((e.clientX - offsetX ) / containerWidth) - 1,
    mouseVector.y = 1 - 2 * ( (e.clientY - offsetY)/ containerHeight );

    $tip.hide();

    var states = this.collection;

    for (var i = 0, len = states.children.length; i < len; i++) {
      var state = states.children[i];
      state.material.color.setHex(colorArray[i]);
    }

    var raycaster = projecter.pickingRay(mouseVector.clone(), camera ),
    intersects = raycaster.intersectObjects(states.children );

    if(intersects.length){
      var intersection = intersects[0];
      obj = intersection.object;
      obj.material.color.setRGB( 1, 0, 0);


      var hoverData = this.collection.where({'id': 1});
      dataJSON[$(".active").data("area")][statecode[obj.name]];

      $tip.css({
        "top":e.clientY,
        "left":e.clientX
      });

      $("#title").text(statecode[obj.name]);
      $("#local").text("Local: "+hoverData["State Spending"]+"B");
      $("#state").text("State: "+hoverData["Local Spending"]+"B");
      $("#total").text("Total: "+hoverData["State and Local Spending"]+"B");

      $tip.show();
    }

    // TODO: create hover template.
    // Possible Option: Create a view just for the hover box and pass this.collection.models[x].data as the model..
    // Hoverinfo should cast ray grab the id attribute from the object and render the template with the correct model
    // Should set display to none in the beginning of the function
  }

});

Map.Models.State = Backbone.Model.extend();

Map.Views.State = Backbone.View.extend({
  initialize: function() {
    // this.model = new Map.Models.State();
  },

  render: function(){
    var shapeMesh = this.model.createShape('pensions');

    return shapeMesh;
  }
});
