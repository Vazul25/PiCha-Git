Érdekességek
==

- Látom, hogy .txt-ként került be a válasz. Javaslom ezt az Extensiont VS-hez Markdown (.md) 
megjelenítéshez, tök jó dolog: [Markdown](https://visualstudiogallery.msdn.microsoft.com/eaab33c3-437b-4918-8354-872dfe5d1bfe); [Markdown Cheatsheet (Syntax)](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
- A Solution-höz nem lehet fizikai mappát hozzáadni, csak logikait (Jobb klikk > Add > New
Solution Folder nem hoz létre a lemezen mappát). Ebben a fájlok is logikailag vannak
csoportosítva (tehát a jobb kikk > Add > Existing Item csak útvonallal adja hozzá a fájlt). Ha
azt akarjuk, hogy tükrözze a solution folder hierarchia a fizikai fájl eléréseket, akkor azt
kézzel a pont megfelelõ mappába kell tennünk.

CSS
--
- A CSS-hez jómagam sem értek, viszont általánosságban úgy szoktak megközelíteni, mint az
objektumorientáltságot:
  - Az ID az egy DOM elem példány, annyira pontosan leírhatok vele bármit, amennyire akarok, 
    az a szabály semmi másra nem fog érvényesülni (egy oldalon belül).
  - A class az class, tehát az azonos jellegû elemek csoportosítására jó. Ha van egy saját
    osztályom, amit újrahasznosíthatóvá szeretnék tenni, akkor nem abba teszem bele, hogyha
    5px-lel el van csúszva az egyik oldalon, hanem egy módosító osztályt veszek fel, ami
    szintén újrahasznosítható.
- A [LESS](http://lesscss.org/) vagy a [SASS](http://sass-lang.com/) transpiler segít abban, 
hogy a DOM-hoz hasonlóan írhassuk le a kódot és újrahasznosítható legyen a CSS is, ill. 
kevesebbet kelljen kódolni :)
  - Lehet létrehozni saját változókat (inkább konstansként használják, pl. színek megadására
    nevesített változóval)
```less
@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;

#header {
  color: @light-blue;
}
```
  - Be lehet ágyazni szabályokat:
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
  - Stb. A LESS és SASS supersetjei a CSS-nek, mint a TypeScript a JavaScriptnek, így ki lehet
    indulni a meglevõ CSS kódból.