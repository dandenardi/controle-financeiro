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
    //Ao inserir transacao salvar em local storage e 
    e.preventDefault();
    var transactions = handleStorage();

     transactions.push({
        name: e.target.elements['merch-name'].value,
        value: e.target.elements['merch-value'].value,
        kind: e.target.elements['transaction-type'].value,
    })
    
    console.log(e.target.elements['merch-name'].value);
    console.log(e.target.elements['merch-value'].value);
    console.log(e.target.elements['transaction-type'].value);
}


//Criar um extrato das transacoes incluidas na ordem que foram inseridas
function showTransactions() {

    console.log("carregado showTransactions");

   /*  for (var transaction in transactions){

        document.querySelector('table tbody').innerHTML +=
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
    `<tfoot>
                <tr>
                    <td>
                        Total
                    </td>
                    <td>
                        ${calculateBalance()}
                    </td>
                </tr>
    </tfoot>`;       */
    //Persistir em Local Storage
};
    
    

//Saldo final com destaque para lucro ou prejuizo
//atualizar a lista com extrato ja com o calculo atualizado

function calculateBalance(transactions){
    
    let balance = undefined;
    for (var transaction in transactions){
        balance += transactions[transaction].value;
    }
    return(balance);

}

function validateFields(e){
    e.preventDefault();
    //Todos os campos devem ser preenchidos
    //Mascara no campo valor (padrao 10,90)
}

//Acao limpar dados (onclick) deve apresentar mensagem de confirmacao, apagar informacoes e atualizar a lista (todos)
function cleanData(reg){
    
    if(confirm('Você está prestes a limpar todas as transações. Confirma?')){
        delete reg;
    }else{
        alert('Operação cancelada. Os dados permanecem como estavam!')
    };

}

