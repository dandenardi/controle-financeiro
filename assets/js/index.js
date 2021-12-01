//funcao que fica responsavel por converter os dados obtidos de localStorage


function handleStorage(){
    var transactionsRaw = localStorage.getItem('transactions'); //pegando o objeto de itens do localstorage de forma crua (string)
    if (transactionsRaw != null){
        //caso existam itens em localstorage
        var transactions = JSON.parse(transactionsRaw) //converte de string para o dado interpretado por JSON
    } else {
        var transactions = [];
        //senao, cria um array vazio 
    }

    return transactions;
}
    
//incluir transacoes de compra ou venda de mercadoria (feito!)
function handleExchange(e){
    //Ao inserir transacao salvar em local storage (feito!)
    e.preventDefault();
    var transactions = handleStorage();

    transactions.push({
        
        name: e.target.elements['merch-name'].value,
        value: e.target['merch-value'].value,
        kind: e.target.elements['transaction-type'].value,
    });
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    e.target.elements['merch-name'].value = '';
    e.target.elements['merch-value'].value = '';

    showTransactions();
    return false;
    //atualiza a tabela com todas as transacoes
}

//Criar um extrato das transacoes incluidas na ordem que foram inseridas (feito!)
function showTransactions() {

    var rawTransactions = handleStorage();
    var isEmpty = rawTransactions.length == 0;
    var transactions = rawTransactions.reverse();
    console.log(transactions);
    var balance = calculateBalance(transactions);
    var isLoss = (balance < 0);
    var balanceInBrl = convertNumber(balance);
    

    if (isEmpty){
        document.getElementById('statementTitle').innerHTML = "Não existem transações cadastradas";    
    }else{
        //apresenta as transacoes
        document.getElementById('statementTitle').innerHTML = "Extrato de Transações";
        document.querySelector('.transactions>thead').innerHTML =
        //desenha só o head
        `<tr>
            <td class='signal'>

            </td>
            <td class="left-content">
                Mercadoria
            </td>
            <td class="right-content">
                Valor
            </td>
        </tr>`

        cleanTable();
        //limpa a tabela para ser redesenhada
        for (var transaction in transactions){

            if( transactions[transaction].kind == 'compra') {
                var tipo = '-';
            }else{
                var tipo = '+';
            }
            document.querySelector('.transactions>tbody').innerHTML +=
            //desenha cada transacao
        
            `<tr>
                <td class='signal'>
                    ${tipo}
                </td>    
                <td class="left-content">
                    ${transactions[transaction].name}
                </td>
                <td class="right-content">
                    ${transactions[transaction].value}
                </td>
                
            </tr>`
        }
        
        document.querySelector('.transactions>tfoot').innerHTML =
        //desenha o rodape que consiste no saldo
        `<tfoot>
                <tr>
                    <td>
                        ${isLoss ? '-' : '+'}
                    </td>
                    <td>
                        Total
                    </td>
                    <td class='right-content' class='signal'>
                        ${balanceInBrl}
                    </td>
                </tr>
                <tr>
                    <td class="indicator"></td>
                    <td class="indicator"></td>
                    <td class="indicator">${isLoss ? '<small>(prejuízo)</small>' : '<small>(Lucro)</small>'}</td>
                </tr>
        </tfoot>`;
    
    };    
    
    //Saldo final com destaque para lucro ou prejuizo
    //atualizar a lista com extrato ja com o calculo atualizado (feito!)
    
};

function cleanTable(){
    //limpa a tabela para ser redesenhada
    var transactions = handleStorage(); 
    
    for (var transaction in transactions){

        if( transactions[transaction].kind == 'compra') {
            var tipo = '-';
        }else{
            var tipo = '+';
        }
        document.querySelector('.transactions>tbody').innerHTML += '';
        //desenha cada transacao
    
    }
}

function editTransactionsValue(){
    var transactions = handleStorage();
    

    for (var transaction in transactions){
        var transactionValue = transactions[transaction].value;

        transactionValue = transactionValue.replace('.','');
        transactionValue = transactionValue.replace(',','.');

        transactionValue = parseFloat(transactionValue);
        transactions[transaction].value = transactionValue;

    }
}   
   
function calculateBalance(transactions){
    //funcao que calcula o saldo
    
    var transactions = handleStorage();

    var balance = 0;
    
    for (var transaction in transactions){
        var transactionValue = transactions[transaction].value;
        
        transactionValue = transactionValue.replaceAll('.','');
        transactionValue = transactionValue.replaceAll(',','.');

        transactionValue = parseFloat(transactionValue);
        transactions[transaction].value = transactionValue;
        console.log(transactions[transaction].value);
        if (transactions[transaction].kind == 'compra'){
            balance -= transactions[transaction].value;
            //caso seja compra, subtrai
        }else{
            balance += transactions[transaction].value;
        }

    }
    
    console.log(balance);
    return(balance);

}
//validacao de formulario


 function validateFields(e){
    //validacoes funcionam, porem o usuario so consegue colocar centavos mediante ponto. Virgula faz a funcao retornar NAN
    e.preventDefault();
    var valuePattern = /[0-9,.]/g; 
    var userNumber = e.target.value;
      if (valuePattern.test(e.key)){
        //so aceita numeros, ponto e virgula
        e.target.value += e.key;
        //o ideal e que o usuario nao possa incluir pontos ou virgulas e que isso seja adicionado automaticamente
    }

}

function toBrCurrency(e){
    //funcao funciona bem, mas tem o mesmo problema (nao identifica virgula como separador de decimal)...
    var number = e.target.value;
    number = parseFloat(number);
    convertedValue = number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    e.target.value = convertedValue;

    return convertedValue;
}

//Acao limpar dados (onclick) deve apresentar mensagem de confirmacao (feito!),
//apagar informacoes e atualizar a lista (feito!)
function cleanData(){
    

    if(confirm('Você está prestes a limpar todas as transações. Confirma?')){
        localStorage.clear();
    }else{
        alert('Operação cancelada. Os dados permanecem como estavam!')
    };

    location.reload();
}

//Se string, converte para numero Real ou se numero real converte para formato BRL
function convertNumber(variable){

    var typeOfVariable = typeof variable;
    var convertedVariable;

    //conve
    if (typeOfVariable == 'string'){
        
        var variableWithoutDot = variable.replaceAll('.','');
        var variableClean = variableWithoutDot.replaceAll(',','.');
        var variableInFloat = parseFloat(variableClean);
        console.log(typeof variableInFloat);
        var variableLimited = (variableInFloat).toFixed(2);
        variableInFloat = parseFloat(variableLimited);
        convertedVariable = variableInFloat;

    }else{
        //neste caso a entrada eh um numero tipo float
        convertedVariable = variable.toLocaleString('pt-BR');
    }
    
    return convertedVariable;
}

showTransactions();


