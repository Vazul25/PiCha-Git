# Angular2 - Others

## 1. [hidden] probléma
[hidden] nem működött nekünk
**<br />Megoldás:** 
1. css fájlhoz hozzáadni a következőt (nem ajánlott)
```css
[hidden] {
    display: none !important;
}
```
2. *ngIf használata [hidden] helyett (ajánlott)

## 2. Implicit any probléma
- _ng2-dropdown-menu.d.ts_ fájlban a következők módosítása szükséges (./node_modules/ng2-material-dropdown/src/typings mappán belül)
```typescript
    updatePosition(position: any): void;
    handleKeypress($event: Event): void;
```