TypeScript, Angular Review
==

- Érdemes utánajárni, hogy milyen beállításai vannak a TypeScript compilernek. A JavaScript
kimeneteket például össze tudja csomagolni egy fájlba, ráadásul figyel(ni próbál) arra is,
hogy megfelelõ sorrendben legyenek a fájlok. A projekt tulajdonságai között a TypeScript Build
fülön vannak beállítások, de azok elavultabbak, mint a [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
fájlos megoldás. A VS támogatja ezt a megoldást is, ekkor letiltja a TypeScript Build fület a
beállítások között.
- A kód jobb strukturáltsága érdekében érdemes lehet használni namespace-eket (a namespace
kulcsszóval, nem a module-lal, lásd [itt](https://www.typescriptlang.org/docs/handbook/modules.html)).
- Az Angular2 átállás érdekében nézzétek át a module loadingot is (import kulcsszó)!
- Saját service-eknek nem muszáj létrehoznunk pluszba interfészt is, elég az osztály típusát
megadni, akkor látszik F12-re az implementáció (és nem a definíció).
- Az általános hibakezelésre használhatunk responseError interceptort.
- A JSON sorosító tudja camelCase-esíteni a propertyket kifelé és befelé történõ sorosításkor
is a CamelCasePropertyNamesResolver (vagy valami hasonló) resolverrel és akkor átadható neki
simán az objektum, tehát ehelyett:
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
**Alkalmazva. --Péter.**
- Angularben a $http service-nek van egy property-je, ami jelzi, hogy hány kinnlévõ http
kérés van még.
- A .NET-es LINQ-hez hasonlóan vannak aggregáló metódusok JavaScriptben, erre használható pl.
a Lodash library (a JS is támogatja a .filter, .map stb. metódusokat, de nem minden böngészõ).
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
Továbbá látszik, hogy itt amúgy ugyanazok a property nevek, tehát:
```typescript
  this.otherGroups = groups;
```

- Magyarázzátok el kérlek, miért szükséges ez :)
```typescript
  setTimeout(() => {
    this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
  }, 200);
```

- Úgy látom, hogy a DialogControllersben levõ controllereknek lehetne egy közös õse :)