MVC Review
==

- Hibakezel�sre �ltal�nosan nem szerencs�s try-catch blokkokat haszn�lni, csak a val�ban
kiv�teles esetekben (n� a redundancia). Haszn�ljunk saj�t ErrorFilter-t sz�ks�g szerint.
K�zzel visszaadni InternalServerError-t semmikor nem sz�ks�ges, ha �ltal�nos catch �gban van
(egy�bk�nt is pont ez t�rt�nik, ha nem, akkor rosszul van meg�rva a filter�nk).
<br>***Solved --Peti/Vazul***
- Web API routing: alap�rtelmezett szab�ly, a WebAPI-s alap�rtelmezett szab�ly, �s vannak attrib�tumok is.
  - Mi�rt rossz, ha sok szab�lyunk van?<br>***T�n mert sok case en fog v�gig p�r�gni minden egyes hib�n�l? --Vazul***
  - Tudunk-e cs�kkenteni a sz�m�n, �s ha igen, akkor hogyan?***�lltal�nos hib�t is bevezet�nk amit a message param�tere tesz egyediv�?--Vazul***
  - A mostani megk�zel�t�s RESTful? **viszonylag, neh�z pontosan meg�t�lni --Vazul**
    - J�-e a REST? :)**Tal�n igen tal�n [Nem](https://mmikowski.github.io/the_lie/) --Vazul** 
  - Mi�rt opcion�lis az _id_ param�ter a default route-okban? Lehet-e ez baj a mostani
    megold�sban? **Mert �gy t�bb ugyanolyan, de kicsit k�l�nb�z� implement�ci�t tudunk megsp�rolni a managerekben. Tal�n az�rt gond, mert ha k�ne, de nincs �rt�ke ennek a param�ternek, akkor a program elsz�llhat vagy hib�san m�k�dhet. --Adri**
- Mire j� a HelpPage area? **Nugetes b�v�tm�ny, gener�l a webapihoz help oldalt ahol minden action route-ja ott van --Vazul**
- Ha minden API k�r�s�nk IHttpActionResult-ot ad vissza, �s az elv�rt m�k�d�s egy konkr�t
t�pus� objektum visszaad�sa, akkor haszn�lhatunk t�puosos API-t, ami robosztusabb, k�nnyebben
gener�lhat� hozz� dokument�ci� �s sz�pen t�pusos. **Solved --Vazul**
- Milyen vonzata van annak, ha lok�lis f�jlrendszeren t�rolunk er�forr�sokat (pl. a konkr�t
k�peket, amiket a felhaszn�l�k felt�ltenek)? **Bottleneck-et okoz a lemez hozz�f�r�s t�bb felhaszn�l� eset�n,tov�bb� + m�velet a lemezr�l kiolvasni a k�pet miut�n adatb�zisb�l megvan a path, nagyobb hiba lehet�s�g, p�rhuzamos k�pszerverek lehet�s�g�nek kiz�r�sa stb --Vazul**
- Ha az MVC-b�l a Razort nem haszn�ljuk, akkor az Angular template-eket HTML-k�nt is
t�rolhatjuk �s �ll�thatunk be r�juk cache-t (ugyanis nem dinamikus a szerveroldali template).
A template-eket egy�bk�nt ilyenkor az Angular aszinkron t�lti be (pl. egy direkt�va vagy
controller HTML template-j�t), a $http �s $templateCache service-ek haszn�lat�val. A
cache-el�st fel lehet gyors�tani, ha bundle-�zz�k a template-eket (erre t�k j� lehet az MVC
is) �s app indul�skor az elej�n bet�ltj�k mindet.
- A Scripts mapp�ban �rdemes volna az egyes libeket csoportos�tva eltenni. Mivel van olyanunk,
hogy Application, �rdemes lehet egy Libraries mapp�ba tenni �ket, azon bel�l is almapp�ba, �gy
kicsit �sszefolyik �s nem l�tszik j�l, hogy kik vannak egy�tt :)

SignalR
==

- A t�pusoss�g t�k j� dolog, l�tezik t�pusos SignalR hub is, �s akkor nem fogjuk v�letlen�l
elg�pelni az egyes JS oldali met�dusok nev�t (megt�rt�nt, true story). Val�j�ban alul dinamikus
marad, de C#-ban t�pusosnak t�nik majd. �rdemes interf�szk�nt megadni, �gyen:
```c#
    public class PiChatHub : Hub<IPiChatClient>
    {
        //...
    }

    public interface IPiChatClient {
        void DoSomething();
    }
```
**<br />Interf�sz hozz�adva. --P�ter**