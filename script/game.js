//Sweet Alert 2 object for pop up confirmation
var confirmObject = {
    title: 'Game Over',
    text: "",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Play again!',
    cancelButtonText: 'Home page'
};

//start button with event listener for Game starting
var startButton = document.getElementById("start");
startButton.addEventListener("click", startGame);


//Game Starting function
function startGame() {
    var container = document.getElementById("container"); //Container for the game
    // var w = document.documentElement.clientWidth;
    // var h = document.documentElement.clientHeight;
    // document.body.style.width = w + "px";
    // document.body.style.height = h + "px";
    // console.log(w);
    // console.log(h);
    if (startButton.parentElement == container) {
        container.removeChild(startButton);
    }
    var numOfItems = 11; // number of Targets/Items/Columns in a row
    var columns = []; //array of columns
    var intialTop = -8; // intial top of any added row
    var targetsDestroyed = 0; //number of targets destroyed
    var winNumTarget = 20; //number of targets destroyed to win
    var lowestTop; //distance of the lowest row from top of container
    var gameOver = {
        win: 1,
        lose: 0
    }; //Enum for detecting loseing or wining
    var seconds = 0; //seconds for timer
    var minutes = 0; //minutes for timer
    var maxminutes = 1; //max number of minutes for game
    // var gametime = maxminutes * 60 * 1000;
    // var setTimeout(() => {}, );

    var playerName = localStorage.getItem("player name"); //getting player name from local storage
    var lastScore = "Last Score : " + localStorage.getItem("last score"); //getting Score from local storage
    classes = ["name", "ontop"];
    var playerElement = createElementAndAddToParent(container, "div", classes, playerName);
    var lastScoreElement = createElementAndAddToParent(container, "div", ["lastScore", "ontop"], lastScore);
    var timerElement = createElementAndAddToParent(container, "div", ["timer", "ontop"], "");
    var scoreElement = createElementAndAddToParent(container, "div", ["score", "ontop"], "score :" + targetsDestroyed);


    function createElementAndAddToParent(parent, tag, classes, text) {
        var element = document.createElement(tag);
        element.classList.add(...classes);
        var txtElement = document.createTextNode(text);
        element.appendChild(txtElement);
        parent.appendChild(element);
        return element;
    }
    var playerName = (".name");

    var gameTimerId = setInterval(() => {
        seconds++;
        if (seconds > 59) {
            minutes++;
            seconds = 0;
        }
        timerElement.innerText = minutes + ":" + seconds;
        if (minutes === maxminutes) {
            endGame(gameOver.lose);
        }
    }, 1000);


    //intiallzing columns as empty
    for (let index = 0; index < numOfItems; index++) {
        columns.push([]);
    }

    //function to add an image to a parent
    function addImage(parent, str) {
        var Image = document.createElement("img");
        Image.classList.add("insiderImage");
        Image.src = str;
        parent.appendChild(Image);
    }

    //a function to create targets with nearly 85% to be a regular target,10% Explosive Target
    //and 5% chance of creating no target then appending them to the container
    var createRow = function() {
        let left = 1;
        for (const iterator of columns) {
            var chance = Math.random();
            // console.log(chance);
            var xTarget = document.createElement("div");
            if (chance < 0.85) {
                // console.log("regularTarget");
                xTarget.classList.add("regularTarget", "target");
                addImage(xTarget, "images/spaceship_2.png");
            } else if (chance < 0.95) {
                // console.log("explosiveTarget");
                xTarget.classList.add("explosiveTarget", "target");
                addImage(xTarget, "images/bomb.png");
            } else {
                left += 9;
                continue;
            }
            container.appendChild(xTarget);
            iterator.push(xTarget);
            xTarget.style.left = left + "%";
            xTarget.style.top = intialTop + "%";
            left += 9;
        }
    }

    //a function that periodically create rows then shifting existing rows down

    var slidinginterval = setInterval(() => {
        createRow();
        var slidingID = setInterval(slideDown, 25);

        var slidingCounter = 0;
        //function to slide/shift down existing rows by 9%
        function slideDown() {
            for (col of columns) {
                for (element of col) {
                    element.style.top = parseFloat(element.style.top) + 0.15 + "%";
                    //console.log(element.style.top);
                }

            }
            slidingCounter += 0.15;
            //reaches 9 in 60 transition (9/60=0.15)
            if (slidingCounter >= 9) {
                clearInterval(slidingID);
                //console.log(slidingCounter);
                slidingCounter = 0;
                checkLosing();
            }
        }

        //a function to check if the player lost after slding down completed
        function checkLosing() {
            lowestTop = parseFloat(columns[0][0].style.top);
            for (i = 1; i < columns.length; i++) {
                if (columns[i].length > 0) {
                    const colLowestTop = parseFloat(columns[i][0].style.top);
                    if (colLowestTop > lowestTop) {
                        lowestTop = colLowestTop;
                    }
                }
            }

            var lowestBottom = lowestTop + 8; /*8% target height*/
            if (lowestBottom > parseFloat(canon.style.top)) {
                //End Game
                //console.log("Loser");
                endGame(gameOver.lose);
            }
        }
    }, 3000);


    var canon = document.createElement("div");
    canon.classList.add("canon");
    container.appendChild(canon);
    //var canonLeft = parseInt(getComputedStyle(canon).left.slice(0, -2));
    var canonLeft = 46; /*8/2 = 4, 50-4=46*/
    canon.style.left = canonLeft + "%";
    canon.style.top = "92%";
    addImage(canon, "images/spaceship.gif");
    var canonMovingFlag = null; //flag to indicate if the canon is currently moving
    var delay = 10;
    var canonMovingCounter = 0;
    var canonPosition = 5; //intial Position of the canon on the screen and index of the column which it aim at
    document.addEventListener("keydown", keydownListener);

    function keydownListener(event) {
        //console.log("key code : " + event.keyCode + " key : " + event.key);
        if (!canonMovingFlag) {
            if (event.keyCode === 32) {
                //space key pressed
                //console.log("yes");
                fire();

            } else if (event.keyCode === 37) {
                //ArrowLeft key pressed

                if (canonLeft > 1) {
                    canonMovingFlag = 1;
                    var canonIntervalID = setInterval(() => {
                        canonLeft -= 0.5;
                        canonMovingCounter++;
                        canon.style.left = canonLeft + "%";
                        //stops when canon moved 9% (18*0.5)
                        if (canonMovingCounter > 17) {
                            clearInterval(canonIntervalID);
                            canonMovingCounter = 0;
                            canonMovingFlag = null;
                        }
                    }, delay);
                    canonPosition--;
                }


            } else if (event.keyCode === 39) {
                //ArrowRight key pressed


                if (canonLeft < 91) {
                    canonMovingFlag = 1;
                    var canonIntervalID = setInterval(() => {
                        canonLeft += 0.5;
                        canonMovingCounter++;
                        canon.style.left = canonLeft + "%";
                        //stops when canon moved 9% to left(18*0.5)
                        if (canonMovingCounter > 17) {
                            clearInterval(canonIntervalID);
                            canonMovingCounter = 0;
                            canonMovingFlag = null;
                        }
                    }, delay);
                    canonPosition++;
                }
            }
        }
    }


    //function to respond tp space key by firing the shell
    function fire() {
        var shell = document.createElement("div");
        //console.log(canon);
        //assigned shellPosition as the canon position may change after firing
        addImage(shell, "images/fireball.png");
        var shellPosition = canonPosition;
        shell.classList.add("shell");
        //place the shell intially above canon, 8% is height of the shell to 
        var shellLeft = parseFloat(canon.style.left);
        shell.style.left = shellLeft + "%";
        var shellTop = parseFloat(canon.style.top) - 8;
        shell.style.top = shellTop + "%";
        container.appendChild(shell);



        var shellIntervalID = setInterval(() => {
            shellTop -= 0.5;
            shell.style.top = shellTop + "%";
            //Check if the column is Empty
            if (columns[shellPosition].length) {
                //no problem is caused if a row is entered while the shell is in it's way(path)
                var targetTop = parseFloat(columns[shellPosition][0].style.top); //8% target's height
                var targetBottom = targetTop + 8; //8% target's height
                if (shellTop <= targetBottom) {
                    clearInterval(shellIntervalID);
                    container.removeChild(shell);
                    destroyTarget(targetTop, shellPosition, 0); //shellTop + height
                    // console.log(targetsDestroyed);
                    // console.log(winNumTarget);

                    if (targetsDestroyed >= winNumTarget) {
                        //End Game
                        // console.log("winner");
                        endGame(gameOver.win);
                    }
                }
            } else if (!shellTop) {
                clearInterval(shellIntervalID);
                container.removeChild(shell);

            }
        }, delay);
    }

    //function to remove target and surronding if explosive target
    //targetposition is the index of the target in column
    function destroyTarget(targetTop, shellPosition, targetposition) {
        targetsDestroyed++;
        scoreElement.innerText = "Score:" + targetsDestroyed;
        // console.log(targetsDestroyed);
        //console.log(columns[shellPosition][targetposition]);
        container.removeChild(columns[shellPosition][targetposition]);
        //check if target is explosive
        if (columns[shellPosition][targetposition].classList.contains("explosiveTarget")) {
            //console.log("explosiveTarget");
            columns[shellPosition].splice(targetposition, 1);
            if (shellPosition > 0) {
                //Destroy Left if existed
                //console.log("Left exists");
                checkAndRemove(shellPosition - 1);
            }
            if (shellPosition < 10) {
                //Destroy Right if existed
                // console.log("Right exists");
                checkAndRemove(shellPosition + 1);
            }
            if (columns[shellPosition].length > 0) {
                //check the above target
                //targetposition now is index of next element in column after removing current element
                //check if the removed element wasn't the highest target(nearset to the top)(last element in column)
                //in other word check if there exist an element after it
                if (targetposition < columns[shellPosition].length) {

                    //console.log("exists above");

                    if (parseFloat(columns[shellPosition][targetposition].style.top) === targetTop - 9) {
                        //      console.log("Entered");

                        destroyTarget(targetTop - 9, shellPosition, targetposition);
                    }
                }
            }
            //checking again as the length might change from previous condition
            if (columns[shellPosition].length > 0) {
                //check the below target
                //targetposition-1 now is index of previous element in column after removing current element
                //check if the removed element was not the lowest target(farethest from the top)(first element in column)
                //in other word check if there exist an element before it
                if (targetposition > 0) {
                    if (parseFloat(columns[shellPosition][targetposition - 1].style.top) === targetTop + 9) {
                        destroyTarget(targetTop + 9, shellPosition, targetposition - 1);

                    }
                }
            }
        } else {
            columns[shellPosition].splice(targetposition, 1);
        }


        // columns[shellPosition].splice(targetposition, 1);
        // removing the shell type 
        function checkAndRemove(shellPosition) {
            for (index = 0; index < columns[shellPosition].length; index++) {
                var temp = parseFloat(columns[shellPosition][index].style.top);
                //console.log("temp = " + temp);
                //console.log(targetTop);
                if (temp === targetTop + 9) {
                    destroyTarget(targetTop + 9, shellPosition, index);
                    //when splicing the next element will have the same positoin as shellPosition
                    index--;
                } else if (temp === targetTop) {
                    destroyTarget(targetTop, shellPosition, index);
                    index--;
                } else if (temp === targetTop - 9) {
                    destroyTarget(targetTop - 9, shellPosition, index);
                    index--;
                    //break;
                }
            }
        }
    }

    //Function to End the game
    function endGame(finshingCode) {
        clearInterval(gameTimerId);
        clearInterval(slidinginterval);
        document.removeEventListener("keydown", keydownListener);
        localStorage.setItem("last score", targetsDestroyed); //storing last score in local storage
        //clearing certain variable for next play
        seconds = 0;
        minutes = 0;
        targetsDestroyed = 0;
        //change title to SWAL
        if (finshingCode === gameOver.win) {
            confirmObject.title = "Winner";
        } else if (finshingCode === gameOver.lose) {
            confirmObject.title = "Better luck next time!";
        }
        //alerting using sweet alert 2 javascript popup libirary
        Swal.fire(confirmObject).then((result) => {
            if (result.value) {
                //removeing the container childrens
                container.innerHTML = "";
                startGame();
            } else {
                //window.location.replace("Home.html");
                window.location.href = "Home.html"; //redirecting to home page
            }
        });

    }
}

// window.addEventListener('load', function() {

// });