const NIVEL_INICIAL = 1;
const MAX_ENERGIA = 100;
const MIN_ATAQUE = 1;
const MIN_DEFENSA = 1;
const MIN_PODER = 1;
const MIN_ENERGIA = 0;


function daño(atacante, atacado) {
    let dañoPotencial = Math.round((10*atacante.nivel*atacante.ataque)/(atacado.nivel*atacado.defensa));
    return Math.min(atacado.energía, dañoPotencial);
}

// Ejercicio 1
function Slime(ataque, defensa) {
    this.nivel = NIVEL_INICIAL;
    this.energía = MAX_ENERGIA;
    this.ataque = Math.max(MIN_ATAQUE, ataque);
    this.defensa = Math.max(MIN_DEFENSA, defensa);
}


// Ejercicio 2
Slime.prototype.actualizarEnergía = function(incremento) {
    this.energía = Math.max(MIN_ENERGIA, Math.min(MAX_ENERGIA, this.energía + incremento))
}


// Ejercicio 3
Slime.prototype.atacar = function(oponente) {
    if(this.energía == MIN_ENERGIA)
        return;

    let d = daño(this, oponente);

    this.actualizarEnergía(d);
    oponente.actualizarEnergía(-d);
}


// Ejercicio 4
Slime.prototype.duelo = function(oponente) {
    let oponente_energía_init = oponente.energía;
    let ganador;

    this.atacar(oponente);
    oponente.atacar(this);

    if(oponente.energía < oponente_energía_init)
        ganador = this;
    else
        ganador = oponente;
    
    ganador.nivel++;
    return ganador;
}


// Ejercicio 5
function SlimeSanador(ataque, defensa, poder) {
    Slime.call(this, ataque, defensa);

    this.poder = Math.max(MIN_PODER, poder);
}

Object.setPrototypeOf(SlimeSanador.prototype, Slime.prototype);

SlimeSanador.prototype.curar = function (paciente) {
    paciente.actualizarEnergía(this.poder * this.nivel);
}


// Ejercicio 6
Slime.prototype.reproducirse = function() {
    let cost = Math.floor(100/this.nivel);
    let baby_slime;

    if(this.energía <= cost)
        return;

    this.actualizarEnergía(-cost);
    baby_slime = Object.create(this);
    
    baby_slime.nivel = 1;
    baby_slime.energía = MAX_ENERGIA;

    return baby_slime;
}

Slime.prototype.esDescendienteDe = function(otro) {
    let descendiente = Object.getPrototypeOf(this);
    while(descendiente != null){
        if(descendiente === otro)
            return true;
        
        descendiente = Object.getPrototypeOf(descendiente);
    }

    return false;
}


// Tests

function testEjemplo(res) {
  res.write("\n|| Probando la suma ||\n");
  let sumando1 = 4;
  let sumando2 = 6;
  let resultado_obtenido = sumando1 + sumando2;
  let resultado_esperado = 10;
  res.write("El resultado de sumar " + sumando1 + " y " + sumando2 + " da " + resultado_obtenido, (resultado_obtenido===resultado_esperado));
  sumando1 = "4";
  sumando2 = "6";
  resultado_obtenido = sumando1 + sumando2;
  resultado_esperado = "10";
  res.write("El resultado de sumar " + sumando1 + " y " + sumando2 + " da " + resultado_obtenido, (resultado_obtenido===resultado_esperado));
  sumando1 = 4;
  sumando2 = undefined;
  resultado_obtenido = sumando1 + sumando2;
  res.write("El resultado de sumar " + sumando1 + " y " + sumando2 + " da " + resultado_obtenido);
}


