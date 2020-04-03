var corGrafico = {};

corGrafico.confirmados = "red";
corGrafico.descartados = "pink";
corGrafico.investigados = "yellow";
corGrafico.notificados = "green";
corGrafico.isolados = "black";
corGrafico.internados = "blue";
corGrafico.monitorados = "brown";
corGrafico.recuperados = "purple";
corGrafico.obitos = "gray";
corGrafico.excluidos = "orange";

function buildChart(param) {

  var queryString = encodeURIComponent(param.query);
  var query = new google.visualization.Query(param.googleSheet + queryString);
    
  query.send(function(response){
    if (response.isError()) {
      alert('Erro in consulta: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return ;
    }
    var data = response.getDataTable();

    //Criação do ticks X
    var minX = data.getColumnRange(0).min;
    var maxX = data.getColumnRange(0).max;

    //Converte em dias
    var minXDias = Math.ceil(minX / (1000 * 60 * 60 * 24));
    var maxXDias = Math.ceil(maxX / (1000 * 60 * 60 * 24));
    var diffDias = maxXDias-minXDias;

    var ticksX = [];
    var stepX = Math.ceil(diffDias/5);
    var offsetX = diffDias%stepX;

    if(offsetX > 0){
      var val = minX * (1000 * 60 * 60 * 24);
      val = new Date(val);
      ticksX.push(minX);
    }

    for(var i=minXDias+offsetX; i <=maxXDias; i += stepX){
        var val = i * (1000 * 60 * 60 * 24);
        val = new Date(val);
        ticksX.push(val);
    }

    //Criação do ticks Y
    var minY = 0;

    var maxY = -1;
    for(var i=1; i<=data.getNumberOfColumns()-1; i++){
        maxY = Math.max(data.getColumnRange(i).max, maxY);
    }

    var ticksY = [];
    var stepY = Math.ceil((maxY-minY)/5);

    var stepGold = [1, 5, 10, 20, 50, 100, 200, 500];
    for(var i=0; i<stepGold.length; i++){
        if(stepY <= stepGold[i]){
            stepY = stepGold[i];
            break;
        }
    }

    var lastValue = 0;
    for(var i=minY; i <maxY; i += stepY){
        ticksY.push(i);
        lastValue = i;
    }
    ticksY.push(lastValue + stepY);

    //Option

    var options = {
        curveType: 'function',
        legend: { position: 'top' , maxLines: 2},
        isStacked: true,
        colors: param.colors,
        pointSize: 5,
        hAxis: {
            title: param.xTitle,
            format: 'd/M',
            //viewWindow: {min: minX, max: maxX},
            ticks: ticksX
            //gridlines: {count: stepX}
        },
        vAxis: {    
            title: param.yTitle,
            viewWindow: { min: minY },
            //ticks: ticksY 
            gridlines: {count: 5}
            }
        
      };

      var chart = new google.visualization.LineChart(document.getElementById(param.idDiv));
      chart.draw(data, options);


      //Data de atualização informada em cada página
      if(param.data_atualizacao != false){
          var mes = [
            "janeiro", "fevereiro", "março", 
            "abril", "maio", "junho", 
            "julho", "agosto", "setembro", 
            "outubro", "novembro", "dezembro"];

          $(param.data_atualizacao).text(maxX.getDate() + " de " + mes[maxX.getMonth()] + " de " + maxX.getFullYear());
      }
  });
}

function getParametros(cidade, tipo){

  switch(cidade){
    case "jatai":
      return getParametrosJatai(tipo);
      break;
    case "mineiros":
      return getParametrosMineiros(tipo);
      break;
    case "rioverde":
      return getParametrosRioverde(tipo);
      break;
  }
}

function getParametrosJatai(tipo){
  
  var parametros = {};
  
  parametros.query = 'SELECT A, B, D, E, F, G';
  parametros.colors = [
    corGrafico.confirmados, corGrafico.investigados, corGrafico.notificados, 
    corGrafico.isolados, corGrafico.internados];
  parametros.googleSheet = 'https://docs.google.com/spreadsheets/d/'
  parametros.googleSheet += '1nCDjAvdEWVzwJjLhRkkVHiw2SK63SKcYXb7doIUI5VQ';
  parametros.googleSheet += '/gviz/tq?sheet=Dados&headers=1&tq=';
  parametros.xTitle = 'Dia/Mês';
  parametros.yTitle = 'Número de casos';
  parametros.idDiv = 'jatai-grafico-resumo';
  parametros.data_atualizacao = "#data-atualizacao-jatai";

  switch (tipo){
    case "resumo":
    break;
    case "monitorados":
    break;
    case "todas":
    break;
  }

  return parametros;

}

function getParametrosMineiros(tipo){
  
  var parametros = {};

  parametros.query = 'SELECT A, B, C, D';
  parametros.googleSheet = 'https://docs.google.com/spreadsheets/d/'
  parametros.googleSheet += '1MPFPI6nZvoPjSanXFcVqh3TrWDRJ7J5SXbhKkW6p5NY';
  parametros.googleSheet += '/gviz/tq?sheet=Dados&headers=1&tq=';
  parametros.colors = ['green', 'brown', 'orange'];
  parametros.xTitle = 'Dia/Mês';
  parametros.yTitle = 'Número de casos';
  parametros.idDiv = 'mineiros-grafico-resumo';
  parametros.data_atualizacao = "#data-atualizacao-mineiros";

  switch (tipo){
    case "resumo":
    break;
    case "monitorados":
    break;
    case "todas":
    break;
  }

  return parametros;
}

function getParametrosRioverde(tipo){

/*
  B = Confirmados,  C = Descartados 
  D = Investigados  E= Notificados 
  F = Isolados      G = Internados  
  H = Monitorados   I = Recuperados
*/

  var parametros ={};

  parametros.googleSheet = 'https://docs.google.com/spreadsheets/d/'
  parametros.googleSheet += '1jrhI1EjA8KJNJ5CKEDe-oREPjeRnYviVKp9AJPPMlLE';
  parametros.googleSheet += '/gviz/tq?sheet=Dados&headers=1&tq=';
  parametros.xTitle = 'Dia/Mês';
  parametros.yTitle = 'Número de casos';

  switch (tipo){
    case "resumo":
      parametros.idDiv = 'rioverde-grafico-resumo';
      parametros.query = 'SELECT A, D, F, G, I, B';
      parametros.colors = [
        corGrafico.investigados, corGrafico.isolados, 
        corGrafico.internados, corGrafico.recuperados, corGrafico.confirmados
      ];
      parametros.data_atualizacao = "#data-atualizacao-rioverde";
      break;
    case "monitorados":
      parametros.idDiv = 'rioverde-grafico-monitorados';
      parametros.query = 'SELECT A, C, H';
      parametros.colors = [
        corGrafico.descartados, corGrafico.monitorados 
      ];
      parametros.data_atualizacao = false;
      break;
    case "todas":
      parametros.idDiv = 'rioverde-grafico-todas';
      parametros.query = 'SELECT A, C, D, F, G, H, I, B';
      parametros.colors = [
        corGrafico.descartados, corGrafico.investigados, corGrafico.isolados, corGrafico.internados, 
        corGrafico.monitorados, corGrafico.recuperados, corGrafico.confirmados
      ];
      parametros.data_atualizacao = false;
      break;
  }

  return parametros;
}