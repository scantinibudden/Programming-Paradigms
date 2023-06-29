%direccion(?Dir)
direccion(derecha).
direccion(arriba).
direccion(abajo).
direccion(izquierda).

%contenidoValido(?Cont)
contenidoValido(pared).
contenidoValido(hielo).
contenidoValido(tesoro).
contenidoValido(tierra).

%------------------EJERCICIO 1:------------------%

%siguiente(+X, +Y, ?Dir, ?X2, ?Y2)
siguiente(X, Y, derecha, X2, Y) :- X2 is X+1.
siguiente(X, Y, arriba, X, Y2) :- Y2 is Y-1.
siguiente(X, Y, abajo, X, Y2) :- Y2 is Y+1.
siguiente(X, Y, izquierda, X2, Y) :- X2 is X-1.

%------------------EJERCICIO 2:------------------%

%dimensiones(+Laberinto, ?Columnas, ?Filas)
dimensiones(L, C, F) :- last(L, M), length(L, F), length(M, C).

%------------------EJERCICIO 3:------------------%

%esLaberinto(+L)
esLaberinto(L) :- dimensiones(L, C, F), C > 0, F > 0, foreach(member(R, L), (length(R, C), foreach(member(Contenido, R), contenidoValido(Contenido)))).

%------------------EJERCICIO 4:-----------------%

%celda(+(X, Y), +Laberinto, ?Contenido)
celda((X, Y), L, Cont) :- esLaberinto(L), nth1(Y, L, F), nth1(X, F, Cont).

%------------------EJERCICIO 5:------------------%

%tesoros(+Laberinto,-Tesoros)
tesoros(L, T) :- esLaberinto(L), findall(P, celda(P, L, tesoro), T).

%------------------EJERCICIO 6:------------------%

%enRango(+Coordenada, +Laberinto)
enRango((X, Y), L) :- esLaberinto(L), dimensiones(L, XMax, YMax), between(1, XMax, X), between(1, YMax, Y).

%Avanzar(+Coordenada, ?Dir, +Laberinto, ?Recorrido)
avanzar(C, _, L, []) :- not(enRango(C, L)) ; celda(C, L, pared).
avanzar(C, _, L, [C]) :- celda(C, L, tierra) ; celda(C, L, tesoro).
avanzar((X,Y), D, L, [(X,Y)|R]) :- celda((X,Y), L, hielo), siguiente(X, Y, D, X2, Y2), avanzar((X2, Y2), D, L, R).

%paso(+CoordInicial, +Dir, +Laberinto, -Recorrido)
paso((X, Y), D, L, R) :- esLaberinto(L), direccion(D), siguiente(X, Y, D, X2, Y2), avanzar((X2, Y2), D, L, R).

% No es reversible en CoordInicial ya que los componentes de las coordenadas necesitas estar instanciadas para predicado siguiente(+X, +Y, ?Dir, ?X2, ?Y2).

% Es Reversible en Dir ya que en caso de no instanciarla solo te devuelve las soluciones de las 4 direcciones posibles sin problemas. Adicionalmente el predicado siguiente la tiene como reversible por lo cual no causa problemas.

% No es reversible en Laberinto al no instanciarlo, nos genera infinitas soluciones, de tamaños infinitos, lo que sucede es que cuando nos devuelve las soluciones, pone pared en la primer fila tercer posicion, luego tierra, luego tesoro.
% Luego pone hielo y repite el proceso pero en la cuarta posicion de la primer fila. Hasta que queda [[_, _, hielo, hielo, hielo, hielo, hielo, hielo|...]|_].
% Como se generan las infinitas soluciones invalidas con agua al principio, se cuelga y jamas retorna.

% Es reversible en Recorrido ya que en caso de estan instanciada, solo se valida que cumpla con el predicado avanzar.

%------------------EJERCICIO 7:------------------%

