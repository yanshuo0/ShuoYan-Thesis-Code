if (!Array.prototype.reduce)
{
 Array.prototype.reduce = function(fun /*, initial*/)
 {
  var len = this.length;
  if (typeof fun != "function")
   throw new TypeError();
 
  // no value to return if no initial value and an empty array
  if (len == 0 && arguments.length == 1)
   throw new TypeError();
 
  var i = 0;
  if (arguments.length >= 2)
  {
   var rv = arguments[1];
  }
  else
  {
   do
   {
    if (i in this)
    {
     rv = this[i++];
     break;
    }
 
    // if array contains no values, no initial value to return
    if (++i >= len)
     throw new TypeError();
   }
   while (true);
  }
 
  for (; i < len; i++)
  {
   if (i in this)
    rv = fun.call(null, rv, this[i], i, this);
  }
 
  return rv;
 };
}
// Read the stored knowledge in the knowledge importer
            var gameData = JSON.parse(sessionStorage.getItem('myData'));
            if (gameData!==null) {
            $('#button').prop('disabled', false);
            var dataLen = gameData.length;
            //var myCounter = new Int8Array(dataLen);
			var myCounter = new Array(dataLen);
			for(var i=0;i<myCounter.length;i++){
               myCounter[i]=0;
            }
            var index = Math.floor(dataLen * Math.random());                // Random generated index
            var currentId;
            var qWeight = 3;
            var timeWin = qWeight * dataLen;
            var winWord = "You Win!";
        } else {
            //sweetAlert("Oops!", "No data imported", "error");
            swal({                                                          // Error message of no game data
      title: "Error",
      text: "No data imported",
      type: "error" 
    },
      function(){
        window.location.href = 'index.html';
    });
        }
                
                
                // Define global variables
            var NONE        = 4,
                UP          = 3,
                LEFT        = 2,
                DOWN        = 1,
                RIGHT       = 11,
                WAITING     = 5,
                PAUSE       = 6,
                PLAYING     = 7,
                COUNTDOWN   = 8,
                EATEN_PAUSE = 9,
                DYING       = 10,
                Pacman      = {};
                QUESTION    = 0;
                ANSWER      = 0;
                myAnswer    = 0;
                //FLAG        = 1;
                COUNTER     = 0;
                FORM        = document.getElementById("button");
                SUBMITTED       = false;
                // Keep the input box focus during game playing
                document.getElementById('textIn').onblur = function (event) { var blurEl = this; setTimeout(function() {blurEl.focus()},10) };
                
            
            Pacman.FPS = 30;
            // Define Ghosts
            
            // Check whether the broswer support Webstorage, if not, immutate one
            if (!window.locaStorage) {
              window.sessionStorage = {
                getItem: function (sKey) {
                  if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
                  return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
                },
                key: function (nKeyId) { return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]); },
                setItem: function (sKey, sValue) {
                  if(!sKey) { return; }
                  document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
                  this.length = document.cookie.match(/\=/g).length;
                },
                length: 0,
                removeItem: function (sKey) {
                  if (!sKey || !this.hasOwnProperty(sKey)) { return; }
                  var sExpDate = new Date();
                  sExpDate.setDate(sExpDate.getDate() - 1);
                  document.cookie = escape(sKey) + "=; expires=" + sExpDate.toGMTString() + "; path=/";
                  this.length--;
                },
                hasOwnProperty: function (sKey) { return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie); }
              };
              window.sessionStorage.length = (document.cookie.match(/\=/g) || window.sessionStorage).length;
            }
            
           
            //**********************************************************************************************************************************************************
            //**********************************************************************************************************************************************************
            Pacman.Ghost = function (game, map, colour) {
            
                var position  = null,
                    direction = null,
                    eatable   = null,
                    eaten     = null,
                    due       = null;
               
                // Get new coordinates afer each move 
                function getNewCoord(dir, current) { 
                    // Define Speed 
                    var speed  = isVunerable() ? 1 : isHidden() ? 4 : 2,
                        xSpeed = (dir === LEFT && -speed || dir === RIGHT && speed || 0),
                        ySpeed = (dir === DOWN && speed || dir === UP && -speed || 0);
                
                    return {
                        "x": addBounded(current.x, xSpeed),
                        "y": addBounded(current.y, ySpeed)
                    };
                };
            
                /* Collision detection(walls) is done when a ghost lands on an
                 * exact block, make sure they don't skip over it 
                 */
                function addBounded(x1, x2) { 
                    var rem    = x1 % 10, 
                        result = rem + x2;
                    // Wall encountered
                    if (rem !== 0 && result > 10) {
                        return x1 + (10 - rem);
                    } 
                    // No collision
                    else if(rem > 0 && result < 0) { 
                        return x1 - rem;
                    }
                    return x1 + x2;
                };
                
                // Check whether ghosts can be eaten
                function isVunerable() { 
                    return eatable !== null;
                };
                
                // Check whether the pac has been caught by ghost
                function isDangerous() {
                    return eaten === null;
                };
                // pacman / ghost is eaten, it will be hidden
                function isHidden() { 
                    return eatable === null && eaten !== null;
                };
                // When game initialises, a random direction is given to sprites
                function getRandomDirection() {
                    var moves = (direction === LEFT || direction === RIGHT) 
                        ? [UP, DOWN] : [LEFT, RIGHT];
                    return moves[Math.floor(Math.random() * 2)];
                };
                // Game Reset
                function reset() {
                    eaten = null;
                    eatable = null;
                    position = {"x": 90, "y": 80};
                    direction = getRandomDirection();
                    due = getRandomDirection();
                };
                
                // ???
                function onWholeSquare(x) {
                    return x % 10 === 0;
                };
                
                // Define opposite directions
                function oppositeDirection(dir) { 
                    return dir === LEFT && RIGHT ||
                        dir === RIGHT && LEFT ||
                        dir === UP && DOWN || UP;
                };
                // Ghost is eatable
                function makeEatable() {
                    direction = oppositeDirection(direction);
                    eatable = game.getTick();
                };
            
                // Action of eat
                function eat() { 
                    eatable = null;
                    eaten = game.getTick();
                };
            
                // Coordinate value
                function pointToCoord(x) {
                    return Math.round(x / 10);
                };
            
                // Check whether the pacman has moved to the next map block
                function nextSquare(x, dir) {
                    var rem = x % 10;
                    if (rem === 0) { 
                        return x; 
                    } else if (dir === RIGHT || dir === DOWN) { 
                        return x + (10 - rem);
                    } else {
                        return x - rem;
                    }
                };
            
                // ???
                function onGridSquare(pos) {
                    return onWholeSquare(pos.y) && onWholeSquare(pos.x);
                };
                
                // Count the time that ghost can be eaten
                function secondsAgo(tick) { 
                    return (game.getTick() - tick) / Pacman.FPS;
                };
            
                // Get color of ghost
                function getColour() { 
                    if (eatable) { 
                        if (secondsAgo(eatable) > 5) { 
                            return game.getTick() % 20 > 10 ? "#FFFFFF" : "#0000BB"; 
                        } else { 
                            return "#0000BB";
                        }
                    } else if(eaten) { 
                        return "#222";
                    } 
                    return colour;
                };
                
                // Canvas draw
                function draw(ctx) {
              
                    var s    = map.blockSize, 
                        top  = (position.y/10) * s,
                        left = (position.x/10) * s;
                
                    if (eatable && secondsAgo(eatable) > 8) {
                        eatable = null;
                    }
                    
                    if (eaten && secondsAgo(eaten) > 3) { 
                        eaten = null;
                    }
                    
                    var tl = left + s;
                    var base = top + s - 3;
                    var inc = s / 10;
            
                    var high = game.getTick() % 10 > 5 ? 3  : -3;
                    var low  = game.getTick() % 10 > 5 ? -3 : 3;
            
                    ctx.fillStyle = getColour();
                    ctx.beginPath();
            
                    ctx.moveTo(left, base);
            
                    ctx.quadraticCurveTo(left, top, left + (s/2),  top);
                    ctx.quadraticCurveTo(left + s, top, left+s,  base);
                    
                    // Wavy things at the bottom
                    ctx.quadraticCurveTo(tl-(inc*1), base+high, tl - (inc * 2),  base);
                    ctx.quadraticCurveTo(tl-(inc*3), base+low, tl - (inc * 4),  base);
                    ctx.quadraticCurveTo(tl-(inc*5), base+high, tl - (inc * 6),  base);
                    ctx.quadraticCurveTo(tl-(inc*7), base+low, tl - (inc * 8),  base); 
                    ctx.quadraticCurveTo(tl-(inc*9), base+high, tl - (inc * 10), base); 
            
                    ctx.closePath();
                    ctx.fill();
            
                    ctx.beginPath();
                    ctx.fillStyle = "#FFF";
                    ctx.arc(left + 6,top + 6, s / 6, 0, 300, false);
                    ctx.arc((left + s) - 6,top + 6, s / 6, 0, 300, false);
                    ctx.closePath();
                    ctx.fill();
            
                    var f = s / 12;
                    var off = {};
                    off[RIGHT] = [f, 0];
                    off[LEFT]  = [-f, 0];
                    off[UP]    = [0, -f];
                    off[DOWN]  = [0, f];
            
                    ctx.beginPath();
                    ctx.fillStyle = "#000";
                    ctx.arc(left+6+off[direction][0], top+6+off[direction][1], 
                            s / 15, 0, 300, false);
                    ctx.arc((left+s)-6+off[direction][0], top+6+off[direction][1], 
                            s / 15, 0, 300, false);
                    ctx.closePath();
                    ctx.fill();
            
                };
            
                // Move through panel(The two sides of the screen)
                function pane(pos) {
            
                    if (pos.y === 100 && pos.x >= 190 && direction === RIGHT) {
                        return {"y": 100, "x": -10};
                    }
                    
                    if (pos.y === 100 && pos.x <= -10 && direction === LEFT) {
                        return position = {"y": 100, "x": 190};
                    }
            
                    return false;
                };
                
                function move(ctx) {
                    
                    var oldPos = position,
                        onGrid = onGridSquare(position),
                        npos   = null;
                    
                    if (due !== direction) {
                        
                        npos = getNewCoord(due, position);
                        
                        if (onGrid &&
                            map.isFloorSpace({
                                "y":pointToCoord(nextSquare(npos.y, due)),
                                "x":pointToCoord(nextSquare(npos.x, due))})) {
                            direction = due;
                        } else {
                            npos = null;
                        }
                    }
                    
                    if (npos === null) {
                        npos = getNewCoord(direction, position);
                    }
                    
                    if (onGrid &&
                        map.isWallSpace({
                            "y" : pointToCoord(nextSquare(npos.y, direction)),
                            "x" : pointToCoord(nextSquare(npos.x, direction))
                        })) {
                        
                        due = getRandomDirection();            
                        return move(ctx);
                    }
            
                    position = npos;        
                    
                    var tmp = pane(position);
                    if (tmp) { 
                        position = tmp;
                    }
                    
                    due = getRandomDirection();
                    
                    return {
                        "new" : position,
                        "old" : oldPos
                    };
                };
                
                return {
                    "eat"         : eat,
                    "isVunerable" : isVunerable,
                    "isDangerous" : isDangerous,
                    "makeEatable" : makeEatable,
                    "reset"       : reset,
                    "move"        : move,
                    "draw"        : draw
                };
            };
            
            //**********************************************************************************************************************************************************
            //**********************************************************************************************************************************************************
            Pacman.User = function (game, map) {
                
                var position  = null,
                    direction = null,
                    eaten     = null,
                    due       = null, 
                    lives     = null,
                    score     = 5,
                    keyMap    = {};
                
                keyMap[KEY.ARROW_LEFT]  = LEFT;
                keyMap[KEY.ARROW_UP]    = UP;
                keyMap[KEY.ARROW_RIGHT] = RIGHT;
                keyMap[KEY.ARROW_DOWN]  = DOWN;
                
                // Add Score
                function addScore(nScore) { 
                    score += nScore;
                    if (score >= 10000 && score - nScore < 10000) { 
                        lives += 1;
                    }
                };
                
                // Get socre
                function theScore() { 
                    return score;
                };
                
                // Lose a life
                function loseLife() { 
                    lives -= 1;
                };
            
                // Get current life           
                function getLives() {
                    return lives;
                };
            
                // Initial user data
                function initUser() {
                    score = 0;
                    lives = 3;
                    newLevel();
                }
                
                // Initial new level
                function newLevel() {
                    resetPosition();
                    eaten = 0;
                };
                
                // Reset the user
                function resetPosition() {
                    position = {"x": 90, "y": 120};
                    direction = LEFT;
                    due = LEFT;
                };
                
                // Reset game
                function reset() {
                    initUser();
                    resetPosition();
                };        
                
                // Key down detection
                function keyDown(e) {
                    if (typeof keyMap[e.keyCode] !== "undefined") { 
                        due = keyMap[e.keyCode];
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    return true;
              };
            
                // get coordinates after moving
                function getNewCoord(dir, current) {   
                    return {
                        "x": current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
                        "y": current.y + (dir === DOWN && 2 || dir === UP    && -2 || 0)
                    };
                };
            
                // On a block 
                function onWholeSquare(x) {
                    return x % 10 === 0;
                };
            
                // Corrdinates Calculation
                function pointToCoord(x) {
                    return Math.round(x/10);
                };
                
                // enter next block
                function nextSquare(x, dir) {
                    var rem = x % 10;
                    if (rem === 0) { 
                        return x; 
                    } else if (dir === RIGHT || dir === DOWN) { 
                        return x + (10 - rem);
                    } else {
                        return x - rem;
                    }
                };
            
                // get tge next block
                function next(pos, dir) {
                    return {
                        "y" : pointToCoord(nextSquare(pos.y, dir)),
                        "x" : pointToCoord(nextSquare(pos.x, dir)),
                    };                               
                };
            
                // is on grid
                function onGridSquare(pos) {
                    return onWholeSquare(pos.y) && onWholeSquare(pos.x);
                };
            
                // correct key down
                function isOnSamePlane(due, dir) { 
                    return ((due === LEFT || due === RIGHT) && 
                            (dir === LEFT || dir === RIGHT)) || 
                        ((due === UP || due === DOWN) && 
                         (dir === UP || dir === DOWN));
                };
            
                // Canvas move
                function move(ctx) {
                    
                    var npos        = null, 
                        nextWhole   = null, 
                        oldPosition = position,
                        block       = null;
                    
                    if (due !== direction) {
                        npos = getNewCoord(due, position);
                        
                        if (isOnSamePlane(due, direction) || 
                            (onGridSquare(position) && 
                             map.isFloorSpace(next(npos, due)))) {
                            direction = due;
                        } else {
                            npos = null;
                        }
                    }
            
                    if (npos === null) {
                        npos = getNewCoord(direction, position);
                    }
                    
                    if (onGridSquare(position) && map.isWallSpace(next(npos, direction))) {
                        direction = NONE;
                    }
            
                    if (direction === NONE) {
                        return {"new" : position, "old" : position};
                    }
                    
                    if (npos.y === 100 && npos.x >= 190 && direction === RIGHT) {
                        npos = {"y": 100, "x": -10};
                    }
                    
                    if (npos.y === 100 && npos.x <= -12 && direction === LEFT) {
                        npos = {"y": 100, "x": 190};
                    }
                    
                    position = npos;        
                    nextWhole = next(position, direction);
                    
                    block = map.block(nextWhole);        
                    
                    if ((isMidSquare(position.y) || isMidSquare(position.x)) &&
                        block === Pacman.BISCUIT || block === Pacman.PILL) {
                        
                        map.setBlock(nextWhole, Pacman.EMPTY);           
                        addScore((block === Pacman.BISCUIT) ? 10 : 50);
                        eaten += 1;
                        
                        if (eaten === 182) {
                            game.completedLevel();
                        }
                        
                        if (block === Pacman.PILL) {
							Pacman.respawnPills.push({"x":nextWhole.x,"y":nextWhole.y,"delay":10*Pacman.FPS});
							//console.log({"x":nextWhole.x,"y":nextWhole.y,"delay":10*Pacman.FPS});
							game.eatenPill();
                        }
                    }   
                            
                    return {
                        "new" : position,
                        "old" : oldPosition
                    };
                };
            
                // Is in the middle
                function isMidSquare(x) { 
                    var rem = x % 10;
                    return rem > 3 || rem < 7;
                };
            
                // ???
                function calcAngle(dir, pos) { 
                    if (dir == RIGHT && (pos.x % 10 < 5)) {
                        return {"start":0.25, "end":1.75, "direction": false};
                    } else if (dir === DOWN && (pos.y % 10 < 5)) { 
                        return {"start":0.75, "end":2.25, "direction": false};
                    } else if (dir === UP && (pos.y % 10 < 5)) { 
                        return {"start":1.25, "end":1.75, "direction": true};
                    } else if (dir === LEFT && (pos.x % 10 < 5)) {             
                        return {"start":0.75, "end":1.25, "direction": true};
                    }
                    return {"start":0, "end":2, "direction": false};
                };
            
                // Canvas draw the dead user
                function drawDead(ctx, amount) { 
            
                    var size = map.blockSize, 
                        half = size / 2;
            
                    if (amount >= 1) { 
                        return;
                    }
            
                    ctx.fillStyle = "#FFFF00";
                    ctx.beginPath();        
                    ctx.moveTo(((position.x/10) * size) + half, 
                               ((position.y/10) * size) + half);
                    
                    ctx.arc(((position.x/10) * size) + half, 
                            ((position.y/10) * size) + half,
                            half, 0, Math.PI * 2 * amount, true); 
                    
                    ctx.fill();    
                };
            
                // Canvas draw
                function draw(ctx) { 
            
                    var s     = map.blockSize, 
                        angle = calcAngle(direction, position);
            
                    ctx.fillStyle = "#FFFF00";
            
                    ctx.beginPath();        
            
                    ctx.moveTo(((position.x/10) * s) + s / 2,
                               ((position.y/10) * s) + s / 2);
                    
                    ctx.arc(((position.x/10) * s) + s / 2,
                            ((position.y/10) * s) + s / 2,
                            s / 2, Math.PI * angle.start, 
                            Math.PI * angle.end, angle.direction); 
                    
                    ctx.fill();    
                };
                
                initUser();
            
                return {
                    "draw"          : draw,
                    "drawDead"      : drawDead,
                    "loseLife"      : loseLife,
                    "getLives"      : getLives,
                    "score"         : score,
                    "addScore"      : addScore,
                    "theScore"      : theScore,
                    "keyDown"       : keyDown,
                    "move"          : move,
                    "newLevel"      : newLevel,
                    "reset"         : reset,
                    "resetPosition" : resetPosition
                };
            };
            
            
            //**********************************************************************************************************************************************************
            //**********************************************************************************************************************************************************
            Pacman.Map = function (size) {
                
                var height    = null, 
                    width     = null, 
                    blockSize = size,
                    pillSize  = 0,
                    map       = null;
                
                function withinBounds(y, x) {
                    return y >= 0 && y < height && x >= 0 && x < width;
                }
                
                function isWall(pos) {
                    return withinBounds(pos.y, pos.x) && map[pos.y][pos.x] === Pacman.WALL;
                }
                
                function isFloorSpace(pos) {
                    if (!withinBounds(pos.y, pos.x)) {
                        return false;
                    }
                    var peice = map[pos.y][pos.x];
                    return peice === Pacman.EMPTY || 
                        peice === Pacman.BISCUIT ||
                        peice === Pacman.PILL;
                }
                
                function drawWall(ctx) {
            
                    var i, j, p, line;
                    
                    ctx.strokeStyle = "#0000FF";
                    ctx.lineWidth   = 5;
                    ctx.lineCap     = "round";
                    
                    for (i = 0; i < Pacman.WALLS.length; i += 1) {
                        line = Pacman.WALLS[i];
                        ctx.beginPath();
            
                        for (j = 0; j < line.length; j += 1) {
            
                            p = line[j];
                            
                            if (p.move) {
                                ctx.moveTo(p.move[0] * blockSize, p.move[1] * blockSize);
                            } else if (p.line) {
                                ctx.lineTo(p.line[0] * blockSize, p.line[1] * blockSize);
                            } else if (p.curve) {
                                ctx.quadraticCurveTo(p.curve[0] * blockSize, 
                                                     p.curve[1] * blockSize,
                                                     p.curve[2] * blockSize, 
                                                     p.curve[3] * blockSize);   
                            }
                        }
                        ctx.stroke();
                    }
                }
                
                function reset() {       
                    map    = Pacman.MAP.clone();
                    height = map.length;
                    width  = map[0].length;        
                };
            
                function block(pos) {
                    return map[pos.y][pos.x];
                };
                
                function setBlock(pos, type) {
                    map[pos.y][pos.x] = type;
                };
            
                function drawPills(ctx) { 
            
                    if (++pillSize > 30) {
                        pillSize = 0;
                    }
                    
                    for (i = 0; i < height; i += 1) {
                    for (j = 0; j < width; j += 1) {
                            if (map[i][j] === Pacman.PILL) {
                                ctx.beginPath();
            
                                ctx.fillStyle = "#000";
                            ctx.fillRect((j * blockSize), (i * blockSize), 
                                             blockSize, blockSize);
            
                                ctx.fillStyle = "#FFF";
                                ctx.arc((j * blockSize) + blockSize / 2,
                                        (i * blockSize) + blockSize / 2,
                                        Math.abs(5 - (pillSize/3)), 
                                        0, 
                                        Math.PI * 2, false); 
                                ctx.fill();
                                ctx.closePath();
                            }
                    }
                  }
                };
                
                function draw(ctx) {
                    
                    var i, j, size = blockSize;
            
                    ctx.fillStyle = "#000";
                  ctx.fillRect(0, 0, width * size, height * size);
            
                    drawWall(ctx);
                    
                    for (i = 0; i < height; i += 1) {
                    for (j = 0; j < width; j += 1) {
                      drawBlock(i, j, ctx);
                    }
                  }
                };
                
                function drawBlock(y, x, ctx) {
            
                    var layout = map[y][x];
            
                    if (layout === Pacman.PILL) {
                        return;
                    }
            
                    ctx.beginPath();
                    
                    if (layout === Pacman.EMPTY || layout === Pacman.BLOCK || 
                        layout === Pacman.BISCUIT) {
                        
                        ctx.fillStyle = "#000";
                    ctx.fillRect((x * blockSize), (y * blockSize), 
                                     blockSize, blockSize);
            
                        if (layout === Pacman.BISCUIT) {
                            ctx.fillStyle = "#FFF";
                        ctx.fillRect((x * blockSize) + (blockSize / 2.5), 
                                         (y * blockSize) + (blockSize / 2.5), 
                                         blockSize / 6, blockSize / 6);
                      }
                    }
                    ctx.closePath();   
                };
            
                reset();
                
                return {
                    "draw"         : draw,
                    "drawBlock"    : drawBlock,
                    "drawPills"    : drawPills,
                    "block"        : block,
                    "setBlock"     : setBlock,
                    "reset"        : reset,
                    "isWallSpace"  : isWall,
                    "isFloorSpace" : isFloorSpace,
                    "height"       : height,
                    "width"        : width,
                    "blockSize"    : blockSize
                };
            };
            
            
            //**********************************************************************************************************************************************************
            //**********************************************************************************************************************************************************
            Pacman.Audio = function(game) {
                
                var files          = [], 
                    endEvents      = [],
                    progressEvents = [],
                    playing        = [];
                
                function load(name, path, cb) { 
            
                    var f = files[name] = document.createElement("audio");
            
                    progressEvents[name] = function(event) { progress(event, name, cb); };
                    
                    f.addEventListener("canplaythrough", progressEvents[name], true);
                    f.setAttribute("preload", "true");
                    f.setAttribute("autobuffer", "true");
                    f.setAttribute("src", path);
                    f.pause();        
                };
            
                function progress(event, name, callback) { 
                    if (event.loaded === event.total && typeof callback === "function") {
                        callback();
                        files[name].removeEventListener("canplaythrough", 
                                                        progressEvents[name], true);
                    }
                };
            
                function disableSound() {
                    for (var i = 0; i < playing.length; i++) {
                        files[playing[i]].pause();
                        files[playing[i]].currentTime = 0;
                    }
                    playing = [];
                };
            
                function ended(name) { 
            
                    var i, tmp = [], found = false;
            
                    files[name].removeEventListener("ended", endEvents[name], true);
            
                    for (i = 0; i < playing.length; i++) {
                        if (!found && playing[i]) { 
                            found = true;
                        } else { 
                            tmp.push(playing[i]);
                        }
                    }
                    playing = tmp;
                };
            
                function play(name) { 
                    if (!game.soundDisabled()) {
                        endEvents[name] = function() { ended(name); };
                        playing.push(name);
                        files[name].addEventListener("ended", endEvents[name], true);
                        files[name].play();
                    }
                };
            
                function pause() { 
                    for (var i = 0; i < playing.length; i++) {
                        files[playing[i]].pause();
                    }
                };
                
                function resume() { 
                    for (var i = 0; i < playing.length; i++) {
                        files[playing[i]].play();
                    }        
                };
                
                return {
                    "disableSound" : disableSound,
                    "load"         : load,
                    "play"         : play,
                    "pause"        : pause,
                    "resume"       : resume
                };
            };
            
            
            //**********************************************************************************************************************************************************
            //**********************************************************************************************************************************************************
            var PACMAN = (function () {
            
                var state        = WAITING,
                    audio        = null,
                    ghosts       = [],
                    ghostSpecs   = ["#00FFDE", "#FF0000", "#FFB8DE", "#FFB847"],
                    eatenCount   = 0,
                    level        = 0,
                    tick         = 0,
                    ghostPos, userPos, 
                    stateChanged = true,
                    timerStart   = null,
                    lastTime     = 0,
                    ctx          = null,
                    timer        = null,
                    map          = null,
                    user         = null,
                    stored       = null;
                // Get time used 
                function getTick() { 
                    return tick;
                };
            
                // Draw score
                function drawScore(text, position) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.font      = "12px BDCartoonShoutRegular";
                    ctx.fillText(text, 
                                 (position["new"]["x"] / 10) * map.blockSize, 
                                 ((position["new"]["y"] + 5) / 10) * map.blockSize);
                }
                
                // Dialog Display
                function dialog(text) {
                    ctx.fillStyle = "#FFFF00";
                    ctx.font      = "18px BDCartoonShoutRegular";
                    var width = ctx.measureText(text).width,
                        x     = ((map.width * map.blockSize) - width) / 2;        
                    ctx.fillText(text, x, (map.height * 10) + 8);
                }
            
                // Disable sound play
                function soundDisabled() {
                    return sessionStorage["soundDisabled"] === "true";
                };
                
                // start new level
                function startLevel() {        
                    user.resetPosition();
                    for (var i = 0; i < ghosts.length; i += 1) { 
                        ghosts[i].reset();
                    }
                    audio.play("start");
                    timerStart = tick;
                    setState(COUNTDOWN);
                }    
            
                // start new game
                function startNewGame() {
                    setState(WAITING);
                    level = 1;
                    user.reset();
                    map.reset();
                    map.draw(ctx);
                    startLevel();
                }
            
                // Key down
                function keyDown(e) {
                    if (e.keyCode === KEY.comma1) {
                        startNewGame();
                    } else if (e.keyCode === KEY.comma4) {
                        audio.disableSound();
                        sessionStorage["soundDisabled"] = !soundDisabled();
                    } else if (e.keyCode === KEY.P && state === PAUSE) {
                        audio.resume();
                        map.draw(ctx);
                        setState(stored);
                        console.log(state);
                    } else if (e.keyCode === KEY.comma3) {
                        stored = state;
                        setState(PAUSE);
                        audio.pause();
                        map.draw(ctx);
                        dialog("Paused");
                    } else if (state !== PAUSE) {   
                        return user.keyDown(e);
                    }
                    return true;
                }    
            
                // If lose a life, wait the game start
                function loseLife() {        
                    setState(WAITING);
                    user.loseLife();
                    if (user.getLives() > 0) {
                        startLevel();
                    }
                }
            
                // Set game state
                function setState(nState) { 
                    state = nState;
                    stateChanged = true;
                };
                
                // Collide Detection
                function collided(user, ghost) {
                    return (Math.sqrt(Math.pow(ghost.x - user.x, 2) + 
                                      Math.pow(ghost.y - user.y, 2))) < 10;
                };
            
                // Draw 
                function drawFooter() {
                    
                    var topLeft  = (map.height * map.blockSize),
                        textBase = topLeft + 17;
                    
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);
                    
                    ctx.fillStyle = "#FFFF00";
            
                    for (var i = 0, len = user.getLives(); i < len; i++) {
                        ctx.fillStyle = "#FFFF00";
                        ctx.beginPath();
                        ctx.moveTo(150 + (25 * i) + map.blockSize / 2,
                                   (topLeft+1) + map.blockSize / 2);
                        
                        ctx.arc(150 + (25 * i) + map.blockSize / 2,
                                (topLeft+1) + map.blockSize / 2,
                                map.blockSize / 2, Math.PI * 0.25, Math.PI * 1.75, false);
                        ctx.fill();
                    }
            
                    ctx.fillStyle = !soundDisabled() ? "#00FF00" : "#FF0000";
                    ctx.font = "bold 16px sans-serif";
                    //ctx.fillText("♪", 10, textBase);
                    ctx.fillText("s", 10, textBase);
            
                    ctx.fillStyle = "#FFFF00";
                    ctx.font      = "14px BDCartoonShoutRegular";
                    ctx.fillText("Score: " + user.theScore(), 30, textBase);
                    ctx.fillText("Level: " + level, 260, textBase);
                }
            
                function redrawBlock(pos) {
                    map.drawBlock(Math.floor(pos.y/10), Math.floor(pos.x/10), ctx);
                    map.drawBlock(Math.ceil(pos.y/10), Math.ceil(pos.x/10), ctx);
                }
            
                // main draw
                function mainDraw() { 
            
                    var diff, u, i, len, nScore;
                    
                    ghostPos = [];
            
                    for (i = 0, len = ghosts.length; i < len; i += 1) {
                        ghostPos.push(ghosts[i].move(ctx));
                    }
                    u = user.move(ctx);
                    
                    for (i = 0, len = ghosts.length; i < len; i += 1) {
                        redrawBlock(ghostPos[i].old);
                    }
                    redrawBlock(u.old);
                    
                    for (i = 0, len = ghosts.length; i < len; i += 1) {
                        ghosts[i].draw(ctx);
                    }                     
                    user.draw(ctx);
                    
                    userPos = u["new"];
                    
                    for (i = 0, len = ghosts.length; i < len; i += 1) {
                        if (collided(userPos, ghostPos[i]["new"])) {
                            if (ghosts[i].isVunerable()) { 
                                audio.play("eatghost");
                                ghosts[i].eat();
                                eatenCount += 1;
                                nScore = eatenCount * 50;
                                drawScore(nScore, ghostPos[i]);
                                user.addScore(nScore);                    
                                setState(EATEN_PAUSE);
                                timerStart = tick;
                            } else if (ghosts[i].isDangerous()) {
                                audio.play("die");
                                //setState(DYING);
								if(!boolDYING_PAUSE && state !== PAUSE){
									setState(PAUSE);
									boolDYING_PAUSE=true;
									getQuestion();									
								}

                                timerStart = tick;
                            }
                        }
                    }                             
                };
            
                // main game state loop
                function mainLoop() {
            
                    var diff;
            
                    if (state !== PAUSE) { 
                        ++tick;
						for(var i=0;i<Pacman.respawnPills.length;i++){
							if(Pacman.respawnPills[i].delay>0){
								Pacman.respawnPills[i].delay--;
							}
							if(Pacman.respawnPills[i].delay==0){
								map.setBlock({"x":Pacman.respawnPills[i].x,"y":Pacman.respawnPills[i].y},Pacman.PILL);
								Pacman.respawnPills.splice(i--,1);
							}
						}
						//document.querySelector("#check").innerHTML = Pacman.respawnPills.length;
                    }
					
					
                    map.drawPills(ctx);
            
                    if (state === PLAYING) {
                        mainDraw();
                    } else if (state === WAITING && stateChanged) {            
                        stateChanged = false;
                        map.draw(ctx);
                        dialog("New Game: Press Comma");
                                            
                    } else if (state === EATEN_PAUSE && 
                               (tick - timerStart) > (Pacman.FPS / 3)) {
                        map.draw(ctx);
                        setState(PLAYING);
                    } else if (state === DYING) {
                        if (tick - timerStart > (Pacman.FPS * 2)) { 
                            loseLife();
                        } else { 
                            redrawBlock(userPos);
                            for (i = 0, len = ghosts.length; i < len; i += 1) {
                                redrawBlock(ghostPos[i].old);
                                ghostPos.push(ghosts[i].draw(ctx));
                            }                                   
                            user.drawDead(ctx, (tick - timerStart) / (Pacman.FPS * 2));
                        }
                    } else if (state === COUNTDOWN) {
                        
                        diff = 5 + Math.floor((timerStart - tick) / Pacman.FPS);
                        
                        if (diff === 0) {
                            map.draw(ctx);
                            setState(PLAYING);
                        } else {
                            if (diff !== lastTime) { 
                                lastTime = diff;
                                map.draw(ctx);
                                dialog("Starting in: " + diff);
                            }
                        }
                    } 
            
                    drawFooter();
                }

                function checkWin() {
                	if (myCounter.reduce(function(a, b) {return a + b}) == timeWin) {
                		
                		dialog(winWord);
                		console.log(myCounter);
                		document.querySelector("#question").innerHTML = "<h2>" + "You Win!" + "</h2><p>";
                		setTimeout(setState(PAUSE),10000);
                		for (var i = myCounter.length - 1; i >= 0; i--) {
                			myCounter[i] = 0;
                		}
                		completedLevel();
                	} else {
                		getQuestion();
                		map.drawPills(ctx);
                	}
                }
                
                 function getQuestion() {
                    if (gameData!= null) {
                        COUNTER++;
                        var index = Math.floor(dataLen * Math.random());
                        /*if (myCounter.reduce(function(a, b) {return a + b}) == timeWin) {
                            console.log(myCounter);
                            setState(PAUSE);
                            //document.querySelector("#question").innerHTML = "<h2>" + "You Win!" + "</h2><p>";
                            dialog(winWord);
                            //setTimeout(setState(PAUSE), 5000);
                            //PACMAN.startNewGame;
                            //map.reset();


                        } else {*/
                            if (myCounter[index] < qWeight) {
                                QUESTION = gameData[index]['key'];
                                ANSWER = gameData[index]['value'];
                                currentId = index;
                            } else {
                                index = Math.floor(dataLen * Math.random());
                                QUESTION = gameData[index]['key'];
                                ANSWER = gameData[index]['value'];
                                currentId = index;
                            }
                        //}
                       }
                        //QUESTION = gameData[(COUNTER % gameData.length) - 1]['key'];
                        //ANSWER = gameData[(COUNTER % gameData.length) - 1]['value'];
                        
                        //FLAG++;
                     
                    //dialog("You Win!");
					document.querySelector("#question").innerHTML = "<h2>" + " " + QUESTION + "</h2><p>";
                }
                
                
                function submitForm() {
                    myAnswer = document.getElementById("textIn").value;
                    SUBMITTED = true;
                    if (myAnswer != ANSWER) {
						   //alert("Oops! You entered incorrect answer, please try again!");
						   document.querySelector("#check").innerHTML = "<h2>" + "Incorrect! The correct answer is " +  "<span style='color:#00008b'>" + ANSWER + "</span>" + "</h2><p>";
                           resetForm();
                           SUBMITTED = false;
                           if(boolDYING_PAUSE){
							   setState(DYING);
							   boolDYING_PAUSE=false;
							   
						   }else{setState(PLAYING);}						   
                           
                           myCounter[currentId] == 0;
						   getQuestion();
						   //checkWin();
                       map.draw(ctx);
                    } else {
					//alert("Congratulation! You can eat ghosts now!");
						document.querySelector("#check").innerHTML = "<h2>" + "Correct!" + "</h2><p>";
                       resetForm();
                       SUBMITTED = false;
                       audio.play("eatpill");
                       timerStart = tick;
                       eatenCount = 0;
	                    for (i = 0; i < ghosts.length; i += 1) {
	                        ghosts[i].makeEatable(ctx);
	                    }   
                           if(boolDYING_PAUSE){
							   boolDYING_PAUSE=false;
							   //user.resetPosition();
						   }
						   setState(PLAYING);	
                       myCounter[currentId]++;
					   getQuestion();
					   checkWin();
                       map.draw(ctx);
                    }
                   setTimeout(resetPills, 10000);
					return false;
                }
                FORM.addEventListener("click", submitForm, false);
				
				function resetPills() {
				   map.drawPills(ctx);
				}
                
                function resetForm() {
                    document.getElementById("myForm").reset();
                }
            
                
                /*function answerQues() {
                   setState(PAUSE);
                   //getQuestion();
                   //var ch = setTimeout(submitForm(),0);
                };*/

                // eaten a pill
                function eatenPill() {
                    setState(PAUSE);
                    checkWin();
					
                    //answerQues();
                    /*audio.play("eatpill");
                    timerStart = tick;
                    eatenCount = 0;
                    for (i = 0; i < ghosts.length; i += 1) {
                        ghosts[i].makeEatable(ctx);
                    }*/        
                };
                
            
                // Complete the level
                function completedLevel() {
                    setState(WAITING);
                    level += 1;
                    map.reset();
                    user.newLevel();
                    startLevel();
                };
            
                // prevent key dwon
                function keyPress(e) { 
                    if (state !== WAITING && state !== PAUSE) { 
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };
                
                // Initial the game
                function init(wrapper, root) {
                    
                    var i, len, ghost,
                        blockSize = wrapper.offsetWidth / 19,
                        canvas    = document.createElement("canvas");
                    
                    canvas.setAttribute("width", (blockSize * 19) + "px");
                    canvas.setAttribute("height", (blockSize * 22) + 30 + "px");
            
                    wrapper.appendChild(canvas);
            
                    ctx  = canvas.getContext('2d');
            
                    audio = new Pacman.Audio({"soundDisabled":soundDisabled});
                    map   = new Pacman.Map(blockSize);
                    user  = new Pacman.User({ 
                        "completedLevel" : completedLevel, 
                        "eatenPill"      : eatenPill 
                    }, map);
            
                    for (i = 0, len = ghostSpecs.length; i < len; i += 1) {
                        ghost = new Pacman.Ghost({"getTick":getTick}, map, ghostSpecs[i]);
                        ghosts.push(ghost);
                    }
                    
                    map.draw(ctx);
                    dialog("Loading ...");
            
                    var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3';
            
                    var audio_files = [
                        ["start", root + "audio/opening_song." + extension],
                        ["die", root + "audio/die." + extension],
                        ["eatghost", root + "audio/eatghost." + extension],
                        ["eatpill", root + "audio/eatpill." + extension],
                        ["eating", root + "audio/eating.short." + extension],
                        ["eating2", root + "audio/eating.short." + extension]
                    ];
            
                    load(audio_files, function() { loaded(); });
					setTimeout(getQuestion, 5000);
                };
            
                function load(arr, callback) { 
                    
                    if (arr.length === 0) { 
                        callback();
                    } else { 
                        var x = arr.pop();
                        audio.load(x[0], x[1], function() { load(arr, callback); });
                    }
                };
                    
                function loaded() {
            
                    dialog("Press N to Start");
                    
                    document.addEventListener("keydown", keyDown, true);
                    document.addEventListener("keypress", keyPress, true); 
                    boolDYING_PAUSE=false;
                    timer = window.setInterval(mainLoop, 1000 / Pacman.FPS);
                };
                
                return {
                    "init" : init
                };
                
            }());
            
            /* Human readable keyCode index */
            var KEY = {'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27, 'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40, 'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59, 'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93, 'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107, 'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110, 'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145, 'SEMICOLON': 186, 'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189, 'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192, 'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220, 'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222};
            
            (function () {
              /* 0 - 9 */
              for (var i = 48; i <= 57; i++) {
                    KEY['' + (i - 48)] = i;
              }
              /* A - Z */
              for (i = 65; i <= 90; i++) {
                    KEY['' + String.fromCharCode(i)] = i;
              }
              /* NUM_PAD_0 - NUM_PAD_9 */
              for (i = 96; i <= 105; i++) {
                    KEY['NUM_PAD_' + (i - 96)] = i;
              }
              /* F1 - F12 */
              for (i = 112; i <= 123; i++) {
                    KEY['F' + (i - 112 + 1)] = i;
              }
              for (i=188; i <= 191; i++) {
                  KEY['comma' + (i - 188 + 1)] = i;                  
              }
            })();
            Pacman.respawnPills = [];
            Pacman.WALL    = 0;
            Pacman.BISCUIT = 1;
            Pacman.EMPTY   = 2;
            Pacman.BLOCK   = 3;
            Pacman.PILL    = 4;
            
            Pacman.MAP = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              [0, 4, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0],
              [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
              [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
              [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
              [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
              [2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 2, 2],
              [0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0],
              [2, 2, 2, 2, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 2, 2, 2, 2],
              [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
              [2, 2, 2, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 2, 2, 2],
              [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
              [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
              [0, 4, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 0],
              [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
              [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
              [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            
            Pacman.WALLS = [
                
                [{"move": [0, 9.5]}, {"line": [3, 9.5]},
                 {"curve": [3.5, 9.5, 3.5, 9]}, {"line": [3.5, 8]},
                 {"curve": [3.5, 7.5, 3, 7.5]}, {"line": [1, 7.5]},
                 {"curve": [0.5, 7.5, 0.5, 7]}, {"line": [0.5, 1]},
                 {"curve": [0.5, 0.5, 1, 0.5]}, {"line": [9, 0.5]},
                 {"curve": [9.5, 0.5, 9.5, 1]}, {"line": [9.5, 3.5]}],
            
                [{"move": [9.5, 1]},
                 {"curve": [9.5, 0.5, 10, 0.5]}, {"line": [18, 0.5]},
                 {"curve": [18.5, 0.5, 18.5, 1]}, {"line": [18.5, 7]},
                 {"curve": [18.5, 7.5, 18, 7.5]}, {"line": [16, 7.5]},
                 {"curve": [15.5, 7.5, 15.5, 8]}, {"line": [15.5, 9]},
                 {"curve": [15.5, 9.5, 16, 9.5]}, {"line": [19, 9.5]}],
            
                [{"move": [2.5, 5.5]}, {"line": [3.5, 5.5]}],
            
                [{"move": [3, 2.5]},
                 {"curve": [3.5, 2.5, 3.5, 3]},
                 {"curve": [3.5, 3.5, 3, 3.5]},
                 {"curve": [2.5, 3.5, 2.5, 3]},
                 {"curve": [2.5, 2.5, 3, 2.5]}],
            
                [{"move": [15.5, 5.5]}, {"line": [16.5, 5.5]}],
            
                [{"move": [16, 2.5]}, {"curve": [16.5, 2.5, 16.5, 3]},
                 {"curve": [16.5, 3.5, 16, 3.5]}, {"curve": [15.5, 3.5, 15.5, 3]},
                 {"curve": [15.5, 2.5, 16, 2.5]}],
            
                [{"move": [6, 2.5]}, {"line": [7, 2.5]}, {"curve": [7.5, 2.5, 7.5, 3]},
                 {"curve": [7.5, 3.5, 7, 3.5]}, {"line": [6, 3.5]},
                 {"curve": [5.5, 3.5, 5.5, 3]}, {"curve": [5.5, 2.5, 6, 2.5]}],
            
                [{"move": [12, 2.5]}, {"line": [13, 2.5]}, {"curve": [13.5, 2.5, 13.5, 3]},
                 {"curve": [13.5, 3.5, 13, 3.5]}, {"line": [12, 3.5]},
                 {"curve": [11.5, 3.5, 11.5, 3]}, {"curve": [11.5, 2.5, 12, 2.5]}],
            
                [{"move": [7.5, 5.5]}, {"line": [9, 5.5]}, {"curve": [9.5, 5.5, 9.5, 6]},
                 {"line": [9.5, 7.5]}],
                [{"move": [9.5, 6]}, {"curve": [9.5, 5.5, 10.5, 5.5]},
                 {"line": [11.5, 5.5]}],
            
            
                [{"move": [5.5, 5.5]}, {"line": [5.5, 7]}, {"curve": [5.5, 7.5, 6, 7.5]},
                 {"line": [7.5, 7.5]}],
                [{"move": [6, 7.5]}, {"curve": [5.5, 7.5, 5.5, 8]}, {"line": [5.5, 9.5]}],
            
                [{"move": [13.5, 5.5]}, {"line": [13.5, 7]},
                 {"curve": [13.5, 7.5, 13, 7.5]}, {"line": [11.5, 7.5]}],
                [{"move": [13, 7.5]}, {"curve": [13.5, 7.5, 13.5, 8]},
                 {"line": [13.5, 9.5]}],
            
                [{"move": [0, 11.5]}, {"line": [3, 11.5]}, {"curve": [3.5, 11.5, 3.5, 12]},
                 {"line": [3.5, 13]}, {"curve": [3.5, 13.5, 3, 13.5]}, {"line": [1, 13.5]},
                 {"curve": [0.5, 13.5, 0.5, 14]}, {"line": [0.5, 17]},
                 {"curve": [0.5, 17.5, 1, 17.5]}, {"line": [1.5, 17.5]}],
                [{"move": [1, 17.5]}, {"curve": [0.5, 17.5, 0.5, 18]}, {"line": [0.5, 21]},
                 {"curve": [0.5, 21.5, 1, 21.5]}, {"line": [18, 21.5]},
                 {"curve": [18.5, 21.5, 18.5, 21]}, {"line": [18.5, 18]},
                 {"curve": [18.5, 17.5, 18, 17.5]}, {"line": [17.5, 17.5]}],
                [{"move": [18, 17.5]}, {"curve": [18.5, 17.5, 18.5, 17]},
                 {"line": [18.5, 14]}, {"curve": [18.5, 13.5, 18, 13.5]},
                 {"line": [16, 13.5]}, {"curve": [15.5, 13.5, 15.5, 13]},
                 {"line": [15.5, 12]}, {"curve": [15.5, 11.5, 16, 11.5]},
                 {"line": [19, 11.5]}],
            
                [{"move": [5.5, 11.5]}, {"line": [5.5, 13.5]}],
                [{"move": [13.5, 11.5]}, {"line": [13.5, 13.5]}],
            
                [{"move": [2.5, 15.5]}, {"line": [3, 15.5]},
                 {"curve": [3.5, 15.5, 3.5, 16]}, {"line": [3.5, 17.5]}],
                [{"move": [16.5, 15.5]}, {"line": [16, 15.5]},
                 {"curve": [15.5, 15.5, 15.5, 16]}, {"line": [15.5, 17.5]}],
            
                [{"move": [5.5, 15.5]}, {"line": [7.5, 15.5]}],
                [{"move": [11.5, 15.5]}, {"line": [13.5, 15.5]}],
                
                [{"move": [2.5, 19.5]}, {"line": [5, 19.5]},
                 {"curve": [5.5, 19.5, 5.5, 19]}, {"line": [5.5, 17.5]}],
                [{"move": [5.5, 19]}, {"curve": [5.5, 19.5, 6, 19.5]},
                 {"line": [7.5, 19.5]}],
            
                [{"move": [11.5, 19.5]}, {"line": [13, 19.5]},
                 {"curve": [13.5, 19.5, 13.5, 19]}, {"line": [13.5, 17.5]}],
                [{"move": [13.5, 19]}, {"curve": [13.5, 19.5, 14, 19.5]},
                 {"line": [16.5, 19.5]}],
            
                [{"move": [7.5, 13.5]}, {"line": [9, 13.5]},
                 {"curve": [9.5, 13.5, 9.5, 14]}, {"line": [9.5, 15.5]}],
                [{"move": [9.5, 14]}, {"curve": [9.5, 13.5, 10, 13.5]},
                 {"line": [11.5, 13.5]}],
            
                [{"move": [7.5, 17.5]}, {"line": [9, 17.5]},
                 {"curve": [9.5, 17.5, 9.5, 18]}, {"line": [9.5, 19.5]}],
                [{"move": [9.5, 18]}, {"curve": [9.5, 17.5, 10, 17.5]},
                 {"line": [11.5, 17.5]}],
            
                [{"move": [8.5, 9.5]}, {"line": [8, 9.5]}, {"curve": [7.5, 9.5, 7.5, 10]},
                 {"line": [7.5, 11]}, {"curve": [7.5, 11.5, 8, 11.5]},
                 {"line": [11, 11.5]}, {"curve": [11.5, 11.5, 11.5, 11]},
                 {"line": [11.5, 10]}, {"curve": [11.5, 9.5, 11, 9.5]},
                 {"line": [10.5, 9.5]}]
            ];
            
            Object.prototype.clone = function () {
                var i, newObj = (this instanceof Array) ? [] : {};
                for (i in this) {
                    if (i === 'clone') {
                        continue;
                    }
                    if (this[i] && typeof this[i] === "object") {
                        newObj[i] = this[i].clone();
                    } else {
                        newObj[i] = this[i];
                    }
                }
                return newObj;
            };