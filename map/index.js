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
       // Create scene
      this.scene = new THREE.Scene();
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(containerWidth, containerHeight);

      $container.append(renderer.domElement);

      // Create Light
      this.pointLight = new THREE.PointLight(0xFFFFFF);

      this.pointLight.position.x = 10;
      this.pointLight.position.y = 50;
      this.pointLight.position.z = 1000;
      this.scene.add(this.PointLight);

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

      


      this.collection = new Map.Collections.States();

      var self = this;
      this.collection.fetch().complete(function(){

      appView = new Map.Views.App({
        el: renderer.domElement,
        collection: self.collection
      });

      });
      // Load scene

      // for (var i=0; i < stateObjects.length; i++){
      //   this.collection.add(stateObjects[i]);
      // };

      
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


    var amount = this.attributes.data.pensions.state * 3 || 1;
    // var state = JSON.parse(this.attributes.shape);
    var state = {};
    state = this.attributes.shape;
    state.__proto__ = THREE.Shape.prototype;
    var eGeom = new THREE.ExtrudeGeometry( state, {amount: amount, bevelEnabled: false } );
    var material = new THREE.MeshNormalMaterial({
      color: this.attributes.color
      // shading: THREE.SmoothShading
    });

    var mesh = new THREE.Mesh( eGeom, material );
    mesh.position.set(-window.innerWidth/(1.5), window.innerHeight/(1.6), 2 * amount);

    return mesh;
  }
});

Map.Collections.States = Backbone.Collection.extend({
  model: Map.Models.State,
  url: 'schema.json'
});


