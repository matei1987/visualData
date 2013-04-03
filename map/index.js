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
    scene: null,
    controls: null,
    pointLight: null,

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
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(containerWidth, containerHeight);
      
      // Load scene
      appView = new Map.Views.App({ el: renderer.domElement });
      
      container.appendChild(renderer.domElement);
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
  url: 'http://api.states.com/states'
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
    // I will create a view for the individual states, which will return a 3object
    // each "view" (3dobject) will be added to the scene
    // Map.Controllers.App.scene.addObject( mesh );

  },

  hoverInfo: function(e) {

    // TODO: create hover template.
    // Possible Option: Create a view just for the hover box and pass this.collection.models[x].data as the model..
    // Hoverinfo should cast ray grab the id attribute from the object and render the template with the correct model
    // Should set display to none in the beginning of the function
  }

});