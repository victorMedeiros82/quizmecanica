const questions = [
    {
        question: "Qual é o líquido responsável pela lubrificação do motor?",
        options: ["Óleo do motor", "Água do radiador", "Combustível", "Fluido de freio"],
        correct: 0
    },
    {
        question: "Qual é a função principal do sistema de arrefecimento de um veículo?",
        options: ["Resfriar o motor", "Aquecer o interior do veículo", "Aumentar a potência do motor", "Controlar a emissão de poluentes"],
        correct: 0
    },
    {
        question: "Qual é o componente responsável por transformar a energia química do combustível em energia mecânica no motor?",
        options: ["Vela de ignição", "Bobina de ignição", "Pistão", "Distribuidor"],
        correct: 2
    },
    {
        question: "Qual é a função do sistema de freios de um veículo?",
        options: ["Acelerar o veículo", "Mudar a direção do veículo", "Diminuir a velocidade do veículo", "Desligar o motor"],
        correct: 2
    },
    {
        question: "Qual é o sistema responsável por converter a energia química do combustível em energia elétrica para alimentar os componentes elétricos do veículo?",
        options: ["Sistema de ignição", "Sistema de arrefecimento", "Sistema de alimentação de combustível", "Sistema elétrico"],
        correct: 3
    },
    {
        question: "Qual é o componente responsável por fornecer o movimento de rotação às rodas do veículo?",
        options: ["Embreagem", "Diferencial", "Alternador", "Transmissão"],
        correct: 1
    },
    {
        question: "Qual é a função do sistema de suspensão de um veículo?",
        options: ["Controlar a direção do veículo", "Aumentar a potência do motor", "Absorver os impactos e irregularidades do solo", "Aumentar a eficiência do sistema de freios"],
        correct: 2
    },
    {
        question: "Qual é o componente responsável por transformar a energia mecânica em energia elétrica?",
        options: ["Bateria", "Alternador", "Motor de partida", "Bobina de ignição"],
        correct: 1
    },
    {
        question: "Qual é a função do sistema de direção de um veículo?",
        options: ["Controlar a velocidade do veículo", "Absorver os impactos e irregularidades do solo", "Transmitir o movimento do volante às rodas", "Aumentar a potência do motor"],
        correct: 2
    },
    {
        question: "Qual é o sistema responsável por fornecer a mistura ar-combustível adequada para o funcionamento do motor?",
        options: ["Sistema de ignição", "Sistema de alimentação de combustível", "Sistema de arrefecimento", "Sistema de escapamento"],
        correct: 1
    }

];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 60;
let helpUsed = false;
let remainingHelps = 4;
//função que carrega a proxima pergunta
function loadQuestion() {
    document.getElementById("points").textContent = score;
    helpUsed = false;
    const q = questions[currentQuestion];
    document.getElementById("currentQuestion").textContent = currentQuestion + 1;
    document.getElementById("totalQuestions").textContent = questions.length;
    document.getElementById("question").textContent = q.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = ""; // Limpa as opções anteriores

    // Criação do layout em grade
    const grid = document.createElement("div");
    grid.classList.add("grid-container", "gap-3");

    q.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.classList.add("btn", "button", "grid-item");
        btn.dataset.index = index;
        btn.onclick = () => selectOption(index);
        grid.appendChild(btn);
    });

    optionsDiv.appendChild(grid);
    resetTimer();
}
//função que seleciona a resposta do jogador
function selectOption(index) {
    const buttons = document.querySelectorAll("#options button");

    const correctIndex = questions[currentQuestion].correct;
    buttons.forEach((btn) => (btn.disabled = true)); // Desabilita os botões

    // Define as cores de acordo com a resposta
    if (index === correctIndex) {
        function colorCorrect() {
            buttons[index].classList.add("btn", "btn-success");
            buttons[index].classList.remove("btn-primary");
        }
        setTimeout(colorCorrect, 1500);
        score += 10;
    } else {
        function colorNoCorrect() {
            buttons[index].classList.add("btn", "btn-danger");
            buttons[index].classList.remove("btn-primary");
            buttons[correctIndex].classList.add("btn", "btn-success");
            buttons[correctIndex].classList.remove("btn-primary");
        }
        setTimeout(colorNoCorrect, 1500);
    }

    setTimeout(nextQuestion, 2500); // Aguarda 2 segundos antes de avançar
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

const endGamemodal = new bootstrap.Modal(document.getElementById("endGame-modal"));
function endGame() {
    endGamemodal.show()
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 60;
    document.getElementById("time").textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
        if (timeLeft <= 0) {
            nextQuestion();
        }
    }, 1000);
}

function eliminateOptions(count) {
    const options = Array.from(document.querySelectorAll("#options button"));
    const incorrect = options.filter(
        (btn) => parseInt(btn.dataset.index) !== questions[currentQuestion].correct
    );

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * incorrect.length);
        const btn = incorrect[randomIndex];
        btn.disabled = true;
        btn.classList.add("eliminated");
        incorrect.splice(randomIndex, 1);
    }
}

document.getElementById("skip-btn").onclick = () => {
    const modal = new bootstrap.Modal(document.getElementById("skip-modal"));
    modal.show();
    document.getElementById("confirm-skip").onclick = () => {
        nextQuestion();
        modal.hide();
    }
};
//Função da ajuda
function helpColors() {
    if (helpUsed || remainingHelps <= 0) {
        const modal = new bootstrap.Modal(document.getElementById("helpUsed-modal"));
        modal.show();
    } else {
        const modal = new bootstrap.Modal(document.getElementById("help-modal"));
        modal.show();
        document.querySelectorAll(".help-option").forEach((btn) => {
            btn.classList.add('p-5');
            btn.onclick = () => {
                const eliminations = Math.floor(Math.random() * 3) + 1;
                console.log(eliminateOptions(eliminations));
                remainingHelps--;
                modal.hide();
            };
        });
    }
    if (questions[currentQuestion]) {
        helpUsed = true;
    } else {
        helpUsed = false;
    }
};

let nameIndica = document.getElementById("nameIndica");
const checkBox = document.getElementById("checkIndica");
checkBox.addEventListener("click", function () {
    if (checkBox.checked) {
        nameIndica.classList.remove("d-none");
    } else {
        nameIndica.classList.add("d-none");
    }
});

function validar() {
    const fullName = document.getElementById("fullname");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    return fullName.value === "" || phone.value === "" || email.value === ""; // Retorna true se algum campo estiver vazio
}

document.getElementById("botao-final").onclick = () => {
    if (validar()) {
        endGamemodal.show(); // Mostra o modal se algum campo estiver vazio
        alert("Preencha todos os campos em branco."); // Alerta para o usuário
    } else {
        endGamemodal.hide(); // Oculta o modal se todos os campos estiverem preenchidos
        const agradecimentoModal = new bootstrap.Modal(document.getElementById("agradecimento-modal"));
        agradecimentoModal.show(); // Mostra o modal de agradecimento
    }
};    
    //mascara telefone
    const handlePhone = (event) => {
        let input = event.target
        input.value = phoneMask(input.value)
    }
    
    const phoneMask = (value) => {
        if (!value) return ""
        value = value.replace(/\D/g, '')
        value = value.replace(/(\d{2})(\d)/, "($1) $2")
        value = value.replace(/(\d)(\d{4})$/, "$1-$2")
        return value
    }
    function fecharJanela() { window.close(); }
    function atualizarPagina() { location.reload(); }
    
    // Inicializa o jogo
loadQuestion();
