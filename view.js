export default class View {

    $= {}

    constructor() { 
        this.$.menuBtn = this.#qs(".menu-btn");
        this.$.menuList = this.#qs(".menu .items");
        this.$.resetBtn = this.#qs("#reset-btn");
        this.$.playAgainBtn = this.#qs("#play_again-btn");
        this.$.newRoundBtn = this.#qs("#new_round-btn");
        this.$.squares = this.#qsAll(".square");
        this.$.scoreTies = this.#qs("#score-tie");
        this.$.scoreP1 = this.#qs("#score-p1");
        this.$.scoreP2 = this.#qs("#score-p2");
        this.$.turn = this.#qs(".turn");
        this.$.modal = this.#qs(".modal");
        this.$.modalText = this.#qs(".modal p");

        // UI Only

        this.$.menuBtn.addEventListener("click", (event) => {
            this.#toggleMenu()
        });
    }

    // register event listeners

    bindGameResetEvent(handler){
        this.$.resetBtn.addEventListener("click", handler);
        this.$.playAgainBtn.addEventListener("click", handler);
    }

    bindNewRoudEvent(handler){
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindPlayerMoveEvent(handler){
        this.$.squares.forEach((square) => {
            square.addEventListener("click", () => handler(square))
        });
    }

    // helper methods

    updateScoreboard(p1Wins, p2Wins, ties){
        this.$.scoreTies.innerHTML = ties ? ties : 0
        this.$.scoreP1.innerHTML = `${p1Wins} Wins`
        this.$.scoreP2.innerHTML = `${p2Wins} Wins`
    }

    hideAll(){
        this.#hideMenu()
        this.#hideModal()
    }

    setTurnIndicator(player){
        this.$.turn.innerHTML = "";

        this.$.turn.appendChild(this.#createIcon(player))

        let p = document.createElement("p");
        p.classList.add(player.color);
        p.innerText = `${player.name}, you'r up!`;
        this.$.turn.appendChild(p);
    }

    initializeMoves(moves){
        moves.forEach(move => {
            this.handlerPlayerMove(this.$.squares[move.squareId - 1], move.player)
        })
    }
    
    resetSquares(){
        this.$.squares.forEach((square) => {
          square.innerHTML = "";
        });
    };

    handlerPlayerMove(square, player){
        square.appendChild(this.#createIcon(player));
    }

    
    revealModal(winner){
        this.$.modalText.innerHTML = winner ? `${winner.name} Wins!` : "It's a Tie"
        this.$.modal.classList.remove("hidden");
    }

    #createIcon(player){
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.icon, player.color);
        return icon
    }

    #hideModal(){
        this.$.modal.classList.add("hidden");
    }

    #hideMenu() {
        this.$.menuList.classList.add("hidden")
        this.$.menuBtn.classList.remove("border")

        const icon = this.$.menuBtn.querySelector("i")

        icon.classList.add('fa-chevron-down')
        icon.classList.remove('fa-chevron-up')
    }

    #toggleMenu() {
        this.$.menuList.classList.toggle("hidden")
        this.$.menuBtn.classList.toggle("border")

        const icon = this.$.menuBtn.querySelector("i")

        icon.classList.toggle('fa-chevron-down')
        icon.classList.toggle('fa-chevron-up')
    }

    #qs(selector, parent) {
        const el = parent 
        ? parent.querySelector(selector)
        : document.querySelector(selector)

        if(!el) throw new Error("could not find elements")

        return el
    }

    #qsAll(selector) {
        const elList = document.querySelectorAll(selector)

        if(!elList) throw new Error("could not find elements")

        return elList
    }
    
}