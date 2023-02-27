var ancho = screen.width;
const cursor = document.querySelector(".cursor")
const cursor2 = document.querySelector(".cursor2")
const circularButton = document.querySelector('.circular-button')

var anx = 0;
var aly = 0;
var y = 0;

if(ancho >= 778){
    // ---------------------------------- CURSOR ----------------------------------
        
    document.addEventListener('mousemove', e => {
        anx = (e.clientX);
        aly = (e.clientY);
        var al = aly + y;
        cursor2.setAttribute("style", "top: "+(al+20)+"px; left: "+(anx+20)+"px;");
        cursor.setAttribute("style", "top: "+(al+5)+"px; left: "+(anx+5)+"px;");

    
    });
    window.addEventListener('scroll', e=>{
        y = window.scrollY;
        var Y1 = y + aly;
        cursor2.setAttribute("style", "top: "+(Y1+20)+"px; left: "+(anx+20)+"px;");
        cursor.setAttribute("style", "top: "+(Y1+5)+"px; left: "+(anx+5)+"px;");
    }); 
}

function agra(ancho){
    cursor.classList.add('cur');
    cursor2.classList.add('cur2');
}
function agra2(ancho){
    cursor.classList.remove('cur');
    cursor2.classList.remove('cur2');
}

circularButton.addEventListener('click', e=>{
	location.href = "html/usuario.html";
});


//-----no se si se pueda usar jquery o ed3 así que voy a hacer funciones para programar más rápido en js puro

function LTrim(str) {
  if (str == null) {
    return null;
  }
  for (var i = 0; str.charAt(i) == " "; i++);
  return str.substring(i, str.length);
}
function RTrim(str) {
  if (str == null) {
    return null;
  }
  for (var i = str.length - 1; str.charAt(i) == " "; i--);
  return str.substring(0, i + 1);
}
function Trim(str) {
  return LTrim(RTrim(str));
}

function _I(elemento) {
  return document.getElementById(elemento);
}

function valor(elemento) {
  return _I(elemento).value;
} //-----valor de un campo
function v(elemento) {
	// console.log("realizado bien, Elemento: "+elemento)
  return Trim(valor(elemento)).toUpperCase();
} // valor de un campo sin caracteres de espacio al principio ni al final y combertido a mayusculas
function checkado(campo) {
  return _I(campo).checked;
} //obtebgo la propueiedad checado


function subir(
	nombre,
	semEmb,
	edad,
	tipoEmb,
	tipoSan,
	padeci,
	fechaPrimCit,
	fechaAliv,
	clave,
	direccion
  ) {
  
	const xhr = new XMLHttpRequest();
	xhr.open("POST", direccion + "/add_patient");
	xhr.setRequestHeader("Content-Type", "application/json");
	const body = JSON.stringify({
	  nombre: nombre,
	  semanas_emb: semEmb,
	  edad: edad,
	  tipo_emb: tipoEmb,
	  tipo_sangre: tipoSan,
	  padecimientos: padeci,
	  fecha_primera_cita: fechaPrimCit,
	  fecha_alivio: fechaAliv,
	  clave: clave,
	});
  
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status == 201) {
		console.log(JSON.parse(xhr.responseText));
  
		xhr.open("GET", direccion + "/mine_block");
		xhr.send();
		xhr.responseType = "json";
		xhr.onload = () => {
		  if (xhr.readyState == 4 && xhr.status == 200) {
			const data = xhr.response;
			console.log(data);
  
			// const xhr = new XMLHttpRequest();
			xhr.open("GET", direccion + "/get_nodos");
			xhr.send();
			xhr.responseType = "json";
			xhr.onload = () => {
			  if (xhr.readyState == 4 && xhr.status == 200) {
				const data = xhr.response;
				console.log();
				let nodos = data.nodes;
				for (let i = 0; i < nodos.length; i++) {
				  const xhr = new XMLHttpRequest();
				  xhr.open("GET", "http://" + nodos[i] + "/replace_chain");
				  xhr.send();
				  xhr.responseType = "json";
				  xhr.onload = () => {
					if (xhr.readyState == 4 && xhr.status == 200) {
					  const data = xhr.response;
					  console.log(data);
					  
					} else {
					  console.log(`Error: ${xhr.status}`);
					}
				  };
				}
				if (confirm("Confirma que ha validado los datos y desea continuar")) {
					location.href = "html/Sistema.html";
				}
			  } else {
				console.log(`Error: ${xhr.status}`);
			  }
			};
		  } else {
			console.log(`Error: ${xhr.status}`);
		  }
		};
	  } else {
		console.log(`Error: ${xhr.status}`);
	  }
	};
	xhr.send(body);
  }
