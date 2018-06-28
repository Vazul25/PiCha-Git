MVC Review
==

- Hibakezelésre általánosan nem szerencsés try-catch blokkokat használni, csak a valóban
kivételes esetekben (nõ a redundancia). Használjunk saját ErrorFilter-t szükség szerint.
Kézzel visszaadni InternalServerError-t semmikor nem szükséges, ha általános catch ágban van
(egyébként is pont ez történik, ha nem, akkor rosszul van megírva a filterünk).
<br>***Solved --Peti/Vazul***
- Web API routing: alapértelmezett szabály, a WebAPI-s alapértelmezett szabály, és vannak attribútumok is.
  - Miért rossz, ha sok szabályunk van?<br>***Tán mert sok case en fog végig pörögni minden egyes hibánál? --Vazul***
  - Tudunk-e csökkenteni a számán, és ha igen, akkor hogyan?***Álltalános hibát is bevezetünk amit a message paramétere tesz egyedivé?--Vazul***
  - A mostani megközelítés RESTful? **viszonylag, nehéz pontosan megítélni --Vazul**
    - Jó-e a REST? :)**Talán igen talán [Nem](https://mmikowski.github.io/the_lie/) --Vazul** 
  - Miért opcionális az _id_ paraméter a default route-okban? Lehet-e ez baj a mostani
    megoldásban? **Mert így több ugyanolyan, de kicsit különbözõ implementációt tudunk megspórolni a managerekben. Talán azért gond, mert ha kéne, de nincs értéke ennek a paraméternek, akkor a program elszállhat vagy hibásan mûködhet. --Adri**
- Mire jó a HelpPage area? **Nugetes bövítmény, generál a webapihoz help oldalt ahol minden action route-ja ott van --Vazul**
- Ha minden API kérésünk IHttpActionResult-ot ad vissza, és az elvárt mûködés egy konkrét
típusú objektum visszaadása, akkor használhatunk típuosos API-t, ami robosztusabb, könnyebben
generálható hozzá dokumentáció és szépen típusos. **Solved --Vazul**
- Milyen vonzata van annak, ha lokális fájlrendszeren tárolunk erõforrásokat (pl. a konkrét
képeket, amiket a felhasználók feltöltenek)? **Bottleneck-et okoz a lemez hozzáférés több felhasználó esetén,továbbá + müvelet a lemezrõl kiolvasni a képet miután adatbázisból megvan a path, nagyobb hiba lehetõség, párhuzamos képszerverek lehetõségének kizárása stb --Vazul**
- Ha az MVC-bõl a Razort nem használjuk, akkor az Angular template-eket HTML-ként is
tárolhatjuk és állíthatunk be rájuk cache-t (ugyanis nem dinamikus a szerveroldali template).
A template-eket egyébként ilyenkor az Angular aszinkron tölti be (pl. egy direktíva vagy
controller HTML template-jét), a $http és $templateCache service-ek használatával. A
cache-elést fel lehet gyorsítani, ha bundle-özzük a template-eket (erre tök jó lehet az MVC
is) és app induláskor az elején betöltjük mindet.
- A Scripts mappában érdemes volna az egyes libeket csoportosítva eltenni. Mivel van olyanunk,
hogy Application, érdemes lehet egy Libraries mappába tenni õket, azon belül is almappába, így
kicsit összefolyik és nem látszik jól, hogy kik vannak együtt :)

SignalR
==

- A típusosság tök jó dolog, létezik típusos SignalR hub is, és akkor nem fogjuk véletlenül
elgépelni az egyes JS oldali metódusok nevét (megtörtént, true story). Valójában alul dinamikus
marad, de C#-ban típusosnak tûnik majd. Érdemes interfészként megadni, ígyen:
```c#
    public class PiChatHub : Hub<IPiChatClient>
    {
        //...
    }

    public interface IPiChatClient {
        void DoSomething();
    }
```
**<br />Interfész hozzáadva. --Péter**