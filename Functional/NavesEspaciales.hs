module NavesEspaciales (Componente(Contenedor, Motor, Escudo, Cañón), NaveEspacial(Módulo, Base), Dirección(Babor, Estribor), TipoPeligro(Pequeño, Grande, Torpedo), Peligro, foldNave, capacidad, poderDeAtaque, puedeVolar, mismoPotencial, mayorCapacidad, transformar, impactar, maniobrar, pruebaDeFuego, componentesPorNivel, dimensiones) where

data Componente = Contenedor | Motor | Escudo | Cañón deriving (Eq, Show)

data NaveEspacial = Módulo Componente NaveEspacial NaveEspacial | Base Componente deriving Eq

data Dirección = Babor | Estribor deriving Eq

data TipoPeligro = Pequeño | Grande | Torpedo deriving Eq

type Peligro = (Dirección, Int, TipoPeligro)

instance Show NaveEspacial where
  show = ("\n" ++) . (padNave 0 0 False)
  
padNave nivel acum doPad (Base c) = (if doPad then pad (4*nivel + acum) else "") ++ show c
padNave nivel acum doPad (Módulo x i d) = (if doPad then pad (4*nivel + acum) else "") ++ show x ++ 
                      pad 4 ++ padNave (nivel+1) (acum+l) False i ++ "\n" ++
                      padNave (nivel+1) (acum+l) True d where l = length $ show x

pad :: Int -> String
pad i = replicate i ' '

-- Ejercicio 1

foldNave :: (Componente-> a) -> (Componente -> a -> a -> a) -> NaveEspacial -> a
foldNave f _  (Base c) = f c
foldNave f g (Módulo c i d) = g c (foldNave f g i) (foldNave f g d)

-- Ejercicio 2

cantidadDeComponente :: Componente -> NaveEspacial -> Int
cantidadDeComponente comp = foldNave (\c -> if c == comp then 1 else 0) (\c reci recd -> if c == comp then 1 + reci + recd else reci + recd)

capacidad :: NaveEspacial -> Int
capacidad = cantidadDeComponente Contenedor

poderDeAtaque :: NaveEspacial -> Int
poderDeAtaque = cantidadDeComponente Cañón

motores :: NaveEspacial -> Int
motores = cantidadDeComponente Motor

escudos :: NaveEspacial -> Int
escudos = cantidadDeComponente Escudo

puedeVolar :: NaveEspacial -> Bool
puedeVolar = (0 <) . motores

mismoPotencial :: NaveEspacial -> NaveEspacial -> Bool
mismoPotencial n m = (capacidad n == capacidad m) && (poderDeAtaque n == poderDeAtaque m) && (motores n == motores m) && (escudos n == escudos m)

-- Ejercicio 3

mayorCapacidad :: [NaveEspacial] -> NaveEspacial
mayorCapacidad = foldr1 (\m r -> if capacidad m < capacidad r then r else m)

-- Ejercicio 4

transformar :: (Componente -> Componente) -> NaveEspacial -> NaveEspacial
transformar f = foldNave (\c -> (Base . f) c) (\c reci recd -> Módulo (f c) reci recd)

-- Ejercicio 5

impactarNave :: TipoPeligro -> NaveEspacial -> NaveEspacial
impactarNave Pequeño (Base Escudo) = Base Escudo
impactarNave Pequeño (Módulo Escudo i d) = Módulo Escudo i d
impactarNave Grande n = if poderDeAtaque n > 0 then impactarNave Pequeño n else Base Contenedor
impactarNave _ _ = Base Contenedor

-- no se usa foldNave ya que queremos recurcion primitiva, no estructural. Queremos tener el resto de la nave similar a como funciona recr
impactar :: Peligro -> NaveEspacial -> NaveEspacial
impactar (_, 0, arma) n = impactarNave arma n
impactar _ (Base c) = Base c
impactar (Estribor, n, arma) (Módulo c i d) = Módulo c i (impactar (Estribor, n-1, arma) d)
impactar (Babor, n, arma) (Módulo c i d) = Módulo c (impactar (Babor, n-1, arma) i) d

-- Ejercicio 6

maniobrar :: NaveEspacial -> [Peligro] -> NaveEspacial
maniobrar = foldl (flip impactar)

-- Ejercicio 7

pruebaDeFuego :: [Peligro] -> [NaveEspacial] -> [NaveEspacial]
pruebaDeFuego ps = filter (puedeVolar . (flip maniobrar ps))

-- Ejercicio 8

componentesPorNivel :: NaveEspacial -> Int -> Int
componentesPorNivel = foldNave (\ c -> (\i -> if i == 0 then 1 else 0)) (\c reci recd -> (\i -> if i == 0 then 1 else (reci (i-1)) + (recd (i-1))))


anchoMaximo :: NaveEspacial -> Int -> (Int, Int)
anchoMaximo n h = (h, foldr (\i r -> max (componentesPorNivel n i) r) 0 [0 .. h])

dimensiones :: NaveEspacial -> (Int, Int)
dimensiones n = anchoMaximo n (foldNave (\_ -> 1) (\_ ri rd -> 1 + max ri rd) n)
