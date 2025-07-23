const apiKeyInput = document.getElementById("apiKey")
const questionInput = document.getElementById("question")
const respostaInput = document.getElementById("aiResponse")
const form = document.getElementById("form")
const buttonClick = document.getElementById("ask")
const gameSelect = document.getElementById("gameSelect")

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async (question,game,apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    let pergunta;

    if (game == "futebol") { pergunta = `
        ## Especialidade
        Você é um especialista no esporte futebol

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento de futebol, taticas, times, campeonatos e regras do esporte

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada com futebol, responda com 'Essa pergunta não está relacionada a futebol'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre os campeonatos, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda sobre assuntos que você não tenha certeza de que existem no futebol.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 800 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
        - Responda sempre em portugues, a não ser que o usuario não peça em outra lingua

        ## Exemplo de respostas
        pergunta do usuário: proximo jogo do gremio
        resposta: A data do proximo jogo do Gremio é: \n\n **Jogos:**\n\n coloque a data,o adversario e o campeonato aqui.\n\ncontinue colocando ate fechar os cinco proximos jogos\n\n
        pergunta do usuário: proximo Melhor jogador do Mirassol
        resposta: O melhor jogador do Mirassol é o **nome do Jogador** \n\n coloque estasticas dele linha por linha\n\n coloque o porque ele é o melhor\n\n
        
        ---
        
        Aqui está a pergunta do usuário: ${question}`   
        } else if (game == "volei") { pergunta = `
        ## Especialidade
        Você é um especialista no esporte volei

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento de volei, taticas, times, campeonatos e regras do esporte

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada com volei, responda com 'Essa pergunta não está relacionada a volei'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre os campeonatos, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda sobre assuntos que você não tenha certeza de que existem no volei.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 800 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
        - Responda sempre em portugues, a não ser que o usuario não peça em outra lingua

        ## Exemplo de respostas
        pergunta do usuário: proximo jogo do Brasil
        resposta: A data do proximo jogo do Brasil é: \n\n **Jogos:**\n\n coloque a data,o adversario e o campeonato aqui.\n\ncontinue colocando ate fechar os cinco proximos jogos\n\n
        pergunta do usuário: proximo Melhor jogador da Italia
        resposta: O melhor jogador do Italia é o **nome do Jogador** \n\n coloque estasticas dele linha por linha\n\n coloque o porque ele é o melhor\n\n
        
        ---
        
        Aqui está a pergunta do usuário: ${question}` 
        } else if (game == "basquete") { pergunta = `
        ## Especialidade
        Você é um especialista no esporte basquete

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento de basquete, taticas, times, campeonatos e regras do esporte

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada com basquete, responda com 'Essa pergunta não está relacionada a basquete'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre os campeonatos, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda sobre assuntos que você não tenha certeza de que existem no basquete.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 800 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
        - Responda sempre em portugues, a não ser que o usuario não peça em outra lingua

        ## Exemplo de respostas
        pergunta do usuário: proximo jogo do brooklyn nets
        resposta: A data do proximo jogo do brooklyn nets é: \n\n **Jogos:**\n\n coloque a data,o adversario e o campeonato aqui.\n\ncontinue colocando ate fechar os cinco proximos jogos\n\n
        pergunta do usuário: proximo Melhor jogador do Chicago Bulls
        resposta: O melhor jogador do Chicago Bulls é o **nome do Jogador** \n\n coloque estasticas dele linha por linha\n\n coloque o porque ele é o melhor\n\n
        
        ---
        
        Aqui está a pergunta do usuário: ${question}
    ` 
        } else {
            alert("Selecione um esporte válido!")
        }

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    const response = await fetch(geminiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents,
            tools
        })
    }) 
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const sendForm = async (event) => {
    event.preventDefault()
    // previne que o evento faca o padrao, nesse caso dar reload na pagina qnd apertar no botao
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if(apiKey == "" || question == ""){
        alert("Por favor, preencha os campos!")
        return
    }
    
    aiResponse.classList.add("hidden")

    buttonClick.disabled = true
    buttonClick.textContent = "Asking..."
    buttonClick.classList.add("loading")

    try {
        const text = await perguntarAI(question,game,apiKey)
        aiResponse.querySelector(".response-content").innerHTML = markdownToHTML(text)
        aiResponse.classList.remove("hidden")

    } catch(error) {
        console.log("Erro: ", error) 
    } finally {
        buttonClick.disabled = false
        buttonClick.textContent = "Ask"
        buttonClick.classList.remove("loading")
    }



}
form.addEventListener("submit",sendForm)