%caminoDesde(+Laberinto, +CoordInicial, ?Dir, -Camino, +Longitud)
caminoDesde(_, _, _, [], 0).
caminoDesde(Lab, Coord, D, Cam, Long) :- esLaberinto(Lab), direccion(D), Long > 0, paso(Coord, D, Lab, R), last(R, ProxCoord), Long2 is Long - 1, caminoDesde(Lab, ProxCoord, _, Cam2, Long2), append(R, Cam2, Cam), length(R, Len), Len > 0.

%------------------EJERCICIO 8:------------------%

%solucion(+Laberinto, -Camino)
solucion(L, C) :- esLaberinto(L), dimensiones(L, XMax, YMax), LenMax is XMax * YMax, between(1, YMax, Y), between(XMax, LenMax, Len), caminoDesde(L, (0,Y), derecha, C, Len), last(C, (XMax, _)).

%------------------EJERCICIO 9:------------------%

%pasaPor(+Camino, +Posiciones)
pasaPor(C, Ps) :- forall(member(P, Ps), member(P, C)).

%hayOtraMenor(L, C)
hayOtraMenor(L, C) :- solucion(L, C2), tesoros(L, T), pasaPor(C, T), length(C, Len1), length(C2, Len2), Len2 < Len1.

%solucionOptima(+Laberinto, -Camino)
solucionOptima(L, C) :- esLaberinto(L), solucion(L, C), not(hayOtraMenor(L, C)), tesoros(L, T), pasaPor(C, T).


%%%%%%%%%%%%%%%% ESTRUCTURAS DE EJEMPLO %%%%%%%%%%%%%%%%%%%%%%%%%

laberintoBobo([[tierra]]).

laberintoBobo2([[tierra,tierra]]).

laberintoBoboCuadrado([[tierra,tierra],[pared,pared]]).

laberintoMuyBobo([[tierra,pared]]).

laberinto0([[pared,pared,pared,pared,pared,pared],[tierra,tierra,tierra,tierra,tierra,tierra],[pared,pared,pared,pared,pared,pared]]).

laberinto1([[tesoro,tierra,tesoro,tierra,tierra,hielo,tierra,tesoro,tierra,pared,tesoro,tierra],[tierra,tierra,hielo,tesoro,tierra,pared,pared,tesoro,tesoro,pared,pared,tesoro],[tierra,pared,tierra,tierra,tesoro,tesoro,pared,tierra,pared,tierra,tesoro,hielo],[tierra,tesoro,tesoro,tesoro,pared,tierra,tierra,tierra,hielo,hielo,tierra,tierra]]).

laberinto2([[tierra,tesoro,tierra],[hielo,tierra,pared]]).

laberinto3([[tierra,tierra,tierra,tesoro],[pared,tierra,hielo,pared]]).

laberinto4([[tierra,tierra,hielo,pared],[pared,tesoro,tierra,pared],[pared,tesoro,hielo,tierra]]).

laberinto5([[tierra,tierra,hielo,pared],[pared,hielo,tesoro,pared],[pared,hielo,pared,pared],[pared,tesoro,hielo,tierra]]).

laberinto6([[tierra,hielo,tesoro],[tierra,hielo,tesoro]]).

laberinto7([[tierra,hielo,tesoro],[tierra,tesoro,tierra]]).

laberinto8([[tierra,tierra,pared],[pared,tesoro,pared],[tierra,tierra,pared],[tesoro,pared,pared],[tierra,hielo,tierra]]).

laberinto9([[tierra,hielo,tierra],[pared,tesoro,tierra]]).

noLaberinto0([]).
noLaberinto1([[]]).
noLaberinto2([[_,_],[]]).
noLaberinto3([[piedra,papel,tijera]]).


%%%%%%%%%%%%%%%%%%%%%%%%% TESTS %%%%%%%%%%%%%%%%%%%%%%%%%