// Test Ejercicio 1
function testEjercicio1(res) {
    let slimeOfensivo = new Slime(20, 10);
    let slimeDefensivo = new Slime(10, 20);
    let slimeBalanceado = new Slime(15, 15);
    let slimeDesinflado = new Slime(0, 0);
    
    let todosLosSlimes = new Array(slimeOfensivo, slimeDefensivo, slimeBalanceado, slimeDesinflado);

	res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.ataque == 20)} tiene ataque 20.`, slimeOfensivo.ataque == 20);
	res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.defensa == 10)} tiene defensa 10.`, slimeOfensivo.defensa == 10);
	res.write(`El slime defensivo ${si_o_no(slimeDefensivo.ataque == 10)} tiene ataque 10.`, slimeDefensivo.ataque == 10);
	res.write(`El slime defensivo ${si_o_no(slimeDefensivo.defensa == 20)} tiene defensa 20.`, slimeDefensivo.defensa == 20);
	res.write(`El slime balanceado ${si_o_no(slimeBalanceado.ataque == 15)} tiene ataque 15.`, slimeBalanceado.ataque == 15);
	res.write(`El slime balanceado ${si_o_no(slimeBalanceado.defensa == 15)} tiene defensa 15.`, slimeBalanceado.defensa == 15);
	res.write(`El slime desinflado ${si_o_no(slimeDesinflado.ataque == 1)} tiene ataque 1.`, slimeDesinflado.ataque == 1);
	res.write(`El slime desinflado ${si_o_no(slimeDesinflado.defensa == 1)} tiene defensa 1.`, slimeDesinflado.defensa == 1);
    let todosNivel1 = todosLosSlimes.reduce((res, x) => x.nivel == 1 && res, true);
    let todosEnergíaMáxima = todosLosSlimes.reduce((res, x) => x.energía == MAX_ENERGIA && res, true);
	res.write(`Se verifica que ${si_o_no(todosNivel1)} todos los slimes tienen nivel 1.`, todosNivel1);
	res.write(`Se verifica que ${si_o_no(todosEnergíaMáxima)} todos los slimes tienen la máxima energía posible.`, todosEnergíaMáxima);

  //mis tests
  let slimeAntipatico = new Slime(-1, -2);
  let slimeEspada = new Slime(25, -25);
  let slimeEscudo = new Slime(-25, 25);

  res.write(`El slime antipatico ${si_o_no(slimeAntipatico.ataque == 1)} tiene ataque 1.`, slimeAntipatico.ataque == 1);
  res.write(`El slime antipatico ${si_o_no(slimeAntipatico.defensa == 1)} tiene defensa 1.`, slimeAntipatico.defensa == 1);
  res.write(`El slime espada ${si_o_no(slimeEspada.ataque == 25)} tiene ataque 1.`, slimeEspada.ataque == 25);
  res.write(`El slime espada ${si_o_no(slimeEspada.defensa == 1)} tiene defensa 1.`, slimeEspada.defensa == 1);
  res.write(`El slime escudo ${si_o_no(slimeEscudo.ataque == 1)} tiene ataque 1.`, slimeEscudo.ataque == 1);
  res.write(`El slime escudo ${si_o_no(slimeEscudo.defensa == 25)} tiene defensa 1.`, slimeEscudo.defensa == 25);
}

// Test Ejercicio 2
function testEjercicio2(res) {
    let slimeBalanceado = new Slime(15, 15);

    res.write(`El slime balanceado ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA)} empieza con la máxima energía posible.`, slimeBalanceado.energía == MAX_ENERGIA);
    slimeBalanceado.actualizarEnergía(20);
    res.write(`Después de comer, ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA)} sigue teniendo la misma energía (ya era la máxima posible).`, slimeBalanceado.energía == MAX_ENERGIA);
    slimeBalanceado.actualizarEnergía(-25);
    res.write(`Después de cortarse con una piedra filosa, ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA-25)} perdió 25 puntos de energía.`, slimeBalanceado.energía == MAX_ENERGIA-25);
    slimeBalanceado.actualizarEnergía(-MAX_ENERGIA);
    res.write(`Después de caerse por un precipicio, ${si_o_no(slimeBalanceado.energía == 0)} se quedó sin energía.`, slimeBalanceado.energía == 0);
    slimeBalanceado.actualizarEnergía(MAX_ENERGIA+100);
    res.write(`Pero en el fondo del precipicio encontró mucha comida y ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA)} se recuperó.`, slimeBalanceado.energía == MAX_ENERGIA);

    //mis tests
    slimeBalanceado.actualizarEnergía(-MAX_ENERGIA - 25);
    res.write(`Y despues se cayo nuevamente por otro precipicio y ${si_o_no(slimeBalanceado.energía == MIN_ENERGIA)} se quedo sin energia.`, slimeBalanceado.energía == MIN_ENERGIA);
    slimeBalanceado.actualizarEnergía(25);
    res.write(`Por suerte habia un local de empanadas ahi abajo y luego de comer ${si_o_no(slimeBalanceado.energía == 25)} recupero un poco de energia.`, slimeBalanceado.energía == 25);
}

