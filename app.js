/* ============================================================
   SUPERMERCADO BABILONIA
   Aplicación de domicilios
   ============================================================ */


/* ============================================================
   1. CATÁLOGO
   ============================================================ */

const productos = [

    {
        id: 1,
        nombre: "Arroz",
        marca: "Roa",
        presentacion: "Libra",
        precio: 3000
    },

    {
        id: 2,
        nombre: "Arroz",
        marca: "Diana",
        presentacion: "Media libra",
        precio: 1800
    },

    {
        id: 3,
        nombre: "Huevos",
        marca: "Kikes",
        presentacion: "30 unidades",
        precio: 14500
    },

    {
        id: 4,
        nombre: "Arepas",
        marca: "Arepa blanca",
        presentacion: "5 unidades",
        precio: 6200
    },

    {
        id: 5,
        nombre: "Arepas",
        marca: "Arepa chocolo",
        presentacion: "6 unidades",
        precio: 6500
    }

];


/* ============================================================
   2. ESTADO DE LA APLICACIÓN
   ============================================================ */

/*
   Aquí almacenamos los productos que el cliente
   ha seleccionado.

   Ejemplo:

   [
       {
           producto: Arroz Roa,
           cantidad: 2
       }
   ]
*/

let carrito = [];


/* ============================================================
   3. ELEMENTOS HTML
   ============================================================ */

const contenedorProductos =
    document.getElementById("productos");

const contadorCarrito =
    document.getElementById("contador-carrito");

const modalCarrito =
    document.getElementById("modal-carrito");

const contenidoCarrito =
    document.getElementById("contenido-carrito");

const totalCarrito =
    document.getElementById("total-carrito");

const buscador =
    document.getElementById("buscador-productos");


/* ============================================================
   4. FORMATEAR PRECIOS
   ============================================================ */

function formatoPrecio(valor) {

    return valor.toLocaleString("es-CO");

}


/* ============================================================
   5. MOSTRAR PRODUCTOS
   ============================================================ */

function mostrarProductos(lista = productos) {

    contenedorProductos.innerHTML = "";

    lista.forEach(producto => {

        /*
           Buscamos si este producto ya está
           en el carrito.
        */

        const itemCarrito =
            carrito.find(item =>
                item.producto.id === producto.id
            );


        const cantidad =
            itemCarrito
                ? itemCarrito.cantidad
                : 0;


        /*
           Creamos la tarjeta.
        */

        const tarjeta =
            document.createElement("article");


        tarjeta.className = "producto";


        tarjeta.innerHTML = `

            <h3>
                ${producto.nombre}
            </h3>

            <div class="producto-info">

                ${producto.marca}
                ·
                ${producto.presentacion}

            </div>

            <div class="producto-footer">

                <strong class="producto-precio">

                    $${formatoPrecio(producto.precio)}

                </strong>


                <div class="cantidad">

                    <button
                        onclick="cambiarCantidad(${producto.id}, -1)"
                    >
                        −
                    </button>


                    <span>
                        ${cantidad}
                    </span>


                    <button
                        onclick="cambiarCantidad(${producto.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

        `;


        contenedorProductos.appendChild(tarjeta);

    });

}


/* ============================================================
   6. CAMBIAR CANTIDAD
   ============================================================ */

function cambiarCantidad(idProducto, cambio) {

    /*
       Buscamos el producto en nuestro catálogo.
    */

    const producto =
        productos.find(item =>
            item.id === idProducto
        );


    if (!producto) {
        return;
    }


    /*
       Buscamos si ya existe en el carrito.
    */

    let itemCarrito =
        carrito.find(item =>
            item.producto.id === idProducto
        );


    /*
       Si no existe y estamos agregando (+),
       lo creamos.
    */

    if (!itemCarrito && cambio > 0) {

        carrito.push({

            producto: producto,

            cantidad: 1

        });

    }


    /*
       Si ya existe, modificamos su cantidad.
    */

    else if (itemCarrito) {

        itemCarrito.cantidad += cambio;


        /*
           Si llega a cero, eliminamos
           el producto del carrito.
        */

        if (itemCarrito.cantidad <= 0) {

            carrito =
                carrito.filter(item =>
                    item.producto.id !== idProducto
                );

        }

    }


    /*
       Actualizamos la interfaz.
    */

    mostrarProductos();

    actualizarCarrito();

}


/* ============================================================
   7. ACTUALIZAR CONTADOR DEL CARRITO
   ============================================================ */

function actualizarCarrito() {

    /*
       Sumamos todas las cantidades.
    */

    const cantidadTotal =
        carrito.reduce(
            (total, item) =>
                total + item.cantidad,
            0
        );


    contadorCarrito.textContent =
        cantidadTotal;


    /*
       Actualizamos también el contenido
       del carrito.
    */

    mostrarCarrito();

}


