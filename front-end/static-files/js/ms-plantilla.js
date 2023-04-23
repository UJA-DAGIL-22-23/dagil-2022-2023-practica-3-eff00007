/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}


// Plantilla de datosAtletas vacíos
Plantilla.datosAtletasNulos = {
    nombre: "undefined",
    apellido: "undefined",
    edad: "undefined",
    dni: "undefined",
    medallas: "undefined",
    direccion: "undefined",
    rankingMundial: "undefined",
}

// Plantilla de tags 
Plantilla.plantillaTags = {

    "NOMBRE": "### NOMBRE ###",
    "APELLIDO": "### APELLIDO ###",
    "EDAD": "### EDAD ###",
    "DNI": "### DNI ###",
    "MEDALLAS": "### MEDALLAS ###",
    "DIRECCION": "### DIRECCION ###",
    "RANKINGMUNDIAL": "### RANKINGMUNDIAL ###"

}


/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}


/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}



Plantilla.plantillaTablaAtletas = {}

// Cabecera de la tabla para solo los nombres
Plantilla.plantillaTablaAtletas.cabeceraNombres = `<table width="100%" class="listado_Atletas">
<thead>
    <th width="15%">Nombre</th>
    <th width="15%">Apellido</th>
</thead>
<tbody>`;

// Cabecera de la tabla para todos los datos
Plantilla.plantillaTablaAtletas.cabeceraCompleta = `<table width="100%" class="listado_Atletas_completo">
<thead>
    <th >Dni</th>
    <th >Nombre</th>
    <th >Apellido</th>
    <th >RankingMundial</th>
    <th >Edad</th>
    <th >Direccion</th>
    <th >medallas</th>
</thead>
<tbody>`;

Plantilla.plantillaTablaAtletas.cuerpoNombres = `
<tr title="${Plantilla.plantillaTags.NOMBRE}">
    
    <td>${Plantilla.plantillaTags.NOMBRE}</td>
    <td>${Plantilla.plantillaTags.APELLIDO}</td>
    <td>
    <div></div>
</td>
</tr>
`;
//pie de la tabla 
Plantilla.plantillaTablaAtletas.pie = `</tbody>
</table>
`;
//Elementos RT que muestra los datos de un Atleta
Plantilla.plantillaTablaAtletas.cuerpoCompleto = `
<tr title="${Plantilla.plantillaTags.NOMBRE}">
    <td>${Plantilla.plantillaTags.DNI}</td>
    <td>${Plantilla.plantillaTags.NOMBRE}</td>
    <td>${Plantilla.plantillaTags.APELLIDO}</td>
    <td>${Plantilla.plantillaTags.RANKINGMUNDIAL}</td>
    <td>${Plantilla.plantillaTags.EDAD}</td>
    <td>${Plantilla.plantillaTags.DIRECCION}</td>
    <td>${Plantilla.plantillaTags["MEDALLAS"]}</td>
    <td>
    <div></div>
</td>
</tr>
`;



/**
 * @param {String} plantilla Cadena conteniendo HTML en la que se desea cambiar lso campos de la plantilla por datos
 * @param {Plantilla} Atleta Objeto con los datos del Atleta que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */ 
Plantilla.sustituyeTags = function (plantilla, Atleta) {
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.DNI, 'g'), Atleta.data.dni)
        .replace(new RegExp(Plantilla.plantillaTags.NOMBRE, 'g'), Atleta.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.APELLIDO, 'g'), Atleta.data.apellido)
        .replace(new RegExp(Plantilla.plantillaTags.RANKINGMUNDIAL, 'g'), Atleta.data.rankingMundial)
        .replace(new RegExp(Plantilla.plantillaTags.EDAD, 'g'), Atleta.data.edad)
        .replace(new RegExp(Plantilla.plantillaTags.DIRECCION, 'g'), Atleta.data.direccion.calle +", "+Atleta.data.direccion.numero +", "+Atleta.data.direccion.ciudad+", "+Atleta.data.direccion.pais)
        .replace(new RegExp(Plantilla.plantillaTags["MEDALLAS"], 'g'), Atleta.data.medallas)

}
/**
 * Actualiza el cuerpo de la tabla con los datos de el Atleta que se le pasa
 * @param {Atleta} Atleta Objeto con los datos de la persona que queremos escribir el TR
 * @returns La plantilla des cuerpo de la tabla con los datos actualizados
 */
Plantilla.plantillaTablaAtletas.actualiza = function (Atleta) {
    return Plantilla.sustituyeTags(this.cuerpoCompleto, Atleta)
}

/**
 * Actualiza el cuerpo de la tabla con los datos del Atleta que se le pasa
 * @param {Atleta} Atleta Objeto con los datos de la persona que queremos escribir el TR
 * @returns La plantilla de cuerpo de la tabla con los datos actualizados
 */
Plantilla.plantillaTablaAtletas.actualizaNombres = function (Atleta) {
    return Plantilla.sustituyeTags(this.cuerpoNombres, Atleta)
}

/**
 * Función que recuperar todos los pilotos llamando al MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recuperaCompleto = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio 
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_Atletas_completos"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los Atletas que se han descargado
    let vectorAtletas = null
    if (response) {
        vectorAtletas  = await response.json()
        callBackFn(vectorAtletas.data)
    }
}

/**
 * Función para mostrar solo los nombre de todos los Atletas
 * que se recuperan de la BBDD
 * @param {vector_de_Atletas} vector 
 */
Plantilla.imprimeCompleto = function (vector) {
    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaTablaAtletas.cabeceraCompleta
    if (vector && Array.isArray(vector)) {
        vector.forEach(e => msj += Plantilla.plantillaTablaAtletas.actualiza(e));
    }
    msj += Plantilla.plantillaTablaAtletas.pie

    // Borrar toda la información del Article y la sustituyo por la que ma interesa
    Frontend.Article.actualizar("Plantilla del listado de todos los datos de todos los Atletas", msj)
}


/**
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recupera = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio 
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_Atletas"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    
    let vectorAtletas = null
    if (response) {
        vectorAtletas  = await response.json()
        callBackFn(vectorAtletas.data)
    }
}


/**
 * Función principal para recuperar solo los nombres de los Atletas desde el MS, y posteriormente imprimirlos
 */
Plantilla.procesarListaEntera = function () {
    Plantilla.recuperaCompleto(Plantilla.imprimeCompleto);
}

/**
 * @param {vector_de_Atletas} vector 
 */
Plantilla.imprimeSoloNombres = function (vector) {
    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaTablaAtletas.cabeceraNombres
    if (vector && Array.isArray(vector)) {
        vector.forEach(e => msj += Plantilla.plantillaTablaAtletas.actualizaNombres(e));
    }
    msj += Plantilla.plantillaTablaAtletas.pie

    // Borrar toda la información del Article y la sustituyo por la que ma interesa
    Frontend.Article.actualizar("Plantilla del listado de los nombres de todos los Atletas", msj)
}


/**
 * Función principal para recuperar solo los nombres de los Atleta desde el MS, y posteriormente imprimirlos
 */
Plantilla.procesarListaNombre = function () {
    Plantilla.recupera(Plantilla.imprimeSoloNombres);
}