// Test Ejercicio 3
function testEjercicio3(res) {
    let slimeOfensivo = new Slime(20, 10);
    let slimeDefensivo = new Slime(10, 20);
    let slimeBalanceado = new Slime(15, 15);
    let slimeSinEnergía = new Slime(20, 20);
    slimeSinEnergía.energía = 0;

    slimeOfensivo.atacar(slimeDefensivo);
    res.write(`El slime ofensivo ataca al defensivo y su energía ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA)} se mantiene igual (ya era la máxima posible).`, slimeOfensivo.energía == MAX_ENERGIA);
    res.write(`El slime defensivo ${si_o_no(slimeDefensivo.energía == MAX_ENERGIA-10)} perdió 10 puntos de energía.`, slimeDefensivo.energía == MAX_ENERGIA-10);
    slimeBalanceado.atacar(slimeOfensivo);
    res.write(`El slime balanceado ataca al ofensivo y ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-15)} le quita 15 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-15);
    slimeDefensivo.atacar(slimeOfensivo);
    res.write(`El slime defensivo ataca al ofensivo y ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-25)} le quita otros 10 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-25);
    res.write(`El slime defensivo ${si_o_no(slimeDefensivo.energía == MAX_ENERGIA)} se recuperó por completo.`, slimeDefensivo.energía == MAX_ENERGIA);
    slimeOfensivo.atacar(slimeBalanceado);
    res.write(`El slime ofensivo ataca al balanceado y ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA-13)} le quita 13 puntos de energía.`, slimeBalanceado.energía == MAX_ENERGIA-13);
    res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-12)} recuperó 13 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-12);
    slimeBalanceado.atacar(slimeOfensivo);
    res.write(`El slime balanceado ataca al ofensivo y ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-27)} le quita 15 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-27);
    res.write(`El slime balanceado ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA)} se recuperó por completo.`, slimeBalanceado.energía == MAX_ENERGIA);
    slimeSinEnergía.atacar(slimeBalanceado);
    res.write(`El slime sin energía intenta atacar al balanceado y su esfuerzo ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA)} es inútil.`, slimeBalanceado.energía == MAX_ENERGIA);

    // mis tests
    let slimeEspada = new Slime(25, -25);
    let slimeEscudo = new Slime(-25, 25);

    slimeEspada.atacar(slimeEscudo);
    res.write(`El slime espada ataca al slime escudo y su energía ${si_o_no(slimeEscudo.energía == MAX_ENERGIA-10)} baja.`, slimeEscudo.energía == MAX_ENERGIA-10);
    slimeEscudo.actualizarEnergía(-MAX_ENERGIA+5);
    slimeEspada.atacar(slimeEscudo);
    res.write(`El slime espada ataca al slime escudo y ${si_o_no(slimeEscudo.energía == MIN_ENERGIA)} se queda sin energia.`, slimeEscudo.energía == MIN_ENERGIA);
}

// Test Ejercicio 4
function testEjercicio4(res) {
    let slimeOfensivo = new Slime(20, 10);
    let slimeDefensivo = new Slime(10, 20);
    let slimeBalanceado = new Slime(15, 15);
    let slimeSinEnergía = new Slime(20, 20);
    slimeSinEnergía.energía = 0;
    
    let ganador1 = slimeOfensivo.duelo(slimeDefensivo);
    res.write(`El slime ofensivo reta a duelo al defensivo y ${si_o_no(ganador1 === slimeDefensivo)} gana el defensivo.`, ganador1 == slimeDefensivo);
    res.write(`El slime defensivo ahora ${si_o_no(slimeDefensivo.nivel == 2)} tiene nivel 2.`, slimeDefensivo.nivel == 2);
    res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-10)} perdió 10 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-10);
    let ganador2 = slimeBalanceado.duelo(slimeDefensivo);
    res.write(`El slime balanceado reta a duelo al defensivo y ${si_o_no(ganador2 === slimeDefensivo)} gana el defensivo.`, ganador2 == slimeDefensivo);
    res.write(`El slime defensivo ahora ${si_o_no(slimeDefensivo.nivel == 3)} tiene nivel 3.`, slimeDefensivo.nivel == 3);
    res.write(`El slime balanceado ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA-13)} perdió 13 puntos de energía.`, slimeBalanceado.energía == MAX_ENERGIA-13);
    let ganador3 = slimeBalanceado.duelo(slimeOfensivo);
    res.write(`El slime balanceado reta a duelo al ofensivo y ${si_o_no(ganador3 === slimeBalanceado)} le gana.`, ganador3 == slimeBalanceado);
    res.write(`El slime balanceado ahora ${si_o_no(slimeBalanceado.nivel == 2)} tiene nivel 2.`, slimeBalanceado.nivel == 2);
    res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-12)} perdió otros 2 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-12);
    res.write(`El slime balanceado ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA-13)} tiene la misma energía que antes del duelo.`, slimeBalanceado.energía == MAX_ENERGIA-13);
    let ganador4 = slimeOfensivo.duelo(slimeSinEnergía);
    res.write(`El slime ofensivo reta a duelo al slime sin energía ${si_o_no(ganador4 === slimeSinEnergía)} pierde (no puede hacerle daño).`, ganador4 == slimeSinEnergía);
    res.write(`El slime sin energía ahora ${si_o_no(slimeSinEnergía.nivel == 2)} tiene nivel 2.`, slimeSinEnergía.nivel == 2);
    res.write(`...Pero ${si_o_no(slimeSinEnergía.energía == 0)} sigue sin energía.`, slimeBalanceado.energía == slimeSinEnergía.energía == 0);
    res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-12)} tiene la misma energía que antes del duelo.`, slimeOfensivo.energía == MAX_ENERGIA-12);
    let ganador5 = slimeDefensivo.duelo(slimeOfensivo);
    res.write(`El slime defensivo reta a duelo al ofensivo y ${si_o_no(ganador5 === slimeDefensivo)} le gana.`, ganador5 == slimeDefensivo);
    res.write(`El slime defensivo ahora ${si_o_no(slimeDefensivo.nivel == 4)} tiene nivel 4.`, slimeDefensivo.nivel == 4);
    res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-39)} perdió otros 27 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-39);
    let ganador6 = slimeSinEnergía.duelo(slimeOfensivo);
    res.write(`El slime sin energía reta a duelo al ofensivo y ${si_o_no(ganador6 === slimeOfensivo)} pierde (no puede hacerle daño).`, ganador6 == slimeOfensivo);
    res.write(`El slime ofensivo ahora ${si_o_no(slimeOfensivo.nivel == 2)} tiene nivel 2.`, slimeOfensivo.nivel == 2);

    // mis tests
    let slimeEspada = new Slime(25, -25);
    let slimeEscudo = new Slime(-25, 25);
    let slimeArquero = new Slime(15, 10);
    let slimeAsesino = new Slime(10, 15);

    let ganador7 = slimeEspada.duelo(slimeEscudo);
    res.write(`El slime espada reta a duelo al escudo y ${si_o_no(ganador7 === slimeEscudo)} gana el escudo.`, ganador7 == slimeEscudo);
    let ganador8 = slimeEspada.duelo(slimeEscudo);
    res.write(`El slime espada reta a duelo al escudo y ${si_o_no(ganador8 === slimeEscudo)} gana el escudo.`, ganador8 == slimeEscudo);
    res.write(`El slime escudo ahora ${si_o_no(slimeEscudo.nivel == 3)} tiene nivel 3.`, slimeEscudo.nivel == 3);
    let ganador9 = slimeEscudo.duelo(slimeEspada);
    res.write(`El slime escudo reta a duelo al espada y ${si_o_no(ganador9 === slimeEscudo)} gana el escudo.`, ganador9 == slimeEscudo);
    let ganador10 = slimeAsesino.duelo(slimeArquero);
    res.write(`El slime asesino reta a duelo al arquero y ${si_o_no(ganador10 === slimeArquero)} gana el arquero.`, ganador10 == slimeArquero);
    let ganador11 = slimeArquero.duelo(slimeAsesino);
    res.write(`El slime arquero reta a duelo al asesino y ${si_o_no(ganador11 === slimeArquero)} gana el arquero.`, ganador11 == slimeArquero);
}

