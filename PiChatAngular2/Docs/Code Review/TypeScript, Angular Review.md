TypeScript, Angular Review
==

- �rdemes ut�naj�rni, hogy milyen be�ll�t�sai vannak a TypeScript compilernek. A JavaScript
kimeneteket p�ld�ul �ssze tudja csomagolni egy f�jlba, r�ad�sul figyel(ni pr�b�l) arra is,
hogy megfelel� sorrendben legyenek a f�jlok. A projekt tulajdons�gai k�z�tt a TypeScript Build
f�l�n vannak be�ll�t�sok, de azok elavultabbak, mint a [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
f�jlos megold�s. A VS t�mogatja ezt a megold�st is, ekkor letiltja a TypeScript Build f�let a
be�ll�t�sok k�z�tt.
- A k�d jobb struktur�lts�ga �rdek�ben �rdemes lehet haszn�lni namespace-eket (a namespace
kulcssz�val, nem a module-lal, l�sd [itt](https://www.typescriptlang.org/docs/handbook/modules.html)).
- Az Angular2 �t�ll�s �rdek�ben n�zz�tek �t a module loadingot is (import kulcssz�)!
- Saj�t service-eknek nem musz�j l�trehoznunk pluszba interf�szt is, el�g az oszt�ly t�pus�t
megadni, akkor l�tszik F12-re az implement�ci� (�s nem a defin�ci�).
- Az �ltal�nos hibakezel�sre haszn�lhatunk responseError interceptort.
- A JSON soros�t� tudja camelCase-es�teni a propertyket kifel� �s befel� t�rt�n� soros�t�skor
is a CamelCasePropertyNamesResolver (vagy valami hasonl�) resolverrel �s akkor �tadhat� neki
sim�n az objektum, teh�t ehelyett:
```typescript
changePassword(oldPassword: string, newPassword: string, newPasswordConfirm: string) {
  return this.$http.post("api/Account/ChangePassword", { "OldPassword": oldPassword, "NewPassword": newPassword, "NewPasswordConfirm": newPasswordConfirm });
}
```
lehet ez:
```typescript
changePassword(oldPassword: string, newPassword: string, newPasswordConfirm: string) {
  return this.$http.post("api/Account/ChangePassword", { oldPassword, newPassword, newPasswordConfirm });
}
```
**Alkalmazva. --P�ter.**
- Angularben a $http service-nek van egy property-je, ami jelzi, hogy h�ny kinnl�v� http
k�r�s van m�g.
- A .NET-es LINQ-hez hasonl�an vannak aggreg�l� met�dusok JavaScriptben, erre haszn�lhat� pl.
a Lodash library (a JS is t�mogatja a .filter, .map stb. met�dusokat, de nem minden b�ng�sz�).
Ehelyett:
```typescript
this.otherGroups = [];
groups.forEach((item, index) => {
  var group = <IGroup>
    {
    Id: item.Id,
    Name: item.Name,
    OwnerName: item.OwnerName,
    Description: item.Description,
    Role: item.Role, IsPrivate:
    item.IsPrivate, PicturesCount:
    item.PicturesCount,
    MembersCount: item.MembersCount
    };
    this.otherGroups.push(group);
    });
```
lehet ez:
```typescript
  this.otherGroups = _.map(groups, item => <IGroup>
    {
    Id: item.Id,
    Name: item.Name,
    OwnerName: item.OwnerName,
    Description: item.Description,
    Role: item.Role,
    IsPrivate: item.IsPrivate,
    PicturesCount: item.PicturesCount,
    MembersCount: item.MembersCount
    });
```
Tov�bb� l�tszik, hogy itt am�gy ugyanazok a property nevek, teh�t:
```typescript
  this.otherGroups = groups;
```

- Magyar�zz�tok el k�rlek, mi�rt sz�ks�ges ez :)
```typescript
  setTimeout(() => {
    this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
  }, 200);
```

- �gy l�tom, hogy a DialogControllersben lev� controllereknek lehetne egy k�z�s �se :)