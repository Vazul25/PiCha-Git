�rdekess�gek
==

- L�tom, hogy .txt-k�nt ker�lt be a v�lasz. Javaslom ezt az Extensiont VS-hez Markdown (.md) 
megjelen�t�shez, t�k j� dolog: [Markdown](https://visualstudiogallery.msdn.microsoft.com/eaab33c3-437b-4918-8354-872dfe5d1bfe); [Markdown Cheatsheet (Syntax)](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
- A Solution-h�z nem lehet fizikai mapp�t hozz�adni, csak logikait (Jobb klikk > Add > New
Solution Folder nem hoz l�tre a lemezen mapp�t). Ebben a f�jlok is logikailag vannak
csoportos�tva (teh�t a jobb kikk > Add > Existing Item csak �tvonallal adja hozz� a f�jlt). Ha
azt akarjuk, hogy t�kr�zze a solution folder hierarchia a fizikai f�jl el�r�seket, akkor azt
k�zzel a pont megfelel� mapp�ba kell tenn�nk.

CSS
--
- A CSS-hez j�magam sem �rtek, viszont �ltal�noss�gban �gy szoktak megk�zel�teni, mint az
objektumorient�lts�got:
  - Az ID az egy DOM elem p�ld�ny, annyira pontosan le�rhatok vele b�rmit, amennyire akarok, 
    az a szab�ly semmi m�sra nem fog �rv�nyes�lni (egy oldalon bel�l).
  - A class az class, teh�t az azonos jelleg� elemek csoportos�t�s�ra j�. Ha van egy saj�t
    oszt�lyom, amit �jrahasznos�that�v� szeretn�k tenni, akkor nem abba teszem bele, hogyha
    5px-lel el van cs�szva az egyik oldalon, hanem egy m�dos�t� oszt�lyt veszek fel, ami
    szint�n �jrahasznos�that�.
- A [LESS](http://lesscss.org/) vagy a [SASS](http://sass-lang.com/) transpiler seg�t abban, 
hogy a DOM-hoz hasonl�an �rhassuk le a k�dot �s �jrahasznos�that� legyen a CSS is, ill. 
kevesebbet kelljen k�dolni :)
  - Lehet l�trehozni saj�t v�ltoz�kat (ink�bb konstansk�nt haszn�lj�k, pl. sz�nek megad�s�ra
    neves�tett v�ltoz�val)
```less
@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;

#header {
  color: @light-blue;
}
```
  - Be lehet �gyazni szab�lyokat:
```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```
  - Stb. A LESS �s SASS supersetjei a CSS-nek, mint a TypeScript a JavaScriptnek, �gy ki lehet
    indulni a meglev� CSS k�db�l.