/* ============================================================
   8. MOSTRAR CARRITO
   ============================================================ */

function mostrarCarrito() {

    contenidoCarrito.innerHTML = "";


    /*
       Si el carrito está vacío.
    */

    if (carrito.length === 0) {

        contenidoCarrito.innerHTML = `

            <p>
                Tu pedido está vacío.
            </p>

        `;

        totalCarrito.textContent = "$0";

        return;

    }


    let total = 0;


    carrito.forEach(item => {

        const subtotal =
            item.producto.precio *
            item.cantidad;


        total += subtotal;


        const elemento =
            document.createElement("div");


        elemento.className =
            "item-carrito";


        elemento.innerHTML = `

            <div class="item-carrito-info">

                <strong>
                    ${item.cantidad} ×
                    ${item.producto.nombre}
                </strong>

                <small>
                    ${item.producto.marca}
                    ·
                    ${item.producto.presentacion}
                </small>

            </div>


            <div class="item-carrito-precio">

                $${formatoPrecio(subtotal)}

            </div>

        `;


        contenidoCarrito.appendChild(elemento);

    });


    totalCarrito.textContent =
        `$${formatoPrecio(total)}`;

}


/* ============================================================
   9. ABRIR CARRITO
   ============================================================ */

document
    .getElementById("btn-carrito-header")
    .addEventListener("click", function() {

        modalCarrito.classList.remove("oculto");

    });


/* ============================================================
   10. CERRAR CARRITO
   ============================================================ */

document
    .getElementById("cerrar-carrito")
    .addEventListener("click", function() {

        modalCarrito.classList.add("oculto");

    });


/* ============================================================
   11. BUSCADOR
   ============================================================ */

buscador.addEventListener("input", function() {

    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    /*
       Si no hay texto,
       mostramos todos los productos.
    */

    if (texto === "") {

        mostrarProductos();

        return;

    }


    /*
       Buscamos coincidencias
       en nombre, marca y presentación.
    */

    const resultados =
        productos.filter(producto => {

            const informacion = `

                ${producto.nombre}
                ${producto.marca}
                ${producto.presentacion}

            `.toLowerCase();


            return informacion.includes(texto);

        });


    mostrarProductos(resultados);

});


/* ============================================================
   12. CONTINUAR CON EL PEDIDO
   ============================================================ */

document
    .getElementById("btn-continuar")
    .addEventListener("click", function() {

        if (carrito.length === 0) {

            alert(
                "Agrega al menos un producto al pedido."
            );

            return;

        }


        modalCarrito.classList.add("oculto");

        document
            .getElementById("modal-domicilio")
            .classList.remove("oculto");

    });


/* ============================================================
   13. CERRAR FORMULARIO
   ============================================================ */

document
    .getElementById("cerrar-domicilio")
    .addEventListener("click", function() {

        document
            .getElementById("modal-domicilio")
            .classList.add("oculto");

    });


/* ============================================================
   14. CONFIRMAR PEDIDO
   ============================================================ */

document
    .getElementById("formulario-domicilio")
    .addEventListener("submit", function(event) {

        /*
           Evitamos que el navegador
           recargue la página.
        */

        event.preventDefault();


        /*
           Generamos un número de pedido
           sencillo para nuestras pruebas.
        */

        const numeroPedido =
            Math.floor(
                10000 + Math.random() * 90000
            );


        /*
           Calculamos el total.
        */

        const total =
            carrito.reduce(
                (resultado, item) =>
                    resultado +
                    (
                        item.producto.precio *
                        item.cantidad
                    ),
                0
            );


        /*
           Mostramos información del pedido.
        */

        document
            .getElementById("numero-pedido")
            .textContent =
                `#${numeroPedido}`;


        document
            .getElementById("total-confirmacion")
            .textContent =
                `$${formatoPrecio(total)}`;


        /*
           Cerramos formulario.
        */

        document
            .getElementById("modal-domicilio")
            .classList.add("oculto");


        /*
           Mostramos confirmación.
        */

        document
            .getElementById("modal-confirmacion")
            .classList.remove("oculto");

    });


/* ============================================================
   15. FINALIZAR
   ============================================================ */

document
    .getElementById("cerrar-confirmacion")
    .addEventListener("click", function() {

        /*
           Cerramos la confirmación.
        */

        document
            .getElementById("modal-confirmacion")
            .classList.add("oculto");


        /*
           Limpiamos el carrito.
        */

        carrito = [];


        /*
           Actualizamos la pantalla.
        */

        mostrarProductos();

        actualizarCarrito();


        /*
           Limpiamos el formulario.
        */

        document
            .getElementById("formulario-domicilio")
            .reset();

    });


/* ============================================================
   16. INICIAR APLICACIÓN
   ============================================================ */

mostrarProductos();

actualizarCarrito();