
//Inicializa las variables
function initVal(){
    if($("#ang").val() == 90 || $("#ang").val()== -90){
        Vix=0;
    }
    else{
        Vix=$("#v").val() * Math.cos($("#ang").val()* (Math.PI/180));
    }
    if($("#ang").val() == 0 || $("#ang").val()== 180 || $("#ang").val()== -180){
        Viy=0;
    }
    else{
        Viy=$("#v").val() * Math.sin($("#ang").val()* (Math.PI/180));
    }

    masa=$("#m").val()
    gama=$("#b1").val()/masa;
    gama2=$("#b2").val()/masa;
    g=$("#g").val();
    h=parseInt($("#h").val());
    t=0;
    x=0;
    y=h;
    vx=0;
    vy=0;
    tPaso=$("#tSalto").val()
    $(".gama").html(gama.toFixed(3));
    $(".vix").html(Vix.toFixed(3));
    $(".viy").html(Viy.toFixed(3));
    xmas=0;
    ex=$("#ex").val();
    ey=$("#ey").val();
}

//Calcula tiro parabolico Analitico sin fricción
function tiroParabolicoAnalitico(){
  var solAnalitica=[]
  var Vy=0
  while(y>=-0.01){
    t = parseFloat(t)
    Vy=Viy-g*t
    solAnalitica.push({
      't':t,
      'x': ((Vix*t)+xmas) ,
      'y': y,
      'vx': Vix,
      'vy': (Viy-g*t),
      'ec': ((masa*(Math.pow(Vix,2)+Math.pow(Viy-g*t,2)))/2),
      'ep': (masa*g*y),
      'e':  (((masa*(Math.pow(Vix,2)+Math.pow(Vy,2)))/2)+( masa*g*y))
    })

    t=math.add(math.bignumber(t),math.bignumber(tPaso));
    y=((Viy*t)-(g*(t*t))/2)+h
  }
  return solAnalitica;
}

//Calcula tiro parabolico con friccion por metodo de Euler
function tiroParabolicoEuler(){
  var  Vx=Vix, Vy=Viy, rta=[];
  while(y >= 0){
    rta.push({
      't':t,
      'x': x,
      'y': y,
      'vx': Vx,
      'vy': Vy,
      'ec': ((masa*(Math.pow(Vx,2)+Math.pow(Vy,2)))/2),
      'ep': (masa*g*y),
      'e':  (((masa*(Math.pow(Vx,2)+Math.pow(Vy,2)))/2)+( masa*g*y))
    })
    t=math.add(math.bignumber(t),math.bignumber(tPaso));
    t = parseFloat(t)
    x=x+tPaso*Vx
    y= y+tPaso*Vy
    Vx= Vx+tPaso*(-gama*Vx-gama2*Vx*Math.abs(Vx))
    Vy= Vy+tPaso*(-g-gama*Vy-gama2*Vy*Math.abs(Vy))
  }
  return rta;
}

//Calcula tiro parabolico con friccion por metodo de Euler Mejorado
function tiroParabolicoEulerMejorado(){
  var  Vx=Vix, Vy=Viy, rta=[], Vxa= Vx, Vya= Vy, Vxa1, Vya1
  while(y >= 0){

    rta.push({
      't':t,
      'x': x,
      'y': y,
      'vx': Vx,
      'vy': Vy,
      'ec': ((masa*(Math.pow(Vx,2)+Math.pow(Vy,2)))/2),
      'ep': (masa*g*y),
      'e':  (((masa*(Math.pow(Vx,2)+Math.pow(Vy,2)))/2)+( masa*g*y))
    })

    t=math.add(math.bignumber(t),math.bignumber(tPaso))
    t = parseFloat(t)

    Vx1=Vx+tPaso*(-gama*Vx-gama2*Vx*Math.abs(Vx))
    Vx= Vx+tPaso*(-gama*Vx-gama2*Vx*Math.abs(Vx)-gama*Vx1-gama2*Vx1*Math.abs(Vx))/2

    Vy1=Vy+tPaso*(-g-gama*Vy-gama2*Vy*Math.abs(Vy))
    Vy= Vy+tPaso*(-g-gama*Vy-gama2*Vy*Math.abs(Vy)-g-gama*Vy1-gama2*Vy1*Math.abs(Vy))/2

    x=x+tPaso*(Vxa+Vx)/2
    y= y+tPaso*(Vya+Vy)/2

    Vxa1=Vx1
    Vxa= Vx

    Vya1=Vy1
    Vya= Vy

  }
  return rta;
}

