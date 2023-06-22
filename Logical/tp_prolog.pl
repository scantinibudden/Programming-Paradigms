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

%siguiente(+X,+Y,?Dir,?X2,?Y2)

%dimensiones(+Laberinto, ?Columnas, ?Filas)

%esLaberinto(+L)

%celda(+(X, Y), +Laberinto, ?Contenido)

%tesoros(+Laberinto,-Tesoros)

%paso(+CoordInicial,+Dir,+Laberinto,-Recorrido)

%caminoDesde(+Laberinto, +CoordInicial, ?Dir, -Camino, +Longitud)

%solucion(+Laberinto, -Camino)

%solucionOptima(+Laberinto, -Camino)



%%%%%%%%%%%%%%%% ESTRUCTURAS DE EJEMPLO %%%%%%%%%%%%%%%%%%%%%%%%%

laberintoBobo([[tierra]]).

laberintoBobo2([[tierra,tierra]]).

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

tests :- forall(between(1,9,N), test(N)). % Hacer sus propios tests y cambiar el 9 por la cantidad de tests que tengan.
