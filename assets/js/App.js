

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


    gama=$("#b").val()/$("#m").val();
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
}

function tiroParabolicoAnalitico(){
  var solAnalitica=[];
  while(y>-0.1){
    t = parseFloat(t)
    solAnalitica.push({
      't':t,
      'x': (Vix*t)+xmas ,
      'y': y,
      'vx': Vix,
      'vy': Viy-g*t
    })
    t=math.add(math.bignumber(t),math.bignumber(tPaso));
    y=((Viy*t)-(g*(t*t))/2)+h
  }
  return solAnalitica;
}

function reboteTPA(datos){
  xmas=datos[datos.length-1].x
  t=0;
  x=datos[datos.length-1].x
  y=0
  Vix=datos[datos.length-1].vx
  Viy=Math.abs(datos[datos.length-1].vy)*0.9
  h=0
}

initVal();
tiroParabolicoAnalitico();

function ejViscSimp(){
    $("#tableEjSimp").html("")
    initVal()
    datosGen1=[]
    ////Inicio Tabla general////////////////////////////
    while (y > 0) {
        x=(Vix/gama)*(1-Math.exp(-gama*t))
        vx=Vix*Math.exp(-gama*t);
        vy=(-g/gama)+(Viy-(-g/gama))*Math.exp(-gama*t)
        datosGen1.push({"t": parseFloat(t),"x":x,"y":y,"vx":vx, "vy": vy})
        $("#tableEjSimp").append(' \
            <tr>\
                <td>'+t.toFixed(3)+'s</td>\
                <td>'+x.toFixed(3)+'m</td>\
                <td>'+y.toFixed(3)+'m</td>\
                <td>'+vx.toFixed(3)+'m/s</td>\
                <td>'+vy.toFixed(3)+'m/s</td>\
            </tr>\ ');
        t=math.add(math.bignumber(t),math.bignumber(tPaso))

        y=h+((-g/gama)*t)+((Viy/gama)-(-g/(gama*gama)))*(1-Math.exp(-gama*t))
    }
    $("#Contenedor").show("slow")
    ////Fin Tabla general////////////////////////////

    ////Inicio Tabla Comparaticion angulos////////////////////////////
    $("#TableCompAng1").html("")
    var tVuelo = [];
    for (var angCount = 90; angCount >= -90; angCount=angCount-5) {
        initVal()
        if(angCount == 90 || angCount== -90){
            Vix=0;
        }
        else{
            Vix=$("#v").val() * Math.cos(angCount* (Math.PI/180));
        }
        if(angCount == 0 || angCount== 180 || angCount== -180){
            Viy=0;
        }
        else{
            Viy=$("#v").val() * Math.sin(angCount* (Math.PI/180));
        }
        var tiempo=0
        var ymax=0, xmax=0

        while (y > 0) {
            tiempo = parseFloat(t)
            x=(Vix/gama)*(1-Math.exp(-gama*t))
            vx=Vix*Math.exp(-gama*t);
            vy=(-g/gama)+(Viy-(-g/gama))*Math.exp(-gama*t)
            if(y>ymax){
                ymax=y
            }
            t=math.add(math.bignumber(t),math.bignumber(tPaso))
            y=h+((-g/gama)*t)+((Viy/gama)-(-g/(gama*gama)))*(1-Math.exp(-gama*t))
        }
        tVuelo.push({"Angulo": angCount,"TVuelo":tiempo,"Xmax":x,"Ymax":ymax, "Vx": Vix, "Vy": Viy})
    }
    // console.log(tVuelo)
    var h_max=0, x_max=0, ang_ymax,x_ymax;
    tVuelo.map(function(el) {
        if(el.Ymax > h_max){
            h_max=el.Ymax
            ang_ymax= el
        }
        if(el.Xmax > x_max){
            x_max=el.Xmax
            ang_xmax= el
        }
        $("#TableCompAng1").append(' \
            <tr>\
                <td>'+el.Angulo+'°</td>\
                <td>'+el.TVuelo+'s</td>\
                <td>'+(el.Xmax).toFixed(3)+'m</td>\
                <td>'+(el.Ymax).toFixed(3)+'m</td>\
                <td>'+(el.Vx).toFixed(3)+'m/s</td>\
                <td>'+(el.Vy).toFixed(3)+'m/s</td>\
            </tr>\ ');
        });
    //Estadisticas altura maxima
    $("#angStat").html(ang_ymax.Angulo+"°")
    $("#hAngMax").html(h_max.toFixed(4)+"m")
    $("#xAngMax").html((ang_ymax.Xmax).toFixed(4)+"m")
    $("#tAngMax").html(ang_ymax.TVuelo+"s")
    //Estadisticas alcance maximo
    $("#angStat2").html(ang_xmax.Angulo+"°")
    $("#xAngMax2").html(x_max.toFixed(4)+"m")
    $("#yAngMax2").html(ang_xmax.Ymax+"m")
    $("#tAngMax2").html(ang_xmax.TVuelo+"s")
    //Estadisticas maximo Tiempo de vuelo
    $("#angStat3").html(ang_ymax.TVuelo+"s")
    $("#AngMax3").html(ang_ymax.Angulo+"°")
    $("#xAngMax3").html((ang_ymax.Xmax).toFixed(4)+"m")
    $("#yAngMax3").html(ang_ymax.TVuelo+"s")

    $("#Contenedor").show("slow")





    ////Inicio Tabla Comparaticion angulos////////////////////////////
    try {
        xvy_gen1.destroy()
        xvt_gen1.destroy()
        yvt_gen1.destroy()
        vxvt_gen1.destroy()
        vyvt_gen1.destroy()
        xmaxAng1.destroy()
        ymaxAng1.destroy()
        tAng1.destroy()
    } catch (error) {

    }


    xvy_gen1 = new Chart(document.getElementById('xvy_gen1').getContext('2d'), {
    type: 'line',
    data: {
            labels: datosGen1.map(function(el){
                    return (el.x).toFixed(3)
                }),
            datasets: [{
                label: 'Y',
                data: datosGen1.map(function(el){
                        return (el.y).toFixed(2)
                    }),
                backgroundColor: "rgba(69, 150, 70, 0.5)"
            }]
        }
    });


    xvt_gen1 = new Chart(document.getElementById('xvt_gen1').getContext('2d'), {
    type: 'line',
    data: {
            labels: datosGen1.map(function(el){
                    return el.t
                }),
            datasets: [{
                label: 'X',
                data: datosGen1.map(function(el){
                        return (el.x).toFixed(3)
                    }),
                backgroundColor: "rgba(69, 150, 70, 0.5)"
            }]
        }
    });
    yvt_gen1 = new Chart(document.getElementById('yvt_gen1').getContext('2d'), {
     type: 'line',
     data: {
             labels: datosGen1.map(function(el){
                    return el.t
                }),
            datasets: [{
                label: 'Y',
                data: datosGen1.map(function(el){
                        return (el.y).toFixed(3)
                    }),
                backgroundColor: "rgba(69, 150, 70, 0.5)"
            }]
         }
     });

     vxvt_gen1 = new Chart(document.getElementById('vxvt_gen1').getContext('2d'), {
     type: 'line',
     data: {
             labels: datosGen1.map(function(el){
                    return el.t
                }),
            datasets: [{
                label: 'Vx',
                data: datosGen1.map(function(el){
                        return (el.vx).toFixed(3)
                    }),
                backgroundColor: "rgba(69, 150, 70, 0.5)"
            }]
         }
     });

     vyvt_gen1 = new Chart(document.getElementById('vyvt_gen1').getContext('2d'), {
     type: 'line',
     data: {
             labels: datosGen1.map(function(el){
                    return el.t
                }),
            datasets: [{
                label: 'Vy',
                data: datosGen1.map(function(el){
                        return (el.vy).toFixed(3)
                    }),
                backgroundColor: "rgba(69, 150, 70, 0.5)"
            }]
         }
     });

    xmaxAng1 = new Chart(document.getElementById('xmaxAng1').getContext('2d'), {
    type: 'line',
    data: {
            labels: tVuelo.map(function(el){
                    return el.Angulo+"°"
                }),
            datasets: [{
                label: 'X max',
                fill: false,
                lineTension: 0.1,

                borderColor: false,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 4,
                pointHoverRadius: 9,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: tVuelo.map(function(el){
                        return el.Xmax
                    }),
                spanGaps: false,
            }]
        }
    });

    ymaxAng1 = new Chart(document.getElementById('ymaxAng1').getContext('2d'), {
    type: 'line',
    data: {
            labels: tVuelo.map(function(el){
                    return el.Angulo+"°"
                }),
            datasets: [{
                label: 'Y max',
                fill: false,
                lineTension: 0.1,

                borderColor: false,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 4,
                pointHoverRadius: 9,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: tVuelo.map(function(el){
                        return el.Ymax
                    }),
                spanGaps: false,
            }]
        }
    });

    tAng1 = new Chart(document.getElementById('tAng1').getContext('2d'), {
    type: 'bar',
    data: {
            labels: tVuelo.map(function(el){
                    return el.Angulo+"°"
                }),
            datasets: [{
                label: 'Tiempo de vuelo',
                lineTension: 0.1,
                backgroundColor:"rgba(75,192,192,1)",

                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 4,
                pointHoverRadius: 9,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: tVuelo.map(function(el){
                        return el.TVuelo
                    }),
                spanGaps: false,
            }]
        }
    });

    //////Inicio Euler////////////////////////////////////////////////
    $("#tableEulerEa").html("")
    $("#tableEulerEb").html("")
    initVal()
    vx=Vix
    vy=Viy
    datosEuler=[]
    i=0
        ////Inicio Tabla Euler Ea////////////////////////////
    while (y > 0) {
        $("#tableEulerEa").append(' \
            <tr>\
                <td>'+t.toFixed(2)+'s</td>\
                <td>'+x.toFixed(3)+'m</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].x - x).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].x - x)/datosGen1[i].x).toFixed(3))+'</td>\
                <td>'+y.toFixed(3)+'m</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].y - y).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].y - y)/datosGen1[i].y).toFixed(3))+'</td>\
                <td>'+vx.toFixed(3)+'m/s</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].vx - vx).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].vx - vx)/datosGen1[i].vx).toFixed(3))+'</td>\
                <td>'+vy.toFixed(3)+'m/s</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].vy - vy).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].vy - vy)/datosGen1[i].vy).toFixed(3))+'</td>\
            </tr>\ ');
        t=math.add(math.bignumber(t),math.bignumber(tPaso))
        x=x+tPaso*vx.toFixed(3)
        y=y+tPaso*vy.toFixed(3)
        vx=vx+tPaso*((-gama)*vx)
        vy=vy+tPaso*((-gama)*vy+(-g))
        datosEuler.push({"t": parseFloat(t),"x":x,"y":y,"vx":vx, "vy": vy})
        i++
    }
        ////FIN Tabla Euler Ea////////////////////////////
    //////Fin Euler////////////////////////////////////////////////

    //////Inicio Euler Mejorado////////////////////////////////////////////////
    $("#tableEulerEa").html("")
    $("#tableEulerEb").html("")
    initVal()
    vx=Vix
    vy=Viy
    datosEuler=[]
    i=0
        ////Inicio Tabla Euler Mejorado////////////////////////////
    while (y > 0) {
        $("#tableEulerEa").append(' \
            <tr>\
                <td>'+t.toFixed(2)+'s</td>\
                <td>'+x.toFixed(3)+'m</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].x - x).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].x - x)/datosGen1[i].x).toFixed(3))+'</td>\
                <td>'+y.toFixed(3)+'m</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].y - y).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].y - y)/datosGen1[i].y).toFixed(3))+'</td>\
                <td>'+vx.toFixed(3)+'m/s</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].vx - vx).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].vx - vx)/datosGen1[i].vx).toFixed(3))+'</td>\
                <td>'+vy.toFixed(3)+'m/s</td>\
                <td style="border: 1px solid orange">'+Math.abs((datosGen1[i].vy - vy).toFixed(3))+'</td>\
                <td style="border: 1px solid orange">'+Math.abs(((datosGen1[i].vy - vy)/datosGen1[i].vy).toFixed(3))+'</td>\
            </tr>\ ');
        t=math.add(math.bignumber(t),math.bignumber(tPaso))
        x=x+tPaso*vx.toFixed(3)
        y=y+tPaso*vy.toFixed(3)
        vx=vx+tPaso*((-gama)*vx)
        vy=vy+tPaso*((-gama)*vy+(-g))
        datosEuler.push({"t": parseFloat(t),"x":x,"y":y,"vx":vx, "vy": vy})
        i++
    }
        ////FIN Tabla Euler Ea////////////////////////////
    //////Fin Euler////////////////////////////////////////////////

}

function tabTiroGen(){
    $("#Euler").hide("fast")
    $("#Tiro_Parabolico_Fv").show("hide")
}

function tabEuler(){
    $("#Tiro_Parabolico_Fv").hide("fast")
    $("#Euler").show("hide")
}