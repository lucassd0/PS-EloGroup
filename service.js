/**
* Função para realizar o cálculo do dígito verificador do CPF.
* @param {String} strCPF - CPF digitado pelo usuário.
* @return {Boolean} Retorna 'true' caso o CPF seja válido, e 'false' caso contrário.
*///
const validaCpf = (strCPF) => {
   var soma
   var resto
   soma = 0

   if (strCPF == "00000000000"){
      return false
   }

   // Validação pelo primeiro dígito verificador
   for(let i = 1; i <= 9; i++){
      soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i)
   }
   resto = (soma * 10) % 11

   if ((resto == 10) || (resto == 11)){
      resto = 0
   }

   if (resto != parseInt(strCPF.substring(9, 10)) ){
      return false
   }

   soma = 0

   // Validação pelo segundo dígito verificador
   for (i = 1; i <= 10; i++){
      soma = soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
   }
   resto = (soma * 10) % 11

   if ((resto == 10) || (resto == 11)){
      resto = 0
   }

   if (resto != parseInt(strCPF.substring(10, 11) ) ){
      return false
   }

   return true
}

/**
* Função para realizar a validação dos dados de entrada (valor e CPF).
* @param {lancamento} lancamento - Objeto (lancamento) contendo os valores digitados pelo usuário.
* @return {String} Retorna mensagens de validação, caso uma ou mais regras não sejam atendidas.
* @return {null} Retorna 'null', caso todos os valores estiverem em conformidade com as validações.
*///
const validarEntradaDeDados = (lancamento) => {

   let mensagemValidacao = ""
   const inputCpf = lancamento.cpf 
   const inputValor = lancamento.valor

   if(inputCpf){
      //Verifica se CPF possui apenas caracteres numéricos (por meio da tabela ASCII)
      for(let i = 0; i < inputCpf.length; i++){
         const codeValue = inputCpf.charCodeAt(i)
         if(codeValue < 48 || codeValue > 57){
            mensagemValidacao = mensagemValidacao.concat("CPF deve conter apenas caracteres numéricos.\n")
            break
         }
      }
   
      //Valida os dígitos verificadores do CPF
      if(!validaCpf(inputCpf)){
         mensagemValidacao = mensagemValidacao.concat("Os dígitos verificadores do CPF devem ser válidos.\n")
      }
   }else{
      mensagemValidacao = mensagemValidacao.concat("CPF deve conter apenas caracteres numéricos.\n")
   }

   //Checa se o valor é numérico
   if(!inputValor){
      mensagemValidacao = mensagemValidacao.concat("Valor deve ser numérico.\n")
   }else{
      //Checa se o valor é inferior a -2000,00
      if(inputValor < -2000){
         mensagemValidacao = mensagemValidacao.concat("Valor não pode ser inferior a -2000,00.\n")
      }

      //Checa se o valor é superior a 15000,00
      if(inputValor > 15000){
         mensagemValidacao = mensagemValidacao.concat("Valor não pode ser superior a 15000,00.\n")
      }
   }

   //Checa se houve alguma regra não atendida
   if(mensagemValidacao != ""){
      return mensagemValidacao
   }

   return null
}

/**
* Função para agrupar os valores por CPF.
* @param {lancamento} lancamentos - Todos os lançamentos registrados.
* @return {Array} Retorna um array de objetos, no qual as chaves são os CPF's e o conteúdo seus valores associados.
*///
const groupByCpf = (lancamentos) => {
   const groupedCpf = lancamentos.reduce((group, lancamento) => {
      //Desestruturando o objeto lancamento
      const { cpf, valor } = lancamento
      //Criando/Recuperando posição relativa ao cpf da posição atual do array lancamentos
      group[cpf] = group[cpf] ?? []
      //Adiciona o valor associado ao cpf na posição correta
      group[cpf].push(valor)
      return group
    }, {})

   return groupedCpf
}

/**
* Função para recuperar os saldos de todas contas registradas.
* @param {lancamento} lancamentos - Todos os lançamentos registrados.
* @return {Array} Retorna um array contendo em cada linha um CPF e o valor do respectivo saldo, ordenados na sequência em foram adicionados pelo usuário.
*///
const recuperarSaldosPorConta = (lancamentos) => {
   let valoresPorConta = groupByCpf(lancamentos)

   //Cálculo do saldo por conta
   let saldosPorConta = Object.keys(valoresPorConta).map(valor => {
      return {
         cpf: valor,
         valor: valoresPorConta[valor].reduce((sum, x) => sum + x, 0)
      }
   })
   return saldosPorConta
}

/**
* Função para recuperar o maior e menor lançamentos do CPF especificado.
* @param {String} cpf - CPF já validado, somente com números.
* @param {lancamento} lancamentos - Todos os lançamentos registrados.
* @return {Array} Retorna um array contendo, no máximo, dois registros, sendo um deles com o maior e outro com o menor valor lançado para o CPF recebido como parâmetro.
*///
const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
   let valoresPorConta = groupByCpf(lancamentos)
   const maiorMenorLancamentos = []

   //Recupera a conta do CPF especificado
   conta = valoresPorConta[cpf]

   //Instancia o lancamento minimo
   const lancamento_min = { 
      cpf: cpf, 
      valor: Math.min(...conta)
   }
   maiorMenorLancamentos.push(lancamento_min)  

   //Instancia o lancamento maximo
   const lancamento_max = { 
      cpf: cpf, 
      valor: Math.max(...conta)
   } 
   maiorMenorLancamentos.push(lancamento_max)  
   
   return maiorMenorLancamentos
}

/**
* Função para recuperar os três registros com maiores saldos.
* @param {lancamento} lancamentos - Todos os lançamentos registrados.
* @return {Array} Retorna um array contendo, no máximo, três registros correspondentes aos CPFs com maiores saldos, ordenados do maior para o menor valor.
*///
const recuperarMaioresSaldos = (lancamentos) => {
   let valoresPorConta = groupByCpf(lancamentos)

   //Cálculo do saldo por conta
   let saldosPorConta = Object.keys(valoresPorConta).map(valor => {
      return {
         cpf: valor,
         valor: valoresPorConta[valor].reduce((sum, x) => sum + x, 0)
      }
   })

   //Ordena do maior pro menor saldo
   saldosPorConta.sort((a, b) => {
      return b.valor - a.valor
   })

   //Resgata os 3 maiores saldos 
   const maioresSaldos = saldosPorConta.slice(0, 3)

   return maioresSaldos
}

/**
* Função para recuperar os três registros com maiores saldos médios.
* @param {lancamento} lancamentos - Todos os lançamentos registrados.
* @return {Array} Retorna um array contendo, no máximo, três registros correspondentes aos CPFs com maiores saldos médios, ordenados do maior para o menor valor.
*///
const recuperarMaioresMedias = (lancamentos) => {
   let valoresPorConta = groupByCpf(lancamentos)

   //Cálculo da média por conta
   let mediasPorConta = Object.keys(valoresPorConta).map(valor => {
      let size = valoresPorConta[valor].length
      return {
         cpf: valor,
         valor: (valoresPorConta[valor].reduce((sum, x) => sum + x, 0))/size
      }
   })

   //Ordena da maior pra menor media
   mediasPorConta.sort((a, b) => {
      return b.valor - a.valor
   })

   //Resgata as 3 maiores medias
   const maioresMedias = mediasPorConta.slice(0,3)

   return maioresMedias
}