//Calcula tiro parabolico con friccion por metodo de Euler Runger Kutta
function tiroParabolicoRungeKutta(){
  var  Vx=Vix, Vy=Viy, rta=[],sg
  while(y >= 0){

    rta.push({
      't':t,
      'x': x,
      'y': y,
      'vx': Vx,
      'vy': Vy,
      'ec': ((masa*(Math.pow(Vx,2)+Math.pow(Vy,2)))/2),
      'ep': (masa*g*y),
      'e':  (((masa*(Math.pow(Vx,2)+Math.pow(Vy,2)))/2)+( masa*g*y))
    })

    t=math.add(math.bignumber(t),math.bignumber(tPaso))
    t = parseFloat(t)

    x=x+tPaso*Vx
    y= y+tPaso*Vy

    sg1=gama+gama2*Math.abs(Vx)
    Vx=Vx-(tPaso*sg1*Vx)+((Math.pow(sg1,2)*Vx*Math.pow(tPaso,2))/2)

    sg2=gama+gama2*Math.abs(Vx)
    Vy=Vy-(tPaso*sg2*Vy)+((Math.pow(sg2,2)*Vy*Math.pow(tPaso,2))/2)+((-g*tPaso)/3)-((sg2*(-g)*Math.pow(tPaso,2))/2)+(2/3*(-g*tPaso))
  }
  return rta;
}



//Inicializa loe nuevos valores despues de rebotar aplicando ex y ey
function reboteTPA(datos){
  xmas=datos[datos.length-1].x
  t=0;
  x=datos[datos.length-1].x
  y=0
  Vix=datos[datos.length-1].vx*ex
  Viy=Math.abs(datos[datos.length-1].vy)*ey
  h=0
}



//Genera html de los datos de la tabla
function genDatosTabla(datos){
  var tabla="";
  for (var i in datos) {
    tabla+="<tr>";
    ddatos=datos[i]
    for (var j in ddatos) {
      tabla+="<td>"+ddatos[j].toFixed(3)+"</td>";
    }
    tabla+="</tr>";
  }
  return tabla
}

//Template para generar la tabla
function generarTablas(id,titulo,encabezados,datos){
  var encabText=""
  encabezados.map(function(val){encabText += '<th>'+val+'</th>'})

  return(
  `<div id="ContenedorTabla${id}">
      <div class="card">
        <div class="card-header btn btn-info" data-background-color="green" type="button" data-toggle="collapse" data-target="#tabla${id}">
          <h4 class="title">${titulo}</h4>
          <p class="category">Gama (b/m): ${parseFloat(gama).toFixed(3)} | V0x: ${parseFloat(Vix).toFixed(3)} | V0y: ${parseFloat(Viy).toFixed(3)}</p>
        </div>
        <div class="card-content table-responsive collapse in" id="tabla${id}">
          <table class="table">
            <thead class="text-primary" data-color="green">
              ${encabText}
            </thead>
            <tbody id="table${id}">
                ${genDatosTabla(datos)}
            </tbody>
          </table>
        </div>
      </div>
    </div>`
  )
}

//Genera graficas
function genGraf(titulo,datos,donde,var1,var2){

  var data=[]
  data.push(datos.map(function(num) {
    return {x: num[var1], y: num[var2]}
  }))

  var chart = new Chart(donde, {
  type: 'line',
  data: {
    datasets: [{
        label: titulo,
        data: data[0]
      }]

  },
  options: {
    scales: {
        xAxes: [{
            type: 'linear',
            position: 'bottom'
        }]
    }
  }
  })
  return chart
}



//Renderiza tablas y graficas de Tiro Parabolico Analitico
function pageTPA() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPAR es donde guardaremos todos los datos para graficar
  DatosTPAR=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoAnalitico() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPAR = DatosTPAR.concat(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }
  tablas += generarTablas("tablaSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoAnalitico() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPAR = DatosTPAR.concat(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPAR").html(tablas) //Renderiza las tablas en el DOM del HTML

  //Genero las graficas
  $('#contGrafTPA').html(`
    <canvas id="grafTBAxy" height="100%" width="100%"></canvas>
    <canvas id="grafTBAxe" height="100%" width="100%"></canvas>
    <canvas id="grafTBAxep" height="100%" width="100%"></canvas>
    <canvas id="grafTBAxec" height="100%" width="100%"></canvas>
    `)
  var contGrafTPAxy = document.getElementById('grafTBAxy').getContext("2d")
  var GrafTBAxy = genGraf("X vs Y (Trayectoria)",DatosTPAR,contGrafTPAxy,'x','y')

  var contGrafTPAxe = document.getElementById('grafTBAxe').getContext("2d")
  var GrafTBAxe = genGraf("X vs E",DatosTPAR,contGrafTPAxe,'x','e')

  var contGrafTPAxep = document.getElementById('grafTBAxep').getContext("2d")
  var GrafTBAxep = genGraf("X vs Ep",DatosTPAR,contGrafTPAxep,'x','ep')

  var contGrafTPAxec = document.getElementById('grafTBAxec').getContext("2d")
  var GrafTBxecA = genGraf("X vs Ec",DatosTPAR,contGrafTPAxec,'x','ec')


}

