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


Map.Models.State = Backbone.Model.extend();

Map.Collections.States = Backbone.Collection.extend({
  // TODO: set up express to send array of objects from this url in JSON
  //
  // SCHEMA:
  //
  // [
  //   {
  //     "id": 1,
  //     "code": "ca",
  //     "name": "California",
  //     "shape": "fdsafsad...",
  //      "data" {
  //         "pensions": {
  //           "state": 50,
  //           "local": 10
  //         },
  //         "healthcare": {
  //           "state": 50,
  //           "local": 10
  //         },
  //         "education": {
  //           "state": 50,
  //           "local": 10
  //         }
  //     }
  //   }
  // ]

  model: Map.Models.State,
  url: 'states.json'
});


Map.Views.App = Backbone.View.extend({
  events: {
    "mousemove": "hoverInfo"
  },

  initialize: function() {
    // _.bindAll(this, "update");

    this.collection = new Map.Collections.States();
    this.collection.fetch();

    this.initMap();
  },

  initMap: function() {
    // TODO: This is where I will add the collection
    // I will create a view for the individual states, which will return a 3dObject
    // each "view" (3dobject) will be added to the scene
    // Map.Controllers.App.scene.addObject( states );

  },

  hoverInfo: function(e) {
    var position = $('canvas').position(),
    offsetY = position.top,
    offsetX = position.left;

    mouseVector.x = 2 * ((e.clientX - offsetX ) / containerWidth) - 1;
    mouseVector.y = 1 - 2 * ( (e.clientY - offsetY)/ containerHeight );

    var states = this.collection;

    for (var i, len = states.children.length; i < len; i++) {
      var state = states.children[i];
      state.material.color.setHex(colorArray[i]);
    }

    var raycaster = projecter.pickingRay(mouseVector.clone(), camera ),
    intersects = raycaster.intersectObjects(states.children );
    $("#tip").hide();

    if(intersects.length){
      var intersection = intersects[0];
      obj = intersection.object;
      obj.material.color.setRGB( 1, 0, 0);

      var hoverData = dataJSON[$(".active").data("area")][statecode[obj.name]];

      $("#tip").css({
        "top":e.clientY,
        "left":e.clientX
      });

      $("#title").text(statecode[obj.name]);
      $("#local").text("Local: "+hoverData[0]+"B");
      $("#state").text("State: "+hoverData[1]+"B");
      $("#total").text("Total: "+hoverData[2]+"B");

      $("#tip").show();
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
    this.model = new Map.Models.State();
  }
});
