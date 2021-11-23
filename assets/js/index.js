//funcao que fica responsavel por converter os dados obtidos de localStorage
function handleStorage(){
    var transactionsRaw = localStorage.getItem('transactions'); //pegando o item do localstorage de forma crua (string)
    if (transactionsRaw != null){
        var transactions = JSON.parse(transactionsRaw) //convertendo de string para o dado propriamente dito
    } else {
        var transactions = [];
    }

    return transactions;
}
    
//incluir transacoes de compra ou venda de mercadoria
function handleExchange(e){
    //Ao inserir transacao salvar em local storage e (feito!)
    e.preventDefault();
    var transactions = handleStorage();

     transactions.push({
        name: e.target.elements['merch-name'].value,
        value: e.target.elements['merch-value'].value,
        kind: e.target.elements['transaction-type'].value,
    });
    
    
}


//Criar um extrato das transacoes incluidas na ordem que foram inseridas
function showTransactions() {

    var transactions = handleStorage();

    console.log("carregado showTransactions");
    console.log(transactions);
    //apresenta as transacoes
    document.querySelector('table .transactions thead').innerHTML =
    //desenha só o head
    `   <tr>
            <td>
                Mercadoria
            </td>
            <td>
                Valor
            </td>
        </tr>`

    for (var transaction in transactions){

    document.querySelector('table .transactions tbody').innerHTML +=
    //desenha cada transacao
    
        `<tr>
            <td>
                ${transactions[transaction].name}
            </td>
            <td>
                ${transactions[transaction].value}
            </td>
            <td>
                ${transactions[transaction].kind}
            </td>
        </tr>`
                        
    }
    
    document.querySelector('table .transactions tfoot').innerHTML =
    //desenha o rodape que consiste no saldo
    
    `<tfoot>
            <tr>
                <td>
                    Total
                </td>
                <td>
                    ${calculateBalance()}
                </td>
            </tr>
    </tfoot>`;
};

//Saldo final com destaque para lucro ou prejuizo
//atualizar a lista com extrato ja com o calculo atualizado

function calculateBalance(transactions){
    //funcao que calcula o saldo
    let balance = undefined;
    for (var transaction in transactions){
        balance += transactions[transaction].value;
    }
    return(balance);

}

function validateFields(e){
    
    e.preventDefault();
    var valuePattern = /[0-9]/g; 


    if((valuePattern).test(e.key)){
        //se o valor digitado for igual aos permitidos (numeros) a informacao fica, senao nem eh inserida
        e.target.value += e.key;

    
    }
    var validatedValue = e.target.value;
    
    return validatedValue;
}

function toBrCurrency(insertedValue){

    var newValue = parseFloat(insertedValue);
    var format = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL'};
    
    var convertedValue = newValue.toLocaleString('pt-BR', format);
    //merch-value estara com o valor convertido
    
    console.log(convertedValue);

    return convertedValue;
    
}

//Acao limpar dados (onclick) deve apresentar mensagem de confirmacao (feito),
//apagar informacoes e atualizar a lista (todos)
function cleanData(reg){
    
    if(confirm('Você está prestes a limpar todas as transações. Confirma?')){
        delete reg;
    }else{
        alert('Operação cancelada. Os dados permanecem como estavam!')
    };

}

