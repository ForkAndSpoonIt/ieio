*
      Example 6: Adding in walls
    */
    window.onload = function() {

      // Initialise an empty canvas and place it on the page
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.9;
      document.body.appendChild(canvas);

      // Inital starting position
      var posX = 20,
          posY = canvas.height / 2;

      // No longer setting velocites as they will be random
      // Set up object to contain particles and set some default values
      var particles = {},
          particleIndex = 0,
          settings = {
            density: 1,
            particleSize: 5,
            startingX: canvas.width / 2,
            startingY: canvas.height / 4,
            gravity: 0.5,
            maxLife: 150,
            groundLevel: canvas.height,
            leftWall: canvas.width * 0.1,
            rightWall: canvas.width
          };

      // To optimise the previous script, generate some pseudo-random angles
      var seedsX = [];
      var seedsY = [];
      var maxAngles = 100;
      var currentAngle = 0;

      function seedAngles() {
        seedsX = [];
        seedsY = [];
        for (var i = 0; i < maxAngles; i++) {
          seedsX.push(Math.random() * 20 - 10);
          seedsY.push(Math.random() * 30 - 10);
        }
      }

      // Start off with 100 angles ready to go
      seedAngles();

      // Set up a function to create multiple particles
      function Particle() {
        if (currentAngle !== maxAngles) {
          // Establish starting positions and velocities
          this.x = settings.startingX;
          this.y = settings.startingY;

          this.vx = seedsX[currentAngle];
          this.vy = seedsY[currentAngle];

          currentAngle++;

          // Add new particle to the index
          // Object used as it's simpler to manage that an array
          particleIndex ++;
          particles[particleIndex] = this;
          this.id = particleIndex;
          this.life = 0;
          this.maxLife = settings.maxLife;
        } else {
          console.log('Generating more seed angles');
          seedAngles();
          currentAngle = 0;
        }
      }

      // Some prototype methods for the particle's "draw" function
      Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Give the particle some bounce
        if ((this.y + settings.particleSize) > settings.groundLevel) {
          this.vy *= -0.6;
          this.vx *= 0.75;
          this.y = settings.groundLevel - settings.particleSize;
        }

        // Determine whether to bounce the particle off a wall
        if (this.x - (settings.particleSize) <= settings.leftWall) {
          this.vx *= -1;
          this.x = settings.leftWall + (settings.particleSize);
        }

        if (this.x + (settings.particleSize) >= settings.rightWall) {
          this.vx *= -1;
          this.x = settings.rightWall - settings.particleSize;
        }

        // Adjust for gravity
        this.vy += settings.gravity;

        // Age the particle
        this.life++;

        // If Particle is old, it goes in the chamber for renewal
        if (this.life >= this.maxLife) {
          delete particles[this.id];
        }

        // Create the shapes
        //context.fillStyle = "red";
        //context.fillRect(this.x, this.y, settings.particleSize, settings.particleSize);
        context.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle="#0000ff";
        // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
        context.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true); 
        context.closePath();
        context.fill();
      }

      setInterval(function() {
        context.fillStyle = "rgba(10,10,10,0.8)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw a left, right walls and floor
        context.fillStyle = "white";
        context.fillRect(0, 0, settings.leftWall, canvas.height);
        context.fillRect(settings.rightWall, 0, canvas.width, canvas.height);
        context.fillRect(0, settings.groundLevel, canvas.width, canvas.height);

        // Draw the particles
        for (var i = 0; i < settings.density; i++) {
          new Particle();
        }

        for (var i in particles) {
          particles[i].draw();
        }
      }, 30);


    };
