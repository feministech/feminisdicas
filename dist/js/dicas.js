const DIRETORIOS_ROOT_ELEMENT_ID = '#section-diretorios';
/**
 * Obtém automaticamente os arquivos contidos em /dicas e os identifica como diretórios
 */
function obtemDiretorios() {
    return fetch('/dicas', {
        headers: [['Content-type', 'text/html']]
    // extrai o texto da página
    }).then(
        (data) => data.text()
    // manipula a string para obter a arvore HTML que lista os diretórios
    ).then(
        (text) => {
            const dicasBodyContent = text
                .replace(/\n/g, '')
                .replace(/\s{2,}/g, '')
                .replace(/^.*<body.*?>(.*?)<\/body>.*$/, '$1');
            const virtualDOM = document.createElement('div');
            virtualDOM.innerHTML = dicasBodyContent;
            let files = virtualDOM.querySelectorAll('li');
            // o primeiro filho é sempre um elemento vazio de retorno
            [_, ...files] = files;
            // extrai apenas o dado importante, o nome do arquivo
            files = files.map(( file ) => file.firstChild.firstChild.innerText.replace('.md', ''))
            return files;
        }
    );
}

/**
 * Pega uma lista de diretórios e transforma em HTML para renderizar como navegação
 * @param {Array<string>} diretorios - ex: [github.md, javascript.md]
 * @returns 
 */
function renderizaDiretorios(diretorios) {
    const navElements = diretorios.map(diretorio => {
        const navElement = document.createElement('nav');
        navElement.innerHTML = `<a href="/${diretorio}">Dicas de ${diretorio[0].toUpperCase()+diretorio.substring(1)}</a>`;
        return navElement;
    });
    const diretorioRootElement = document.querySelector(DIRETORIOS_ROOT_ELEMENT_ID);
    navElements.forEach((element) => diretorioRootElement.appendChild(element));
}

/**
 * Assim que o arquivo é carregado, os diretórios são lidos e renderizados
 */
function onLoad() {
    obtemDiretorios()
        .then(renderizaDiretorios)
    ;
}