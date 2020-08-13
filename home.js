/* qual o objetivo dessa função? 
   1 - acessar o localStorage e ver se existe um item chamado ScheduleUSER
       se tiver, recupera, trata e usa as informações para preencher as lacunas dos dados do 
       usuario
   2 - se não existir esse item? retorna para o index (sinal que não tem usuário conectado)
*/

//const { ConsoleReporter } = require("jasmine");
//const { Console } = require("console");

var templateFoto = `<img src="{{LINKFOTO}}" width="100%">`;
var templateInfo = `Nome: {{NOME}} <br>
                    Email: {{EMAIL}} <br>
                    RACF: {{RACF}} <br>
                    Funcional: {{FUNCIONAL}} <br>
                    Departamento: {{DEPARTAMENTO}} / {{UNIDADE}}`;
function carregarInfoUsuario(){
    var userSTR = localStorage.getItem("ScheduleUSER");
    if (!userSTR){    // o objeto não existe no Local Storage
        window.location = "index.html";
    }
    else{
        // vou ter que converter de STRING para Objeto
        var user = JSON.parse(userSTR);

        document.getElementById("fotoUSER").innerHTML = templateFoto.replace("{{LINKFOTO}}",user.linkFoto);

        var infoUser = templateInfo.replace("{{NOME}}", user.nome)
                                   .replace("{{EMAIL}}", user.email)
                                   .replace("{{RACF}}",  user.racf)        
                                   .replace("{{FUNCIONAL}}", user.funcional)
                                   .replace("{{DEPARTAMENTO}}", user.depto.nome)    
                                   .replace("{{UNIDADE}}", user.depto.unidade);
        document.getElementById("infoUSER").innerHTML = infoUser;  
        
        // agora vou carregar os dados da agencia
        carregaAgencias();
    }


}

    

function carregaAgencias(){
   fetch("http://localhost:8088/agencias")
    .then(res => res.json())    // equivale a var res = fetch
    .then(listaAgencias => preencheComboBox(listaAgencias)); // equivale a combinar a linha anterior com listaAgencia = res.json()

    /*
    var res = fetch("......");
    var listaAgencias = res.json();
    preencheComboBox(listaAgencias);
    */
}

function preencheComboBox(listaAgencias){
    var templateSelect = `<select class="form-control" id="selectAg"> {{OPCOES}} </select> `;
    var templateOption = `<option value="{{VALOR}}"> {{NOME}} </option>`;
    
    var opcoes = "";
    for (i=0; i<listaAgencias.length; i++){
        var ag = listaAgencias[i];
        opcoes = opcoes + templateOption.replace("{{VALOR}}", ag.id)
                                        .replace("{{NOME}}", ag.nome);
    }
    var novoSelect = templateSelect.replace("{{OPCOES}}", opcoes);
    document.getElementById("optionAgencia").innerHTML = novoSelect;
}

function gerarRelatorio(){
    // para saber se tá todo mundo "checado"
    var combinacao = 0;
    if (document.getElementById("selectAgencia").checked){
        combinacao = combinacao + 1;
    } 
    if (document.getElementById("selectData").checked){
        combinacao = combinacao + 2;
    } 
    if (document.getElementById("selectCliente").checked){
        combinacao = combinacao + 4;
    } 
    console.log("Combinacao = "+combinacao);
    
   
    var ag = document.getElementById("selectAg");
    var cliente = document.getElementById("txtCliente").value;
    var data1 = document.getElementById("txtData").value;
    console.log(ag.options[ag.selectedIndex].value);
    console.log(document.getElementById("txtData").value);
    console.log(document.getElementById("txtCliente").value);

    data = data1.substring(10,8)+"/"+data1.substring(7,5)+"/"+data1.substring(0,4);

    console.log(data);
    
    var url = "http://localhost:8088/agendamentos";
    // preciso complementar todas as URL 
    if (combinacao == 0){
        url = url + "/todos";
    }
    else if (combinacao == 1){
        url = url + "/filtrarporagencia?agencia="+ag.options[ag.selectedIndex].value; // filtro por agencia
    }
    else if (combinacao == 2){
        url = url + "/filtrarpordata?dataAgendamento="+data; //filtro por data
    }
    else if (combinacao == 3){
        url = url + "/filtrarporagenciadata?agencia="+ag.options[ag.selectedIndex].value+"&dataAgendamento="+data; // filtro por agencia e data
    }
    else if (combinacao == 4){
        url = url + "/filtrarporcliente?nomecli="+cliente; //filtrar por cliente
        console.log(url);
    }
    else if (combinacao == 5){
        url = url + "/filtrarclienteagencia?nomecli="+cliente+"\&agencia="+ag.options[ag.selectedIndex].value; //filtrar por agencia e cliente
    }
    else if (combinacao == 6){
        url = url + "/filtrarclientedata?nomecli="+cliente+"\&dataAgendamento="+data; //fitrar por cliente e data
    }
    else if (combinacao == 7){
        url = url + "/filtrartodos?nomecli="+cliente+"\&agencia="+ag.options[ag.selectedIndex].value+"\&dataAgendamento="+data; //todos
    }


    fetch(url)
       .then(res => res.json())
       .then(res => preencheRelatorio(res));
}

function preencheRelatorio(res){
    var templateLinha = `<div class="row">
                <div class="col-1"> {{PROTO}} </div>
                <div class="col-2"> {{CLI}} </div>
                <div class="col-2"> {{EMAIL}} </div>
                <div class="col-2"> {{CEL}} </div>
                <div class="col-1"> {{AG}} </div>
                <div class="col-2"> {{DATAHORA}} </div>
                <div class="col-2"> {{OBS}} </div>
       </div>`;

       var rel = "";
       for (i=0;i<res.length; i++){
           var ag = res[i];
           rel += templateLinha.replace("{{PROTO}}", ag.numSeq)
                               .replace("{{CLI}}", ag.nomeCliente)
                               .replace("{{EMAIL}}", ag.emailCliente)
                               .replace("{{CEL}}", ag.celularCliente)
                               .replace("{{AG}}", ag.agencia.nome)
                               .replace("{{DATAHORA}}", ag.dataAgendamento+"-"+ag.horaAgendamento)
                               .replace("{{OBS}}", ag.observacoes);
       }
       document.getElementById("relatorio").innerHTML = rel;
}