test(1) :- direccion(_).
test(2) :- siguiente(1,4,derecha,2,4), siguiente(1,4,abajo,1,5).
test(3) :- laberinto0(L), dimensiones(L,6,3).
test(4) :- laberinto1(L), esLaberinto(L), noLaberinto2(NL), not(esLaberinto(NL)).
test(5) :- laberinto4(L), findall(XS,paso((1,1),derecha,L,XS),[[(2,1)]]).
test(6) :- laberinto4(L), paso((2,3),derecha,L,[(3,3),(4,3)]).
test(7) :- laberinto4(L), paso((2,3),abajo,L,[]).
test(8) :- laberinto1(L), findall(Camino,caminoDesde(L, (1,1), _, Camino, 1),XS),msort(XS,[[(1,2)],[(2,1)]]).
test(9) :- laberintoBobo(L), solucion(L, S), S = [(1, 1)].
test(10) :- siguiente(4,4,izquierda,3,4), siguiente(1,4,arriba,1,3).
test(11) :- noLaberinto1(NL), dimensiones(NL, 0, 1).
test(12) :- noLaberinto2(NL), not(esLaberinto(NL)), noLaberinto3(NL2), not(esLaberinto(NL2)), laberinto8(L), esLaberinto(L).
test(13) :- laberinto1(L), celda((1,1), L, tesoro), not(celda((2,3), L, tierra)).
test(14) :- laberinto2(L), tesoros(L, [(2,1)]), laberinto5(L2), tesoros(L2, [(3,2), (2,4)]).
test(15) :- laberinto4(L), enRango((1, 2), L), enRango((4, 3), L), not(enRango((1,100), L)), not(enRango((100,1), L)).
test(16) :- laberinto4(L), avanzar((100, 3), derecha, L, []).
test(17) :- laberinto4(L), avanzar((1, 3), derecha, L, []).
test(18) :- laberinto4(L), avanzar((1, 1), derecha, L, [(1,1)]).
test(19) :- laberinto4(L), avanzar((2, 2), derecha, L, [(2,2)]).
test(20) :- laberinto6(L), paso((2,1), abajo, L, [(2,2)]).
test(21) :- laberinto5(L), paso((2,1), abajo, L, [(2,2),(2,3),(2,4)]).
test(22) :- laberinto4(L), findall(Camino,caminoDesde(L, (2,3), _, Camino, 2),XS),msort(XS,[[(2, 2), (2, 1)], [(2, 2), (2, 3)], [(2, 2), (3, 2)], [(3, 3), (4, 3), (3, 3), (2, 3)]]).
test(23) :- laberintoBobo2(L), findall(Solucion,solucion(L, Solucion),[[(1,1), (2,1)]]).
test(24) :- laberintoBoboCuadrado(L), findall(Solucion,solucion(L, Solucion), XS), msort(XS, [[(1, 1), (2, 1)], [(1, 1), (2, 1), (1, 1), (2, 1)]]).
test(25) :- laberintoMuyBobo(L), findall(Solucion,solucion(L, Solucion), []).
test(26) :- laberintoBobo(L), solucion(L, C), pasaPor(C, []).
test(27) :- laberintoBobo(L), solucion(L, C), pasaPor(C, [(1,1)]).
test(28) :- laberintoBobo(L), solucionOptima(L, S), S = [(1, 1)].
test(29) :- laberinto2(L), findall(S, solucionOptima(L, S), Ss), forall(member(Solucion, Ss), pasaPor(Solucion, [(2,1)])).
test(30) :- laberinto7(L), findall(S, solucionOptima(L, S), Ss), forall(member(Solucion, Ss), pasaPor(Solucion, [(3,2),(2,2)])).
test(31) :- laberintoBoboCuadrado(L), solucionOptima(L, [(1, 1), (2, 1)]).
test(32) :- laberintoBoboCuadrado(L), findall(Solucion,solucionOptima(L, Solucion), [[(1, 1), (2, 1)]]).

tests :- forall(between(1,32,N), test(N)). % Hacer sus propios tests y cambiar el 9 por la cantidad de tests que tengan.