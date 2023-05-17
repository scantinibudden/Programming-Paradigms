module Main where
import NavesEspaciales
import Test.HUnit
import Data.List



--Naves para pruebas:    
contenedorSolo = Base Contenedor
nave1 = Base Motor
nave2 = Módulo Cañón (Base Escudo) (Base Motor)
nave3 = Módulo Motor (Base Escudo) (Base Cañón)
nave4 = Módulo Contenedor nave2 nave3
nave5 = Módulo Contenedor nave3 nave2
nave6 = Módulo Contenedor nave4 nave1
nave7 = Módulo Contenedor nave1 nave5
nave8 = Módulo Contenedor nave1 nave6
nave9 = Módulo Escudo 
    (Módulo Escudo (Módulo Escudo (Base Escudo) (Base Cañón)) (Módulo Motor (Base Contenedor) (Base Motor))) 
    (Módulo Escudo (Módulo Contenedor (Base Motor) (Base Contenedor)) (Módulo Escudo (Base Cañón) (Base Escudo)))
nave10 = Módulo Escudo 
    (Módulo Escudo (Módulo Escudo (Base Escudo) (Base Cañón)) (Base Motor))
    (Módulo Escudo (Módulo Contenedor (Base Motor) (Base Contenedor)) (Módulo Escudo (Base Cañón) (Base Escudo)))

soloUnMotor = Base Motor
puroContenedor = Módulo Contenedor (Base Contenedor) (Base Contenedor)
tresCañones = Módulo Cañón (Base Cañón) (Base Cañón)

contenedorYCañon = Módulo Contenedor (Base Cañón) (Base Contenedor)
otroCañon = Módulo Contenedor (Base Contenedor) (Base Cañón)

escudoSinCañon = Módulo Escudo (Base Contenedor) (Base Contenedor)

protegido = Módulo Escudo (Base Contenedor) (Base Cañón)
protegidoNivel1Estribor = Módulo Contenedor soloUnMotor protegido

superProtegido = Módulo Motor protegido protegido

desbalanceado = Módulo Escudo (Base Contenedor) protegido


--Ejecución de los tests
main :: IO Counts
main = do runTestTT allTests

allTests = test [
  "ejercicio2" ~: testsEj2,
  "ejercicio3" ~: testsEj3,
  "ejercicio4" ~: testsEj4,
  "ejercicio5" ~: testsEj5,
  "ejercicio6" ~: testsEj6,
  "ejercicio7" ~: testsEj7,
  "ejercicio8" ~: testsEj8
  ]

testsEj2 = test [
  0 ~=? capacidad soloUnMotor,
  3 ~=? capacidad puroContenedor,
  0 ~=? poderDeAtaque puroContenedor,
  3 ~=? poderDeAtaque tresCañones,
  True ~=? puedeVolar soloUnMotor,
  False ~=? puedeVolar tresCañones,
  True ~=? mismoPotencial protegido protegido,
  True ~=? mismoPotencial (Módulo Escudo tresCañones puroContenedor) (Módulo Escudo puroContenedor tresCañones),
  False ~=? mismoPotencial puroContenedor tresCañones
  ]

testsEj3 = test [
  puroContenedor ~=? mayorCapacidad [puroContenedor, tresCañones, protegido],
  escudoSinCañon ~=? mayorCapacidad [tresCañones, protegido, protegido, protegido, protegido, protegido, escudoSinCañon]
  ]

testsEj4 = test [
  puroContenedor ~=? transformar (\c -> if c == Cañón then Contenedor else c) tresCañones,
  escudoSinCañon ~=? transformar (\c -> if c == Cañón then Escudo else c) (Módulo Cañón (Base Contenedor) (Base Contenedor))
  ]

testsEj5 = test [
  -- Casos básicos
  Base Contenedor ~=? impactar (Babor, 0, Grande) nave1 ,
  Base Contenedor ~=? impactar (Estribor, 0, Grande) nave1 ,
  Base Contenedor ~=? impactar (Babor, 0, Pequeño) nave1 ,
  Base Contenedor ~=? impactar (Estribor, 0, Pequeño) nave1 ,

  -- Casos con Módulos
  Base Contenedor  ~=? impactar (Babor, 0, Grande) nave2 ,
  Módulo Cañón (Base Contenedor) (Base Motor)  ~=? impactar (Babor, 1, Grande) nave2 ,
  nave2  ~=? impactar (Babor, 1, Pequeño) nave2 ,
  Módulo Cañón (Base Escudo) (Base Contenedor)  ~=? impactar (Estribor, 1, Pequeño) nave2 ,

  -- Casos con múltiples niveles y componentes
  Módulo Escudo (Módulo Escudo (Base Contenedor) (Módulo Motor (Base Contenedor) (Base Motor))) (Módulo Escudo (Módulo Contenedor (Base Motor) (Base Contenedor)) (Módulo Escudo (Base Cañón) (Base Escudo))) ~=? impactar (Babor, 2, Torpedo) nave9 ,
  nave9 ~=? impactar (Estribor, 1, Grande) nave9,
  Módulo Escudo (Módulo Escudo (Módulo Escudo (Base Escudo) (Base Cañón)) (Módulo Motor (Base Contenedor) (Base Motor))) (Base Contenedor) ~=? impactar (Estribor, 1, Grande) (impactar (Estribor, 2, Torpedo) nave9)
  ]

testsEj6 = test [
  nave1 ~=? maniobrar nave1 [],
  (Base Contenedor) ~=? maniobrar nave1 [(Babor, 0, Pequeño)],
  nave6 ~=? maniobrar nave6 [(Estribor, 3, Pequeño)],
  Módulo Escudo (Módulo Escudo (Módulo Escudo (Base Escudo) (Base Cañón)) (Módulo Motor (Base Contenedor) (Base Motor))) (Base Contenedor) ~=? maniobrar nave9 [(Estribor, 2, Torpedo),(Estribor, 1, Grande)]
  ]

testsEj7 = test [
  [nave1, nave2, nave3, nave4, nave5, nave6, nave7, nave8, nave9] ~=? pruebaDeFuego [] [nave1, nave2, nave3, nave4, nave5, nave6, nave7, nave8, nave9],
  [nave9] ~=? pruebaDeFuego [(Babor, 0, Pequeño)] [nave1, nave9],
  [] ~=? pruebaDeFuego [(Estribor, 0, Torpedo)] [nave1, nave2, nave3, nave4, nave5, nave6, nave7, nave8, nave9]]

testsEj8 = test [
  --componentesPorNivel
  1 ~=? componentesPorNivel nave10 0,
  2 ~=? componentesPorNivel nave10 1,
  4 ~=? componentesPorNivel nave10 2,
  6 ~=? componentesPorNivel nave10 3,
  2 ~=? componentesPorNivel nave6 1,

  
  --dimensiones
  (1,1) ~=? dimensiones nave1,
  (2,2) ~=? dimensiones nave3,
  (4,6) ~=? (dimensiones $ maniobrar nave9 [(Babor,1,Grande),(Babor,2,Torpedo)]),
  (2, 2) ~=? dimensiones tresCañones,
  (2, 2) ~=? dimensiones protegido,
  (3, 2) ~=? dimensiones desbalanceado
  ]
  
