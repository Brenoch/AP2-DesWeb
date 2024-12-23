const url = "https://botafogo-atletas.mange.li/2024-1/";

const container = document.getElementById("container");
const paginaLogin = document.getElementById("pagina-login");
const paginaProtegida = document.getElementById("pagina-protegida");
const inputBusca = document.getElementById("busca");

let jogadoresAtuais = [];
let generoSelecionado = null;

const carregarConteudoProtegido = (genero) => {
    generoSelecionado = genero;

    pega_json(`${url}${genero}`).then((jogadores) => {
        jogadoresAtuais = jogadores;
        if (jogadoresAtuais.length > 0) {
            atualizarJogadores(jogadoresAtuais);
            container.style.display = "flex";
        } else {
            container.style.display = "none";
            exibirMensagemErro("Nenhum jogador encontrado para o gênero selecionado.");
        }
    }).catch(() => {
        exibirMensagemErro("Erro ao carregar os dados. Por favor, tente novamente mais tarde.");
    });
};

const atualizarJogadores = (jogadores) => {
    container.innerHTML = "";

    const totalJogadores = Math.ceil(jogadores.length / 5) * 5;

    for (let i = 0; i < totalJogadores; i++) {
        if (i < jogadores.length) {
            container.appendChild(montaCard(jogadores[i]));
        } else {
            container.appendChild(criaPlaceholder());
        }
    }
};

const exibirMensagemErro = (mensagem) => {
    container.innerHTML = `<div style="color: red; text-align: center; margin-top: 20px;">${mensagem}</div>`;
    container.style.display = "block";
};

const manipulaCLick = (e) => {
    const id = e.currentTarget.dataset.id;
    const redirecionaUrl = `atleta.html?id=${id}`;

    localStorage.setItem("id", id);
    localStorage.setItem("dados", JSON.stringify(e.currentTarget.dataset));
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("dados", JSON.stringify(e.currentTarget.dataset));

    window.location.href = redirecionaUrl;
};

const pega_json = async (caminho) => {
    try {
        const resposta = await fetch(caminho);
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.error("Erro ao buscar JSON:", error);
        throw error;
    }
};

const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const detalhes = document.createElement("p");

    nome.innerText = atleta.nome;
    nome.style.fontFamily = "sans-serif";
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    imagem.alt = atleta.nome;
    cartao.appendChild(imagem);

    cartao.appendChild(detalhes);

    cartao.dataset.id = atleta.id;
    cartao.dataset.nJogos = atleta.n_jogos;

    cartao.onclick = manipulaCLick;

    return cartao;
};

const criaPlaceholder = () => {
    const placeholder = document.createElement("article");
    placeholder.style.visibility = "hidden";
    placeholder.style.pointerEvents = "none";
    return placeholder;
};

const handleInputChange = () => {
    const termoBusca = inputBusca.value.toLowerCase().trim();

    const jogadoresFiltrados = jogadoresAtuais.filter(
        (jogador) =>
            jogador.nome.toLowerCase().includes(termoBusca) ||
            String(jogador.id).includes(termoBusca)
    );

    if (jogadoresFiltrados.length > 0) {
        atualizarJogadores(jogadoresFiltrados);
        container.style.display = "flex";
    } else {
        container.style.display = "none";
    }
};

const manipulaBotao = () => {
    const texto = document.getElementById("senha").value;
    if (hex_sha256(texto) === "0f9635f18ff292e7e7db650e1157ca2a8d3a0a90483a5ad53ce64571c11918be") {
        sessionStorage.setItem("logado", "true");
        inicializarPaginaProtegida();
    } else {
        alert("Senha incorreta");
    }
};

const manipulaLogout = () => {
    sessionStorage.removeItem("logado");
    location.reload();
};

const inicializarPaginaProtegida = () => {
    if (sessionStorage.getItem("logado") === "true") {
        paginaLogin.style.display = "none";
        paginaProtegida.style.display = "block";
        container.style.display = "none";
    } else {
        paginaLogin.style.display = "block";
        paginaProtegida.style.display = "none";
        container.style.display = "none";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    inicializarPaginaProtegida();

    document.getElementById("botao").onclick = manipulaBotao;
    document.getElementById("logout").onclick = manipulaLogout;

    document.getElementById("masculino").addEventListener("click", () => {
        carregarConteudoProtegido("masculino");
    });

    document.getElementById("feminino").addEventListener("click", () => {
        carregarConteudoProtegido("feminino");
    });

    document.getElementById("todos").addEventListener("click", () => {
        carregarConteudoProtegido("all");
    });

    inputBusca.addEventListener("input", handleInputChange);
});
