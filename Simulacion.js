
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



//Renderiza tablas y graficas de Tiro Parabolico Analitico
function pageTPA() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPAR es donde guardaremos todos los datos para graficar
  DatosTPAR=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoAnalitico() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPAR.push(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }
  tablas += generarTablas("tablaSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoAnalitico() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPAR.push(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPAR").html(tablas) //Renderiza las tablas en el DOM del HTML
}

//Renderiza tablas y graficas de Tiro Parabolico Euler, Euler mejorado y Runge Kutta
function pageTPEuler() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPEuler es donde guardaremos todos los datos para graficar
  DatosTPEuler=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoEuler() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPEuler.push(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }

  tablas += generarTablas("tablaEulerSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoEuler() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPEuler.push(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaEulerRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPEuler").html(tablas) //Renderiza las tablas en el DOM del HTML
}

//Renderiza tablas y graficas de Tiro Parabolico Euler, Euler mejorado y Runge Kutta
function pageTPEulerMejorado() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPEuler es donde guardaremos todos los datos para graficar
  DatosTPEulerMejorado=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoEulerMejorado() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPEulerMejorado.push(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }

  tablas += generarTablas("tablaEulerMejoradoSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoEulerMejorado() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPEulerMejorado.push(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaEulerMejoradoRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPEulerMejorado").html(tablas) //Renderiza las tablas en el DOM del HTML
}

//Renderiza tablas y graficas de Tiro Parabolico Euler, Euler mejorado y Runge Kutta
function pageTPRungeKutta() {
  var tablas="" ,encabezados=[]//Declaramos las variables necesarias, DatosTPEuler es donde guardaremos todos los datos para graficar
  DatosTPRungeKutta=[]
  initVal() // Inicializamos los valores
  r=tiroParabolicoRungeKutta() //generamos y guardamos los primeros datos del tiro inicial
  DatosTPRungeKutta.push(r) // agregamos esos datos en la variable de los datos generales

  //Obtenemos los encabezados de las tablas segun los datos generados
  for (var i in r[0]) {
    encabezados.push(i)
  }

  tablas += generarTablas("tablaEulerMejoradoSinRebote","Tiro parabolico sin rebote",encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas

  for (var i = 0; i < 2; i++) {
    reboteTPA(r)// inicializamos los valores y aplicamos ex y ey para el rebote
    r=tiroParabolicoRungeKutta() //generamos y guardamos los primeros datos del tiro inicial
    DatosTPRungeKutta.push(r) // agregamos esos datos en la variable de los datos generales
    tablas += generarTablas("tablaEulerMejoradoRebote"+(i+1),"Tiro parabolico con rebote "+(i+1),encabezados,r)//obtenemos el codigo html con el template tablas para generar la tablas
  }

  $("#tablaTPRungeKutta").html(tablas) //Renderiza las tablas en el DOM del HTML
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
