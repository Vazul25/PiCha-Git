�ltal�nos .NET review
==

> A k�dban a *// REVIEW* stringre keresve tal�ltok tov�bbi �szrev�teleket.

- Az _OWIN_ Startup oszt�lya singletonk�nt viselkedik (val�j�ban nem, de �sszesen csak egy 
p�ld�ny fog bel�le l�trej�nni), de ezt semmi nem garant�lja (nincs statikus accessor hozz�).
Az OWIN framework p�ld�nyos�tja app indul�skor. Az _App_Start/AuthConfig.cs_ f�jlban
statikus v�ltoz�ban van az _OAuthBearerOptions_ property, viszont ezt minden Startup p�ld�ny
�jra l�trehozza egyszer. Mi ezzel a probl�ma (nem a konkr�t esetben, hanem hogy statikus
v�ltoz�t �ll�t egy p�ld�ny)?
