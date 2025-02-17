   let move_speed, building_gap;
        let game_state = "Start";
        let superhero = document.getElementById("superhero-1");
        let superheroHit = document.getElementById("superhero-hit");
        let message = document.querySelector(".message");
        let score_val = document.querySelector(".score_val");
        let level_select = document.querySelector(".level-select");
        let titleImg = document.getElementById("title-img");

        // Audio elements
        let jumpSound = document.getElementById("jumpSound");
        let gameOverSound = document.getElementById("gameOverSound");
        let backgroundMusic = document.getElementById("backgroundMusic");

        // Preload audio
        jumpSound.load();
        gameOverSound.load();
        backgroundMusic.load();

        // Show title image and level select screen at the start
        titleImg.style.display = "block";
        level_select.style.display = "block";

        function startGame(speed, gap) {
            move_speed = speed;
            building_gap = gap;
            level_select.style.display = "none";
            titleImg.style.display = "none";
            message.style.display = "block";
            message.innerHTML = "Press Enter to Start <p><span style='color: red;'>&uarr;</span> ArrowUp to Control</p>";
            superhero.style.display = "block";
            superhero.style.top = "40vh";
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                if (game_state === "Start") {
                    document.querySelectorAll(".building_sprite").forEach((e) => e.remove());
                    game_state = "Play";
                    message.style.display = "none";
                    score_val.innerHTML = "0";

                    // Start background music immediately
                    backgroundMusic.play().catch((error) => {
                        console.error("Background music playback failed:", error);
                    });

                    play();
                } else if (game_state === "End") {
                    resetGame();
                }
            }
        });

        function play() {
            let superhero_props = superhero.getBoundingClientRect();
            let background = document.querySelector(".background").getBoundingClientRect();
            let superhero_dy = 0, gravity = 0.5;
            
            function move() {
                if (game_state !== "Play") return;
                document.querySelectorAll(".building_sprite").forEach((element) => {
                    let building_props = element.getBoundingClientRect();
                    if (building_props.right <= 0) {
                        element.remove();
                    } else {
                        if (superhero_props.left < building_props.left + building_props.width &&
                            superhero_props.left + superhero_props.width > building_props.left &&
                            superhero_props.top < building_props.top + building_props.height &&
                            superhero_props.top + superhero_props.height > building_props.top) {
                            gameOver();
                            return;
                        } else {
                            if (building_props.right < superhero_props.left && building_props.right + move_speed >= superhero_props.left &&
                                element.getAttribute("score") === "1") {
                                score_val.innerHTML = +score_val.innerHTML + 1;
                                element.setAttribute("score", "0");
                            }
                            element.style.left = building_props.left - move_speed + "px";
                        }
                    }
                });
                requestAnimationFrame(move);
            }
            requestAnimationFrame(move);

            function apply_gravity() {
                if (game_state !== "Play") return;
                superhero_dy += gravity;
                document.addEventListener("keydown", (e) => {
                    if (e.key === "ArrowUp" || e.key === " ") {
                        superhero_dy = -7.6;
                        jumpSound.play();
                    }
                });
                if (superhero_props.top <= 0 || superhero_props.bottom >= background.bottom) {
                    gameOver();	
                    return;
                }
                superhero.style.top = superhero_props.top + superhero_dy + "px";
                superhero_props = superhero.getBoundingClientRect();
                requestAnimationFrame(apply_gravity);
            }
            requestAnimationFrame(apply_gravity);

            let building_seperation = 0;
            function create_building() {
                if (game_state !== "Play") return;
                if (building_seperation > 115) {
                    building_seperation = 0;
                    let building_pos = Math.floor(Math.random() * 43) + 8;
                    let building_inv = document.createElement("div");
                    building_inv.className = "building_sprite";
                    building_inv.style.top = building_pos - 70 + "vh";
                    building_inv.style.left = "100vw";
                    building_inv.style.height = "70vh";
                    document.body.appendChild(building_inv);

                    let building = document.createElement("div");
                    building.className = "building_sprite";
                    building.style.top = building_pos + building_gap + "vh";
                    building.style.left = "100vw";
                    building.style.height = "70vh";
                    building.setAttribute("score", "1");
                    document.body.appendChild(building);
                }
                building_seperation++;
                requestAnimationFrame(create_building);
            }
            requestAnimationFrame(create_building);
        }

        function gameOver() {
            game_state = "End";

           
            superhero.style.display = "none";

            
            superheroHit.style.display = "block";
            superheroHit.style.top = superhero.style.top;
            superheroHit.style.left = superhero.style.left;

            
            let gameOverMsg = document.querySelector(".game-over-msg");
            if (!gameOverMsg) {
                gameOverMsg = document.createElement("div");
                gameOverMsg.className = "game-over-msg";
                gameOverMsg.innerHTML = "Game Over <br> Press Enter to Restart";
                document.body.appendChild(gameOverMsg);
            }
            gameOverMsg.style.display = "block";

           
            jumpSound.pause();
            jumpSound.currentTime = 0;
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;

            
            gameOverSound.play();
        }

        function resetGame() {
            game_state = "Start";
            message.style.display = "none";
            level_select.style.display = "block";
            titleImg.style.display = "block";

            
            superheroHit.style.display = "none";
            superhero.style.display = "block";
            superhero.style.top = "40vh";

            
            let gameOverMsg = document.querySelector(".game-over-msg");
            if (gameOverMsg) {
                gameOverMsg.style.display = "none";
            }

           
            document.querySelectorAll(".building_sprite").forEach((e) => e.remove());
            score_val.innerHTML = "0";

            
            gameOverSound.pause();
            gameOverSound.currentTime = 0;
        }