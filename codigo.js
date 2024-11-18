const url = "https://botafogo-atletas.mange.li/2024-1/";

const container = document.getElementById("container");
const paginaLogin = document.getElementById("pagina-login");
const paginaProtegida = document.getElementById("pagina-protegida");


const carregarConteudoProtegido = (genero) => {
    paginaLogin.style.display = "none";
    paginaProtegida.style.display = "";
    container.style.display = "";

    pega_json(`${url}${genero}`).then((jogadores) => {
        container.innerHTML = "";
        jogadores.forEach((jogador) => container.appendChild(montaCard(jogador)));
    });
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
        return [];
    }
};


const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const descricao = document.createElement("p");

    nome.innerText = atleta.nome;
    nome.style.fontFamily = "sans-serif";
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    imagem.alt = atleta.nome;
    cartao.appendChild(imagem);

    descricao.innerHTML = atleta.detalhes;
    cartao.appendChild(descricao);

    cartao.dataset.id = atleta.id;
    cartao.dataset.nJogos = atleta.n_jogos;

    cartao.onclick = manipulaCLick;

    return cartao;
};


const manipulaBotao = () => {
    const texto = document.getElementById("senha").value;
    if (hex_sha256(texto) === "0f9635f18ff292e7e7db650e1157ca2a8d3a0a90483a5ad53ce64571c11918be") {
        sessionStorage.setItem("logado", "true");
        alert("Login bem-sucedido!");
        carregarConteudoProtegido("feminino");
    } else {
        alert("Senha incorreta");
    }
};


const manipulaLogout = () => {
    sessionStorage.removeItem("logado");

    paginaProtegida.style.display = "none";
    paginaLogin.style.display = "";

    location.reload();
};


const verificalogin = () => {
    if (sessionStorage.getItem("logado") === "true") {
        carregarConteudoProtegido("feminino");
    } else {
        paginaLogin.style.display = "";
        paginaProtegida.style.display = "none";
    }
};


document.addEventListener("DOMContentLoaded", () => {
    paginaLogin.style.display = "";
    paginaProtegida.style.display = "none";

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

    verificalogin();
});