//Renderiza tablas y graficas de Tiro Parabolico Euler, Euler mejorado y Runge Kutta
function pageTPEuler() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPEuler es donde guardaremos todos los datos para graficar
  DatosTPEuler=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoEuler() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPEuler=DatosTPEuler.concat(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }

  tablas += generarTablas("tablaEulerSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoEuler() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPEuler=DatosTPEuler.concat(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaEulerRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPEuler").html(tablas) //Renderiza las tablas en el DOM del HTML

  //Genero las graficas
  $('#grafTPEuler').html(`
    <canvas id="grafTPEulerxy" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerxt" height="100%" width="100%"></canvas>
    <canvas id="grafTPEuleryt" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerxe" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerxep" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerxec" height="100%" width="100%"></canvas>
    `)
  var contGrafTPEulerxy = document.getElementById('grafTPEulerxy').getContext("2d")
  var grafTPEulerxy = genGraf("X vs Y (Trayectoria)",DatosTPEuler,contGrafTPEulerxy,'x','y')

  var contGrafTPEulerxt = document.getElementById('grafTPEulerxt').getContext("2d")
  var grafTPEulerxt = genGraf("X vs t (Tratectoria)",DatosTPEuler,contGrafTPEulerxt,'x','t')

  var contGrafTPEuleryt = document.getElementById('grafTPEuleryt').getContext("2d")
  var grafTPEuleryt = genGraf("Y vs t (Tratectoria)",DatosTPEuler,contGrafTPEuleryt,'y','t')

  var contGrafTPEulerxe = document.getElementById('grafTPEulerxe').getContext("2d")
  var grafTPEulerxe = genGraf("X vs E",DatosTPEuler,contGrafTPEulerxe,'x','e')

  var contGrafTPEulerxep = document.getElementById('grafTPEulerxep').getContext("2d")
  var grafTPEulerxep = genGraf("X vs Ep",DatosTPEuler,contGrafTPEulerxep,'x','ep')

  var contGrafTPEulerxec = document.getElementById('grafTPEulerxec').getContext("2d")
  var grafTPxecA = genGraf("X vs Ec",DatosTPEuler,contGrafTPEulerxec,'x','ec')
}

//Renderiza tablas y graficas de Tiro Parabolico Euler, Euler mejorado y Runge Kutta
function pageTPEulerMejorado() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPEuler es donde guardaremos todos los datos para graficar
  DatosTPEulerMejorado=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoEulerMejorado() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPEulerMejorado=DatosTPEulerMejorado.concat(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }

  tablas += generarTablas("tablaEulerMejoradoSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoEulerMejorado() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPEulerMejorado=DatosTPEulerMejorado.concat(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaEulerMejoradoRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPEulerMejorado").html(tablas) //Renderiza las tablas en el DOM del HTML

  //Genero las graficas
  $('#grafTPEulerMejorado').html(`
    <canvas id="grafTPEulerMejoradoxy" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerMejoradoxt" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerMejoradoyt" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerMejoradoxe" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerMejoradoxep" height="100%" width="100%"></canvas>
    <canvas id="grafTPEulerMejoradoxec" height="100%" width="100%"></canvas>
    `)
  var contGrafTPEulerMejoradoxy = document.getElementById('grafTPEulerMejoradoxy').getContext("2d")
  var grafTPEulerMejoradoxy = genGraf("X vs Y (Trayectoria)",DatosTPEulerMejorado,contGrafTPEulerMejoradoxy,'x','y')

  var contGrafTPEulerMejoradoxt = document.getElementById('grafTPEulerMejoradoxt').getContext("2d")
  var grafTPEulerMejoradoxt = genGraf("X vs t (Tratectoria)",DatosTPEulerMejorado,contGrafTPEulerMejoradoxt,'x','t')

  var contGrafTPEulerMejoradoyt = document.getElementById('grafTPEulerMejoradoyt').getContext("2d")
  var grafTPEulerMejoradoyt = genGraf("Y vs t (Tratectoria)",DatosTPEulerMejorado,contGrafTPEulerMejoradoyt,'y','t')

  var contGrafTPEulerMejoradoxe = document.getElementById('grafTPEulerMejoradoxe').getContext("2d")
  var grafTPEulerMejoradoxe = genGraf("X vs E",DatosTPEulerMejorado,contGrafTPEulerMejoradoxe,'x','e')

  var contGrafTPEulerMejoradoxep = document.getElementById('grafTPEulerMejoradoxep').getContext("2d")
  var grafTPEulerMejoradoxep = genGraf("X vs Ep",DatosTPEulerMejorado,contGrafTPEulerMejoradoxep,'x','ep')

  var contGrafTPEulerMejoradoxec = document.getElementById('grafTPEulerMejoradoxec').getContext("2d")
  var grafTPxecA = genGraf("X vs Ec",DatosTPEulerMejorado,contGrafTPEulerMejoradoxec,'x','ec')
}


