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
    collection: null,
    controls: null,
    scene: null,
    pointLight: null,
    projector: null,

    initialize: function() {
      _.bindAll( this, "animate", "render" );

      $container = $('#container');
      containerWidth = $container.width();
      containerHeight = $container.height();

      
      // Create renderer
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(containerWidth, containerHeight);
      container.appendChild(renderer.domElement);

       // Create scene
      this.scene = new THREE.Scene();

      // Create Light
      this.pointLight = new THREE.PointLight(0xFFFFFF);
      this.pointLight.position.x = 10;
      this.pointLight.position.y = 50;
      this.pointLight.position.z = 1000;
      this.scene.add(this.pointLight);

      // Create Camera
      this.camera = new THREE.PerspectiveCamera(
          35,             // Field of view
          containerWidth / containerHeight, // Aspect ratio
          .08,           // Near plane
          100000           // Far plane
        );
      this.camera.position.set(0, -2000, 20);
      this.camera.lookAt(this.scene.position);
     
      this.scene.add(this.camera);

      //Create Projector
      this.projector = new THREE.Projector(); 

      // Create Controls
      this.controls = new THREE.TrackballControls(this.camera);
      this.controls.movementSpeed = 50;
      this.controls.rollSpeed = Math.PI / 12;

      this.collection = new Map.Collections.States();

      var self = this;
      this.collection.fetch().complete(function(){

        appView = new Map.Views.App({
          el: renderer.domElement,
          collection: self.collection
        });

      });
      
    },

    animate: function() {

      requestAnimationFrame(this.animate);
      this.controls.update();
      this.pointLight.position.y = this.camera.position.y;
      this.pointLight.position.z = this.camera.position.z;
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


    var amount = this.attributes.data.education.state * 6 || 1;
    var state = {};
    state = this.attributes.shape;
    state.__proto__ = THREE.Shape.prototype;
    var eGeom = new THREE.ExtrudeGeometry( state, {amount: amount, bevelEnabled: false } );
    var material = new THREE.MeshLambertMaterial({
      color: this.attributes.color,
      shading: THREE.SmoothShading
    });

    var mesh = new THREE.Mesh( eGeom, material );
    // mesh.position.set(0 - window.innerWidth/(1.5), window.innerHeight/(1.6), -amount);
    mesh.position.setZ(-amount);

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
    _.bindAll( this, "initMap", "hoverInfo" );

    this.initMap();
  },

  initMap: function() {
    _.each(this.collection.models, function(state){
        var mesh = new Map.Views.State({model: state}).render();
        mesh.id = state.get('id');
        Map.Controllers.App.scene.add( mesh );
    }, this);
  },

  hoverInfo: function(e) {
    var position = $('canvas').position(),
    offsetY = position.top,
    offsetX = position.left;

    var mouseVector = new THREE.Vector3();
    mouseVector.x = 2 * ((e.clientX - offsetX ) / containerWidth) - 1,
    mouseVector.y = 1 - 2 * ( (e.clientY - offsetY)/ containerHeight );


    var states = Map.Controllers.App.scene.__objects;

    for (var i = 0, len = states.length; i < len; i++) {
      var state = states[i];
      stateModel = this.collection.where({'id': state.id })[0];
      if (stateModel) {
        state.material.color.setHex(stateModel.get('color'));
      }
    }

    var camera = Map.Controllers.App.camera;
    var projector = Map.Controllers.App.projector;
    var raycaster = projector.pickingRay(mouseVector.clone(), camera ),
    intersects = raycaster.intersectObjects(states );

   tip = $("#tip");
   tip.hide();

    if(intersects.length){
      var intersection = intersects[0];
      obj = intersection.object;
      obj.material.color.setRGB( 1, 0, 0);

      var stateModel = this.collection.where({'id': obj.id})[0];
      var hoverData = stateModel.get('data').education;
      // dataJSON[$(".active").data("area")][statecode[obj.name]];
     
      tip.css({
        "top":e.clientY,
        "left":e.clientX
      });

      $("#title").text(stateModel.get('name'));
      $("#local").text("Local: "+hoverData.local);
      $("#state").text("State: "+hoverData.state);

      tip.show();
    }

    // TODO: create hover template.
    // Possible Option: Create a view just for the hover box and pass this.collection.models[x].data as the model..
    // hoverinfo should cast ray grab the id attribute from the object and render the template with the correct model
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

    // shapeMesh.position.y = 0;
    // shapeMesh.position.x = 0;
    return shapeMesh;
  }
});