Map.Views.App = Backbone.View.extend({
  events: {
    // "mousemove": "hoverInfo"
  },

  initialize: function() {

    this.initMap();
  },

  initMap: function() {
    _.each(this.collection.models, function(state){
        var mesh = new Map.Views.State({model: state}).render();
        Map.Controllers.App.scene.add( mesh );
    }, this);
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

stateObjects =[
  {
    "id": 1,
    "code": "az",
    "name": "Arizona",
    "shape": {
      "curves": [
        {
          "v1": {
            "x": 144.9,
            "y": 382.6
          },
          "v2": {
            "x": 142.2,
            "y": 384.7
          }
        },
        {
          "v1": {
            "x": 142.2,
            "y": 384.7
          },
          "v2": {
            "x": 141.9,
            "y": 386.2
          }
        },
        {
          "v1": {
            "x": 141.9,
            "y": 386.2
          },
          "v2": {
            "x": 142.4,
            "y": 387.2
          }
        },
        {
          "v1": {
            "x": 142.4,
            "y": 387.2
          },
          "v2": {
            "x": 161.3,
            "y": 397.8
          }
        },
        {
          "v1": {
            "x": 161.3,
            "y": 397.8
          },
          "v2": {
            "x": 173.4,
            "y": 405.4
          }
        },
        {
          "v1": {
            "x": 173.4,
            "y": 405.4
          },
          "v2": {
            "x": 188.1,
            "y": 414
          }
        },
        {
          "v1": {
            "x": 188.1,
            "y": 414
          },
          "v2": {
            "x": 205,
            "y": 424
          }
        },
        {
          "v1": {
            "x": 205,
            "y": 424
          },
          "v2": {
            "x": 217.2,
            "y": 426.4
          }
        },
        {
          "v1": {
            "x": 217.2,
            "y": 426.4
          },
          "v2": {
            "x": 242.2,
            "y": 429.2
          }
        },
        {
          "v1": {
            "x": 242.2,
            "y": 429.2
          },
          "v2": {
            "x": 259.5,
            "y": 310
          }
        },
        {
          "v1": {
            "x": 259.5,
            "y": 310
          },
          "v2": {
            "x": 175.7,
            "y": 298.1
          }
        },
        {
          "v1": {
            "x": 175.7,
            "y": 298.1
          },
          "v2": {
            "x": 172.6,
            "y": 314.5
          }
        },
        {
          "v1": {
            "x": 172.6,
            "y": 314.5
          },
          "v2": {
            "x": 171,
            "y": 314.5
          }
        },
        {
          "v1": {
            "x": 171,
            "y": 314.5
          },
          "v2": {
            "x": 169.3,
            "y": 317.2
          }
        },
        {
          "v1": {
            "x": 169.3,
            "y": 317.2
          },
          "v2": {
            "x": 166.8,
            "y": 317
          }
        },
        {
          "v1": {
            "x": 166.8,
            "y": 317
          },
          "v2": {
            "x": 165.5,
            "y": 314.3
          }
        },
        {
          "v1": {
            "x": 165.5,
            "y": 314.3
          },
          "v2": {
            "x": 162.8,
            "y": 314
          }
        },
        {
          "v1": {
            "x": 162.8,
            "y": 314
          },
          "v2": {
            "x": 161.9,
            "y": 312.8
          }
        },
        {
          "v1": {
            "x": 161.9,
            "y": 312.8
          },
          "v2": {
            "x": 161,
            "y": 312.8
          }
        },
        {
          "v1": {
            "x": 161,
            "y": 312.8
          },
          "v2": {
            "x": 160,
            "y": 313.4
          }
        },
        {
          "v1": {
            "x": 160,
            "y": 313.4
          },
          "v2": {
            "x": 158.1,
            "y": 314.4
          }
        },
        {
          "v1": {
            "x": 158.1,
            "y": 314.4
          },
          "v2": {
            "x": 158,
            "y": 321.4
          }
        },
        {
          "v1": {
            "x": 158,
            "y": 321.4
          },
          "v2": {
            "x": 157.8,
            "y": 323.1
          }
        },
        {
          "v1": {
            "x": 157.8,
            "y": 323.1
          },
          "v2": {
            "x": 157.2,
            "y": 335.7
          }
        },
        {
          "v1": {
            "x": 157.2,
            "y": 335.7
          },
          "v2": {
            "x": 155.7,
            "y": 337.9
          }
        },
        {
          "v1": {
            "x": 155.7,
            "y": 337.9
          },
          "v2": {
            "x": 155.1,
            "y": 341.2
          }
        },
        {
          "v1": {
            "x": 155.1,
            "y": 341.2
          },
          "v2": {
            "x": 157.9,
            "y": 346.1
          }
        },
        {
          "v1": {
            "x": 157.9,
            "y": 346.1
          },
          "v2": {
            "x": 159.1,
            "y": 351.9
          }
        },
        {
          "v1": {
            "x": 159.1,
            "y": 351.9
          },
          "v2": {
            "x": 159.9,
            "y": 352.9
          }
        },
        {
          "v1": {
            "x": 159.9,
            "y": 352.9
          },
          "v2": {
            "x": 161,
            "y": 353.5
          }
        },
        {
          "v1": {
            "x": 161,
            "y": 353.5
          },
          "v2": {
            "x": 160.8,
            "y": 355.8
          }
        },
        {
          "v1": {
            "x": 160.8,
            "y": 355.8
          },
          "v2": {
            "x": 159.2,
            "y": 357.2
          }
        },
        {
          "v1": {
            "x": 159.2,
            "y": 357.2
          },
          "v2": {
            "x": 155.8,
            "y": 358.9
          }
        },
        {
          "v1": {
            "x": 155.8,
            "y": 358.9
          },
          "v2": {
            "x": 153.9,
            "y": 360.8
          }
        },
        {
          "v1": {
            "x": 153.9,
            "y": 360.8
          },
          "v2": {
            "x": 152.4,
            "y": 364.5
          }
        },
        {
          "v1": {
            "x": 152.4,
            "y": 364.5
          },
          "v2": {
            "x": 151.8,
            "y": 369.4
          }
        },
        {
          "v1": {
            "x": 151.8,
            "y": 369.4
          },
          "v2": {
            "x": 149,
            "y": 372.1
          }
        },
        {
          "v1": {
            "x": 149,
            "y": 372.1
          },
          "v2": {
            "x": 146.9,
            "y": 372.8
          }
        },
        {
          "v1": {
            "x": 146.9,
            "y": 372.8
          },
          "v2": {
            "x": 147,
            "y": 373.7
          }
        },
        {
          "v1": {
            "x": 147,
            "y": 373.7
          },
          "v2": {
            "x": 146.6,
            "y": 375.4
          }
        },
        {
          "v1": {
            "x": 146.6,
            "y": 375.4
          },
          "v2": {
            "x": 147,
            "y": 376.2
          }
        },
        {
          "v1": {
            "x": 147,
            "y": 376.2
          },
          "v2": {
            "x": 150.7,
            "y": 376.7
          }
        },
        {
          "v1": {
            "x": 150.7,
            "y": 376.7
          },
          "v2": {
            "x": 150.1,
            "y": 379.5
          }
        },
        {
          "v1": {
            "x": 150.1,
            "y": 379.5
          },
          "v2": {
            "x": 148.6,
            "y": 381.7
          }
        },
        {
          "v1": {
            "x": 148.6,
            "y": 381.7
          },
          "v2": {
            "x": 144.9,
            "y": 382.6
          }
        }
      ],
      "bends": [
        
      ],
      "autoClose": false,
      "actions": [
        {
          "action": "moveTo",
          "args": [
            144.9,
            382.6
          ]
        },
        {
          "action": "lineTo",
          "args": [
            142.2,
            384.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            141.9,
            386.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            142.4,
            387.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            161.3,
            397.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            173.4,
            405.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            188.1,
            414
          ]
        },
        {
          "action": "lineTo",
          "args": [
            205,
            424
          ]
        },
        {
          "action": "lineTo",
          "args": [
            217.2,
            426.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            242.2,
            429.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            259.5,
            310
          ]
        },
        {
          "action": "lineTo",
          "args": [
            175.7,
            298.1
          ]
        },
        {
          "action": "lineTo",
          "args": [
            172.6,
            314.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            171,
            314.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            169.3,
            317.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            166.8,
            317
          ]
        },
        {
          "action": "lineTo",
          "args": [
            165.5,
            314.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            162.8,
            314
          ]
        },
        {
          "action": "lineTo",
          "args": [
            161.9,
            312.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            161,
            312.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            160,
            313.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            158.1,
            314.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            158,
            321.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            157.8,
            323.1
          ]
        },
        {
          "action": "lineTo",
          "args": [
            157.2,
            335.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            155.7,
            337.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            155.1,
            341.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            157.9,
            346.1
          ]
        },
        {
          "action": "lineTo",
          "args": [
            159.1,
            351.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            159.9,
            352.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            161,
            353.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            160.8,
            355.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            159.2,
            357.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            155.8,
            358.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            153.9,
            360.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            152.4,
            364.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            151.8,
            369.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            149,
            372.1
          ]
        },
        {
          "action": "lineTo",
          "args": [
            146.9,
            372.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            147,
            373.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            146.6,
            375.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            147,
            376.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            150.7,
            376.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            150.1,
            379.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            148.6,
            381.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            144.9,
            382.6
          ]
        }
      ],
      "holes": [
        
      ]
    },
    "color": 10571751.139406,
    "data": {
      "pensions": {
        "state": "2.9",
        "local": "0.2"
      },
      "healthcare": {
        "state": "9.3",
        "local": "1.0"
      },
      "education": {
        "state": "4.3",
        "local": "10.5"
      }
    }
  },
  {
    "id": 2,
    "code": "or",
    "name": "Oregon",
    "shape": {
      "curves": [
        {
          "v1": {
            "x": 148.7,
            "y": 175.5
          },
          "v2": {
            "x": 157.5,
            "y": 140.7
          }
        },
        {
          "v1": {
            "x": 157.5,
            "y": 140.7
          },
          "v2": {
            "x": 158.6,
            "y": 136.5
          }
        },
        {
          "v1": {
            "x": 158.6,
            "y": 136.5
          },
          "v2": {
            "x": 160.9,
            "y": 130.8
          }
        },
        {
          "v1": {
            "x": 160.9,
            "y": 130.8
          },
          "v2": {
            "x": 160.3,
            "y": 129.7
          }
        },
        {
          "v1": {
            "x": 160.3,
            "y": 129.7
          },
          "v2": {
            "x": 157.8,
            "y": 129.6
          }
        },
        {
          "v1": {
            "x": 157.8,
            "y": 129.6
          },
          "v2": {
            "x": 156.5,
            "y": 127.9
          }
        },
        {
          "v1": {
            "x": 156.5,
            "y": 127.9
          },
          "v2": {
            "x": 157,
            "y": 126.5
          }
        },
        {
          "v1": {
            "x": 157,
            "y": 126.5
          },
          "v2": {
            "x": 157.5,
            "y": 123.2
          }
        },
        {
          "v1": {
            "x": 157.5,
            "y": 123.2
          },
          "v2": {
            "x": 161.9,
            "y": 117.7
          }
        },
        {
          "v1": {
            "x": 161.9,
            "y": 117.7
          },
          "v2": {
            "x": 163.8,
            "y": 116.7
          }
        },
        {
          "v1": {
            "x": 163.8,
            "y": 116.7
          },
          "v2": {
            "x": 164.9,
            "y": 115.5
          }
        },
        {
          "v1": {
            "x": 164.9,
            "y": 115.5
          },
          "v2": {
            "x": 166.4,
            "y": 111.9
          }
        },
        {
          "v1": {
            "x": 166.4,
            "y": 111.9
          },
          "v2": {
            "x": 170.4,
            "y": 106.3
          }
        },
        {
          "v1": {
            "x": 170.4,
            "y": 106.3
          },
          "v2": {
            "x": 174,
            "y": 102.4
          }
        },
        {
          "v1": {
            "x": 174,
            "y": 102.4
          },
          "v2": {
            "x": 174.2,
            "y": 99
          }
        },
        {
          "v1": {
            "x": 174.2,
            "y": 99
          },
          "v2": {
            "x": 171,
            "y": 96.5
          }
        },
        {
          "v1": {
            "x": 171,
            "y": 96.5
          },
          "v2": {
            "x": 169.2,
            "y": 91.8
          }
        },
        {
          "v1": {
            "x": 169.2,
            "y": 91.8
          },
          "v2": {
            "x": 156.5,
            "y": 88.2
          }
        },
        {
          "v1": {
            "x": 156.5,
            "y": 88.2
          },
          "v2": {
            "x": 141.4,
            "y": 84.7
          }
        },
        {
          "v1": {
            "x": 141.4,
            "y": 84.7
          },
          "v2": {
            "x": 126,
            "y": 84.8
          }
        },
        {
          "v1": {
            "x": 126,
            "y": 84.8
          },
          "v2": {
            "x": 125.5,
            "y": 83.4
          }
        },
        {
          "v1": {
            "x": 125.5,
            "y": 83.4
          },
          "v2": {
            "x": 120.1,
            "y": 85.5
          }
        },
        {
          "v1": {
            "x": 120.1,
            "y": 85.5
          },
          "v2": {
            "x": 115.6,
            "y": 84.9
          }
        },
        {
          "v1": {
            "x": 115.6,
            "y": 84.9
          },
          "v2": {
            "x": 113.2,
            "y": 83.3
          }
        },
        {
          "v1": {
            "x": 113.2,
            "y": 83.3
          },
          "v2": {
            "x": 111.9,
            "y": 84
          }
        },
        {
          "v1": {
            "x": 111.9,
            "y": 84
          },
          "v2": {
            "x": 107.2,
            "y": 83.8
          }
        },
        {
          "v1": {
            "x": 107.2,
            "y": 83.8
          },
          "v2": {
            "x": 105.5,
            "y": 82.4
          }
        },
        {
          "v1": {
            "x": 105.5,
            "y": 82.4
          },
          "v2": {
            "x": 100.3,
            "y": 80.3
          }
        },
        {
          "v1": {
            "x": 100.3,
            "y": 80.3
          },
          "v2": {
            "x": 99.5,
            "y": 80.5
          }
        },
        {
          "v1": {
            "x": 99.5,
            "y": 80.5
          },
          "v2": {
            "x": 95.1,
            "y": 79
          }
        },
        {
          "v1": {
            "x": 95.1,
            "y": 79
          },
          "v2": {
            "x": 93.2,
            "y": 80.8
          }
        },
        {
          "v1": {
            "x": 93.2,
            "y": 80.8
          },
          "v2": {
            "x": 87,
            "y": 80.5
          }
        },
        {
          "v1": {
            "x": 87,
            "y": 80.5
          },
          "v2": {
            "x": 81.1,
            "y": 76.3
          }
        },
        {
          "v1": {
            "x": 81.1,
            "y": 76.3
          },
          "v2": {
            "x": 81.8,
            "y": 75.5
          }
        },
        {
          "v1": {
            "x": 81.8,
            "y": 75.5
          },
          "v2": {
            "x": 82,
            "y": 67.8
          }
        },
        {
          "v1": {
            "x": 82,
            "y": 67.8
          },
          "v2": {
            "x": 79.7,
            "y": 63.9
          }
        },
        {
          "v1": {
            "x": 79.7,
            "y": 63.9
          },
          "v2": {
            "x": 75.6,
            "y": 63.3
          }
        },
        {
          "v1": {
            "x": 75.6,
            "y": 63.3
          },
          "v2": {
            "x": 74.9,
            "y": 60.8
          }
        },
        {
          "v1": {
            "x": 74.9,
            "y": 60.8
          },
          "v2": {
            "x": 72.5,
            "y": 60.3
          }
        },
        {
          "v1": {
            "x": 72.5,
            "y": 60.3
          },
          "v2": {
            "x": 66.7,
            "y": 62.4
          }
        },
        {
          "v1": {
            "x": 66.7,
            "y": 62.4
          },
          "v2": {
            "x": 64.5,
            "y": 68.9
          }
        },
        {
          "v1": {
            "x": 64.5,
            "y": 68.9
          },
          "v2": {
            "x": 61.2,
            "y": 78.9
          }
        },
        {
          "v1": {
            "x": 61.2,
            "y": 78.9
          },
          "v2": {
            "x": 58,
            "y": 85.3
          }
        },
        {
          "v1": {
            "x": 58,
            "y": 85.3
          },
          "v2": {
            "x": 53,
            "y": 99.4
          }
        },
        {
          "v1": {
            "x": 53,
            "y": 99.4
          },
          "v2": {
            "x": 46.5,
            "y": 113
          }
        },
        {
          "v1": {
            "x": 46.5,
            "y": 113
          },
          "v2": {
            "x": 38.5,
            "y": 125.6
          }
        },
        {
          "v1": {
            "x": 38.5,
            "y": 125.6
          },
          "v2": {
            "x": 36.5,
            "y": 128.5
          }
        },
        {
          "v1": {
            "x": 36.5,
            "y": 128.5
          },
          "v2": {
            "x": 35.7,
            "y": 137.1
          }
        },
        {
          "v1": {
            "x": 35.7,
            "y": 137.1
          },
          "v2": {
            "x": 36.1,
            "y": 149.2
          }
        },
        {
          "v1": {
            "x": 36.1,
            "y": 149.2
          },
          "v2": {
            "x": 148.7,
            "y": 175.5
          }
        }
      ],
      "bends": [
        
      ],
      "autoClose": false,
      "actions": [
        {
          "action": "moveTo",
          "args": [
            148.7,
            175.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            157.5,
            140.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            158.6,
            136.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            160.9,
            130.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            160.3,
            129.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            157.8,
            129.6
          ]
        },
        {
          "action": "lineTo",
          "args": [
            156.5,
            127.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            157,
            126.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            157.5,
            123.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            161.9,
            117.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            163.8,
            116.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            164.9,
            115.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            166.4,
            111.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            170.4,
            106.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            174,
            102.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            174.2,
            99
          ]
        },
        {
          "action": "lineTo",
          "args": [
            171,
            96.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            169.2,
            91.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            156.5,
            88.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            141.4,
            84.7
          ]
        },
        {
          "action": "lineTo",
          "args": [
            126,
            84.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            125.5,
            83.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            120.1,
            85.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            115.6,
            84.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            113.2,
            83.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            111.9,
            84
          ]
        },
        {
          "action": "lineTo",
          "args": [
            107.2,
            83.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            105.5,
            82.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            100.3,
            80.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            99.5,
            80.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            95.1,
            79
          ]
        },
        {
          "action": "lineTo",
          "args": [
            93.2,
            80.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            87,
            80.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            81.1,
            76.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            81.8,
            75.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            82,
            67.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            79.7,
            63.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            75.6,
            63.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            74.9,
            60.8
          ]
        },
        {
          "action": "lineTo",
          "args": [
            72.5,
            60.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            66.7,
            62.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            64.5,
            68.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            61.2,
            78.9
          ]
        },
        {
          "action": "lineTo",
          "args": [
            58,
            85.3
          ]
        },
        {
          "action": "lineTo",
          "args": [
            53,
            99.4
          ]
        },
        {
          "action": "lineTo",
          "args": [
            46.5,
            113
          ]
        },
        {
          "action": "lineTo",
          "args": [
            38.5,
            125.6
          ]
        },
        {
          "action": "lineTo",
          "args": [
            36.5,
            128.5
          ]
        },
        {
          "action": "lineTo",
          "args": [
            35.7,
            137.1
          ]
        },
        {
          "action": "lineTo",
          "args": [
            36.1,
            149.2
          ]
        },
        {
          "action": "lineTo",
          "args": [
            148.7,
            175.5
          ]
        }
      ],
      "holes": [
        
      ]
    },
    "color": 3173614.0569316,
    "data": {
      "pensions": {
        "state": "3.7",
        "local": "0.1"
      },
      "healthcare": {
        "state": "6.4",
        "local": "1.0"
      },
      "education": {
        "state": "3.4",
        "local": "8.0"
      }
    }
  }


];