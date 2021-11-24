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
        value: e.target.elements['merch-value'].value,
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
    var transactions = rawTransactions.reverse()

    if (!transactions === []){
        document.querySelector('.account-statement>h2').innerHTML = "Não existem transações cadastradas";    
    }else{
        //apresenta as transacoes
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
        
        document.querySelector('.transactions>tfoot').innerHTML =
        //desenha o rodape que consiste no saldo
        `<tfoot>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        Total
                    </td>
                    <td>
                        ${calculateBalance(transactions)}
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
        if (transactions[transaction].kind == 'compra'){
            transactions[transaction].value = `-${transactions[transaction].value}`;
            //caso seja compra, acrescenta negativo
        }
        fValue = parseFloat(transactions[transaction].value);
        balance += fValue;
    }
    console.log(balance);
    return(balance);

}
//validacao de formulario
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
    //merch-value deveria estar com o valor convertido (?)
    
    //!nao consigo apresentar este valor de volta
    
    console.log(convertedValue);
    //aparece corretamente em console.log
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

showTransactions();