//Renderiza tablas y graficas de Tiro Parabolico Euler, Euler mejorado y Runge Kutta
function pageTPRungeKutta() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPEuler es donde guardaremos todos los datos para graficar
  DatosTPRungeKutta=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoRungeKutta() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPRungeKutta=DatosTPRungeKutta.concat(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }

  tablas += generarTablas("tablaEulerMejoradoSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoRungeKutta() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPRungeKutta=DatosTPRungeKutta.concat(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaEulerMejoradoRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPRungeKutta").html(tablas) //Renderiza las tablas en el DOM del HTML

  //Genero las graficas
  $('#grafTPRungeKutta').html(`
    <canvas id="grafTPRungeKuttaxy" height="100%" width="100%"></canvas>
    <canvas id="grafTPRungeKuttaxt" height="100%" width="100%"></canvas>
    <canvas id="grafTPRungeKuttayt" height="100%" width="100%"></canvas>
    <canvas id="grafTPRungeKuttaxe" height="100%" width="100%"></canvas>
    <canvas id="grafTPRungeKuttaxep" height="100%" width="100%"></canvas>
    <canvas id="grafTPRungeKuttaxec" height="100%" width="100%"></canvas>
    `)
  var contGrafTPRungeKuttaxy = document.getElementById('grafTPRungeKuttaxy').getContext("2d")
  var grafTPRungeKuttaxy = genGraf("X vs Y (Trayectoria)",DatosTPRungeKutta,contGrafTPRungeKuttaxy,'x','y')

  var contGrafTPRungeKuttaxt = document.getElementById('grafTPRungeKuttaxt').getContext("2d")
  var grafTPRungeKuttaxt = genGraf("X vs t (Tratectoria)",DatosTPRungeKutta,contGrafTPRungeKuttaxt,'x','t')

  var contGrafTPRungeKuttayt = document.getElementById('grafTPRungeKuttayt').getContext("2d")
  var grafTPRungeKuttayt = genGraf("Y vs t (Tratectoria)",DatosTPRungeKutta,contGrafTPRungeKuttayt,'y','t')

  var contGrafTPRungeKuttaxe = document.getElementById('grafTPRungeKuttaxe').getContext("2d")
  var grafTPRungeKuttaxe = genGraf("X vs E",DatosTPRungeKutta,contGrafTPRungeKuttaxe,'x','e')

  var contGrafTPRungeKuttaxep = document.getElementById('grafTPRungeKuttaxep').getContext("2d")
  var grafTPRungeKuttaxep = genGraf("X vs Ep",DatosTPRungeKutta,contGrafTPRungeKuttaxep,'x','ep')

  var contGrafTPRungeKuttaxec = document.getElementById('grafTPRungeKuttaxec').getContext("2d")
  var grafTPxecA = genGraf("X vs Ec",DatosTPRungeKutta,contGrafTPRungeKuttaxec,'x','ec')
}

// Llama y ejecuta las funciones de renderizado
function Ejecutar(){
  pageTPA()
  pageTPEuler()
  pageTPEulerMejorado()
  pageTPRungeKutta()
}


function tabTiroGen(){
    $("#Euler").hide("fast")
    $("#Tiro_ParabolicoA").show("hide")
}

function tabEuler(){
    $("#Tiro_ParabolicoA").hide("fast")
    $("#Euler").show("hide")
}