//---------------------------------------------------------Funciones del formulario

_I("btnContinuar").onclick = function () {
  //-------vamos a meter los campos en variables
  let semanasEmbarazo = v("como-box");
  let nombre = v("nombre");
  let nss = v("nss");
  let edad = v("edad");
  let tipoEmbarazo = v("tipoEmbarazo");
  let tipoSangre = v("tipoSangre");
  let hipertencion = checkado("hptn") ? "Hipertension" : "";
  let diabetes = checkado("dbt") ? "Diabetes" : "";
  let renales = checkado("pren") ? "Renales" : "";
  let vih = checkado("vih") ? "VIH" : "";
  let vph = checkado("vph") ? "VPH" : "";
  let sida = checkado("sida") ? "SIDA" : "";
  let obesidad = checkado("obs") ? "obesidad" : "";
  let edadAvanzada = checkado("eava") ? "Edad Avanzada" : "";
  let sindromeOvarioPoliquistico = checkado("sop")
    ? "Sindrome de ovario poliquistico"
    : "";
  let cancer = checkado("cnc") ? "Cancer" : "";
  let leucemia = checkado("lcm") ? "Leucemia" : "";
  let adicciones = checkado("adi") ? "Adicciones" : "";
  let golpes = checkado("golp") ? "Golpes" : "";
  let ansiedad = checkado("ans") ? "Ansiedad" : "";
  let depresion = checkado("dpr") ? "Depresion" : "";
  let fechaInicio = v("fechai");
  let fechaAlivio = v("fechaa");

  //-------metimos los campos en variables, ahora los voy a meter a un objeto... pudimos hacerlo directo pero nos gusta la teatralidad
  let registroEmbarazo = {
    semanasEmbarazo: semanasEmbarazo,
    nombre: nombre,
    nss: nss,
    edad: edad,
    tipoEmbarazo: tipoEmbarazo,
    tipoSangre: tipoSangre,
    hipertencion: hipertencion,
    diabetes: diabetes,
    renales: renales,
    vih: vih,
    vph: vph,
    sida: sida,
    edadAvanzada: edadAvanzada,
    sindromeOvarioPoliquistico: sindromeOvarioPoliquistico,
    cancer: cancer,
    leucemia: leucemia,
    adicciones: adicciones,
    golpes: golpes,
    ansiedad: ansiedad,
    depresion: depresion,
    fechaInicio: fechaInicio,
    fechaAlivio: fechaAlivio,
  };

  //hay que guardarlo en local storage por si se va ocupar después en otra página
  localStorage.setItem("registroEmbarazo", JSON.stringify(registroEmbarazo));

  /*
	-----Si lo queremos recuperar despues vamos a usar   
	registroEmbarazo=JSON.parse(localStorage.getItem('registroEmbarazo',registroEmbarazo));
	*/

  //--------en consola se ve así:
  console.log(registroEmbarazo);

  subir(nombre,semanasEmbarazo,edad,tipoEmbarazo,tipoSangre, (hipertencion+"-"+diabetes+"-"+renales+"-"+vih+"-"+vph+"-"+sida+"-"+sindromeOvarioPoliquistico+"-"+cancer+"-"+obesidad+"-"+edadAvanzada+"-"+leucemia+"-"+adicciones+"-"+golpes+"-"+ansiedad+"-"+depresion),"vacio","vacio", nss, localStorage.getItem("IPBas"))
  console.log("subiendo")
//   --------lo mostramos y preguntamos
  
};
