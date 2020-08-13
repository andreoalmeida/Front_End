function carregaAgencias(){
    fetch("http://localhost:8088/agencias")
     .then(res => res.json())
     .then(listaAgencias => preencheComboBox(listaAgencias)); 
 }
 
 function preencheComboBox(listaAgencias){
     var templateSelect = `<select class="form-control" id="selectAg" onClick="carregarHoras()"> {{OPCOES}} </select> `;
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

function carregarHoras(){
  //  var agencia = document.getElementById("selectAg").onselect;
    var select = document.getElementById('selectAg');
	var value = select.options[select.selectedIndex].value;
	console.log(value);
 //   console.log (agencia);
    fetch("localhost:8088/agendamentos/filtrarporagencia?agencia={value}")
    .then(res => res.json())
    .then(listaHoras => preencheComboHoraIncial(listaHoras)); 
}

 function preencheComboHoraIncial(listaHoras){
    var templateSelect = `<select class="form-control" id="selectData"> {{OPCOES}} </select> `;
     var templateOption = `<option value="{{VALOR}}"> {{NOME}} </option>`;

     var opcoes = "";
     for (i=0; i<listaHoras.length; i++){
         var ag = listaHoras[i];
         opcoes = opcoes + templateOption.replace("{{VALOR}}", ag.id)
                                         .replace("{{NOME}}", ag.nome);
     }
     var novoSelect = templateSelect.replace("{{OPCOES}}", opcoes);
     document.getElementById("optionHora").innerHTML = novoSelect;

     
 }