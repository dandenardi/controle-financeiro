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


    window.location.reload();
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
    var balanceWithoutSignal = Math.abs(balance);
    var balanceInBrl = convertNumber(balanceWithoutSignal);
    

    if (isEmpty){
        document.getElementById('statementTitle').innerHTML = "Não existem transações cadastradas";    
    }else{
        //apresenta as transacoes
        document.getElementById('statementTitle').innerHTML = "Extrato de Transações";
        document.querySelector('.transactions>thead').innerHTML =
        //desenha só o head
        `<tr>
            <td>

            </td>
            <td>
                Mercadoria
            </td>
            <td>
                Valor
            </td>
        </tr>`

        for (var transaction in transactions){

            if( transactions[transaction].kind == 'compra') {
                var tipo = '-';
            }else{
                var tipo = '+';
            }
            document.querySelector('.transactions>tbody').innerHTML +=
            //desenha cada transacao
        
            `<tr>
                <td>
                    ${tipo}
                </td>    
                <td>
                    ${transactions[transaction].name}
                </td>
                <td>
                    ${transactions[transaction].value}
                </td>
                
            </tr>`
        }
        var balanceId = document.getElementById('balance');
        //var balanceStatus = document.getElementById('balancestatus').innerHTML;
        if(balance < 0){
            balanceId.style.color = 'red';
            //balanceStatus = 'Prejuizo!';
        }else{
            balanceId.style.color = 'blue';
            //balanceStatus = 'Lucro!';
        }

        document.querySelector('.transactions>tfoot').innerHTML =
        //desenha o rodape que consiste no saldo
        `<tfoot>
                <tr>
                    <td id="balancestatus">
                        ${isLoss ? '-' : '+'}
                    </td>
                    <td>
                        Total
                    </td>
                    <td>
                        ${balanceInBrl}
                    </td>
                </tr>
        </tfoot>`;
    
    };    
    
    //Saldo final com destaque para lucro ou prejuizo
    //atualizar a lista com extrato ja com o calculo atualizado (feito!)
    handleStorage();
};
   
   
function calculateBalance(transactions){
    //funcao que calcula o saldo
    
    var balance = 0;
    
    for (var transaction in transactions){
        transactions[transaction].value = (transactions[transaction].value).replace(',','.');
        //substitui ',' por '.' (padrao britanico/americano)
        transactions[transaction].value = (transactions[transaction].value).replace('.','');
        //substitui '.' por '' (padrao brasileiro inclui . no milhar que e considerado separador de decimal no britanico/americano)
        console.log(transactions[transaction].value);
        transactions[transaction].value = parseFloat(transactions[transaction].value).toFixed(2);
        console.log(transactions[transaction].value);
        //converte para numero real
        

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
    var valuePattern = /[0-9.,]/g; 
    
    if (valuePattern.test(e.key)){
        e.target.value += e.key;
        /* if (e.key == ','){
            (e.key).replace(',','.');
        } */
        //tentei fazer com que a virgula fosse substituida pelo ponto logo quando o usuario inserisse. Nao funcionou...
        //o ideal e que o usuario nao possa incluir pontos ou virgulas e que isso seja adicionado automaticamente
        var formatedNumber = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(e.target.value);
    }

    
    console.log(formatedNumber);

} 

function toBrCurrency(e){
    //funcao funciona bem, mas tem o mesmo problema...
    var valueWithComma = e.target.value;
    newValue = valueWithComma.replace(',', '.');
    var newValue = parseFloat(e.target.value);

    var convertedValue = newValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    e.target.value = convertedValue;
    return e.target.value;
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
        
        var variableWithoutDot = variable.replace('.','');
        var variableClean = variableWithoutDot.replace(',','.');
        convertedVariable = parseFloat(variableClean).toFixed(2);

    }else{
        //neste caso a entrada eh um numero tipo float
        convertedVariable = variable.toLocaleString('pt-BR');
    }
    
    return convertedVariable;
}

function setStyleOfBalance(balance){
    
    var balanceSelector = document.getElementsByClassName('.balance');
    //var balanceProperties = getComputedStyle(balanceSelector);
    
    if(balance < 0) {
         //Esta ocorrendo prejuizo
      balanceSelector.style.color = ('red');
         return;

    }if(balance > 0){
        //Esta ocorrendo lucro
        balanceSelector.style.color = ('green');
        return;
    }
}

showTransactions();

