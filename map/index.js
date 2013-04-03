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
    pointLight: null

    initialize: function() {

      _.bindAll( this, "animate", "render", "update" );

       // Create scene
      this.scene = new THREE.Scene();
      

      // Create Light
      this.pointLight = new THREE.PointLight(0xFFFFFF);

      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 1000;

      // Create Camera
      this.camera = new THREE.PerspectiveCamera(
          35,             // Field of view
          containerWidth / containerHeight, // Aspect ratio
          .08,           // Near plane
          100000           // Far plane
        );
      camera.position.set(0, -2000, 2000);
      camera.lookAt(scene.position);
     
      scene.add(camera);
      
      // Create renderer
      $container = $('#container');

      containerWidth = $container.width();
      containerHeight = $container.height();
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(containerWidth, containerHeight);
      
      // Load scene
      appView = new Map.Views.App({ el: renderer.domElement });
      
      container.appendChild(renderer.domElement);
    },

    animiate: function() {

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
  model: Map.Models.State,
  url: 'http://api.states.com/states'
});


Map.Views.App = Backbone.View.extend({

  events: {
    "hover": "hoverInfo"
  },

  initialize: function() {
    _.bindAll(this, "update");

    this.collection = new Map.Collections.States();
    this.collection.fetch();

    this.initMap();
    this.stateView = new Map.Views.State();

  },

  initMap: function() {
    Map.Controllers.App.scene.addObject( mesh );

  },

  hoverInfo: function(e) {
    this.stateView.showBox(e);

  }

});

Map.Views.State = Backbone.View.extend({


  initialize: function() {
    _.bindAll(this, "highlightState", "update");

    this.initState();
  },

  update: function() {

  },

  initState: function(){
    Map.Controllers.App.scene.addObject( this.sprite );

  }
});