// Test Ejercicio 5
function testEjercicio5(res) {
    let slimeOfensivo = new Slime(20, 10);
    let slimeDesinflado = new Slime(0, 0);
    let slimeBalanceado = new Slime(15, 15);
    slimeOfensivo.nivel = 2;
    slimeBalanceado.nivel = 2;
    slimeOfensivo.actualizarEnergía(-39);
    slimeBalanceado.actualizarEnergía(-13);
    let slimeSanador = new SlimeSanador(10, 15, 20);
    
    res.write(`El slime sanador ${si_o_no(slimeSanador.poder == 20)} tiene 20 puntos de poder.`, slimeSanador.poder == 20);
    slimeSanador.curar(slimeOfensivo);
    res.write(`El slime sanador cura al ofensivo, quien ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-19)} recupera 20 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-19);
    slimeSanador.curar(slimeBalanceado);
    res.write(`El slime sanador cura al balanceado, quien ${si_o_no(slimeBalanceado.energía == MAX_ENERGIA)} recupera 13 puntos de energía.`, slimeBalanceado.energía == MAX_ENERGIA);
    slimeOfensivo.duelo(slimeSanador);
    res.write(`El slime ofensivo reta a duelo al sanador y ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA-5)} recupera 14 puntos de energía.`, slimeOfensivo.energía == MAX_ENERGIA-5);
    slimeSanador.curar(slimeSanador);
    res.write(`El slime sanador se cura y ${si_o_no(slimeSanador.energía == MAX_ENERGIA-2)} recupera 20 puntos de energía.`, slimeSanador.energía == MAX_ENERGIA-2);
    slimeDesinflado.duelo(slimeSanador);
    res.write(`El slime desinflado reta a duelo al sanador y ${si_o_no(slimeDesinflado.energía == 0)} se queda sin energía.`, slimeDesinflado.energía == 0);
    res.write(`El slime sanador ${si_o_no(slimeSanador.energía == MAX_ENERGIA)} se recuperó por completo.`, slimeSanador.energía == MAX_ENERGIA);
    slimeSanador.curar(slimeDesinflado);
    res.write(`El slime sanador cura al desinflado, quien ${si_o_no(slimeDesinflado.energía == MAX_ENERGIA-60)} recupera 40 puntos de energía.`, slimeDesinflado.energía == MAX_ENERGIA-60);
    
    // mis tests
    let slimeSanadorJr = new SlimeSanador(10, 15, -1);
    let slimeEspada = new Slime(25, -25);

    slimeEspada.actualizarEnergía(-2);

    res.write(`El slime sanador junior ${si_o_no(slimeSanadorJr.poder == 1)} tiene 1 punto de poder.`, slimeSanadorJr.poder == 1);
    slimeSanadorJr.curar(slimeEspada);
    res.write(`El slime sanador junior cura al espada, quien ${si_o_no(slimeEspada.energía == MAX_ENERGIA-1)} recupera 1 puntos de energía.`, slimeEspada.energía == MAX_ENERGIA-1);
    slimeSanadorJr.curar(slimeEspada);
    res.write(`El slime sanador junior cura al espada, quien ${si_o_no(slimeEspada.energía == MAX_ENERGIA)} se recuperó por completo.`, slimeEspada.energía == MAX_ENERGIA);
    slimeSanadorJr.curar(slimeEspada);
    res.write(`El slime sanador junior cura al espada, quien ${si_o_no(slimeEspada.energía != MAX_ENERGIA)} le afecto estando ya con energia al maximo.`, slimeEspada.energía == MAX_ENERGIA);
}
    
    
// Test Ejercicio 6
function testEjercicio6(res) {
    //Todos los slimes como quedaron hasta ahora.
    let slimeOfensivo = new Slime(20, 10);
    let slimeDesinflado = new Slime(0, 0);
    let slimeBalanceado = new Slime(15, 15);
    let slimeSanador = new SlimeSanador(10, 15, 20);
    let slimeDefensivo = new Slime(10, 20);
    let slimeSinEnergía = new Slime(20, 20);
    slimeOfensivo.nivel = 2;
    slimeBalanceado.nivel = 2;
    slimeDefensivo.nivel = 4;
    slimeSanador.nivel = 2;
    slimeDesinflado.actualizarEnergía(-60);
    slimeOfensivo.actualizarEnergía(-5);
    slimeSinEnergía.energía = 0;

    let intento1 = slimeSinEnergía.reproducirse();
    res.write(`El slime sin energía intenta reproducirse pero ${si_o_no(intento1 === undefined)} le falta energía.`, intento1 === undefined);
    let intento2 = slimeDesinflado.reproducirse();
    res.write(`El slime desinflado intenta reproducirse pero ${si_o_no(intento2 === undefined)} le falta energía.`, intento2 === undefined);
    res.write(`El slime desinflado ${si_o_no(slimeDesinflado.energía == MAX_ENERGIA-60)} conserva su energía.`, slimeDesinflado.energía == MAX_ENERGIA-60);
    let slimeOfensivo2 = slimeOfensivo.reproducirse();
    let slimeOfensivo2Bien = (slimeOfensivo2.ataque == 20) && (slimeOfensivo2.defensa == 10) && (slimeOfensivo2.nivel == 1) && (slimeOfensivo2.energía == MAX_ENERGIA);
    res.write(`El slime ofensivo intenta reproducirse y ${si_o_no(slimeOfensivo2Bien)} tiene una cría con los atributos esperados.`, slimeOfensivo2Bien);
    res.write(`El slime ofensivo ${si_o_no(slimeOfensivo.energía == MAX_ENERGIA/2-5)} gastó la energía esperada.`, slimeOfensivo.energía == MAX_ENERGIA-55);
    let slimeDefensivo2 = slimeDefensivo.reproducirse();
    let slimeDefensivo2Bien = (slimeDefensivo2.ataque == 10) && (slimeDefensivo2.defensa == 20) && (slimeDefensivo2.nivel == 1) && (slimeDefensivo2.energía == MAX_ENERGIA);
    res.write(`El slime defensivo intenta reproducirse y ${si_o_no(slimeDefensivo2Bien)} tiene una cría con los atributos esperados.`, slimeDefensivo2Bien);
    res.write(`El slime defensivo ${si_o_no(slimeDefensivo.energía == MAX_ENERGIA*3/4)} gastó la energía esperada.`, slimeDefensivo.energía == MAX_ENERGIA*3/4);
    let slimeSanador2 = slimeSanador.reproducirse();
    let slimeSanador2Bien = (slimeSanador2.ataque == 10) && (slimeSanador2.defensa == 15) && (slimeSanador2.nivel == 1) && (slimeSanador2.energía == MAX_ENERGIA) && (slimeSanador2.poder == 20);
    res.write(`El slime sanador intenta reproducirse y ${si_o_no(slimeSanador2Bien)} tiene una cría con los atributos esperados.`, slimeSanador2Bien);
    res.write(`El slime defensivo ${si_o_no(slimeSanador.energía == MAX_ENERGIA/2)} gastó la mitad de sus puntos de energía.`, slimeSanador.energía == MAX_ENERGIA/2);
    let intento3 = slimeSanador2.reproducirse();
    res.write(`La cría del slime sanador intenta reproducirse pero ${si_o_no(intento3 === undefined)} le falta energía.`, intento3 === undefined);
    slimeSanador2.duelo(slimeDesinflado);
    let slimeSanador3 = slimeSanador2.reproducirse();
    res.write(`Luego de retar a duelo al slime desinflado, la cría del slime sanador ${si_o_no(slimeSanador3 !== undefined)} logra reproducirse.`, slimeSanador3 !== undefined);
    let todosLosSlimes = new Array(slimeOfensivo, slimeDesinflado, slimeBalanceado, slimeSanador, slimeDefensivo, slimeSinEnergía, slimeOfensivo2, slimeDefensivo2, slimeSanador2, slimeSanador3);
    function curarSiEsDescendiente(sanador, otro) {
        if (sanador.esDescendienteDe(otro)) {
            sanador.curar(otro);
        }
    }    
    todosLosSlimes.map((e) => curarSiEsDescendiente(slimeSanador3, e));
    let curaciónCorrecta = (slimeOfensivo.energía == MAX_ENERGIA-55) && (slimeDesinflado.energía == 0) && (slimeBalanceado.energía == MAX_ENERGIA) && (slimeSanador.energía == MAX_ENERGIA/2+20) && (slimeDefensivo.energía == MAX_ENERGIA*3/4) && (slimeSinEnergía.energía == 0) && (slimeOfensivo2.energía == MAX_ENERGIA) && (slimeDefensivo2.energía == MAX_ENERGIA) && (slimeSanador2.energía == MAX_ENERGIA/2+20) && (slimeSanador3.energía == MAX_ENERGIA);
    res.write(`El nuevo slime sanador ${si_o_no(curaciónCorrecta)} cura correctamente a todos sus antepasados.`, curaciónCorrecta);
    function cantDescendientes(slime) {
        return todosLosSlimes.reduce((res, e) =>res + (e.esDescendienteDe(slime) ? 1 : 0), 0);
    }
    res.write(`El slime ofensivo ${si_o_no(cantDescendientes(slimeOfensivo) == 1)} tiene un descendiente.`, cantDescendientes(slimeOfensivo) == 1);
    res.write(`El slime defensivo ${si_o_no(cantDescendientes(slimeDefensivo) == 1)} tiene un descendiente.`, cantDescendientes(slimeDefensivo) == 1);
    res.write(`El slime balanceado ${si_o_no(cantDescendientes(slimeBalanceado) != 0)} tiene descendencia.`, cantDescendientes(slimeBalanceado) == 0);
    res.write(`El slime sanador ${si_o_no(cantDescendientes(slimeSanador) == 2)} tiene dos descendientes.`, cantDescendientes(slimeSanador) == 2);

    // mis tests
    let slimeOriginal = new Slime(1000, 1000);
    slimeOriginal.nivel = 10;
    res.write("El slime original tuvo a slime primogenito");
    let slimePrimogenito = slimeOriginal.reproducirse();
    slimePrimogenito.nivel = 5;
    res.write("El slime original tuvo a slime asesino");
    let slimeAsesino = slimeOriginal.reproducirse();
    slimeAsesino.nivel = 5;
    res.write("El slime original tuvo a slime arquero");
    let slimeArquero = slimeOriginal.reproducirse();
    slimeArquero.nivel = 5;
    res.write("El slime original tuvo a slime olvidado");
    let slimeOlvidado = slimeOriginal.reproducirse();
    slimeOlvidado.nivel = 5;
    res.write("El slime olvidado tuvo a slime curador");
    let slimeCurador = slimeOlvidado.reproducirse();
    slimeCurador.nivel = 2;
    res.write("El slime primogenito tuvo a slime espada");
    let slimeEspada = slimePrimogenito.reproducirse();
    res.write("El slime olvidado tuvo a slime escudo");
    let slimeEscudo = slimeOlvidado.reproducirse();
    res.write("El slime curador tuvo a slime curador junior");
    let slimeCuradorJr = slimeCurador.reproducirse();

    todosLosSlimes = new Array(slimeOriginal, slimePrimogenito, slimeArquero, slimeAsesino, slimeCurador, slimeOlvidado, slimeCuradorJr, slimeEscudo, slimeEspada);

    res.write(`El slime original ${si_o_no(cantDescendientes(slimeOriginal) == 8)} tiene 8 descendientes.`, cantDescendientes(slimeOriginal) == 8);
    res.write(`El slime primogenito ${si_o_no(cantDescendientes(slimePrimogenito) == 1)} tiene un descendiente.`, cantDescendientes(slimePrimogenito) == 1);
    res.write(`El slime asesino ${si_o_no(cantDescendientes(slimeAsesino) != 0)} tiene un descendiente.`, cantDescendientes(slimeAsesino) == 0);
    res.write(`El slime arquero ${si_o_no(cantDescendientes(slimeArquero) != 0)} tiene un descendiente.`, cantDescendientes(slimeArquero) == 0);
    res.write(`El slime olvidado ${si_o_no(cantDescendientes(slimeOlvidado) == 3)} tiene tres descendientes.`, cantDescendientes(slimeOlvidado) == 3);
    res.write(`El slime curador ${si_o_no(cantDescendientes(slimeCurador) == 1)} tiene un descendiente.`, cantDescendientes(slimeCurador) == 1);
    res.write(`El slime espada ${si_o_no(cantDescendientes(slimeEspada) != 0)} tiene descendientes.`, cantDescendientes(slimeEspada) == 0);
    res.write(`El slime escudo ${si_o_no(cantDescendientes(slimeEscudo) != 0)} tiene descendientes.`, cantDescendientes(slimeEscudo) == 0);
    res.write(`El slime curador junior ${si_o_no(cantDescendientes(slimeCuradorJr) != 0)} tiene descendientes.`, cantDescendientes(slimeCuradorJr) == 0);

}