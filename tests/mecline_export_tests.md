# mecline_export_tests.md — Validación de exportaciones
**Producto:** MecLine LATAM v1.0.0 · Voryn Energy

---

## Exportación 1: XLSX de resultados (`exportarXLSX()`)

**Prerrequisito:** SheetJS 0.18.5 cargado via CDN  
**Ruta al botón:** Modo Proyecto → Resumen → botón XLSX

**Test A — Sin datos:**
- Comportamiento esperado: Alert "No hay datos de proyecto para exportar"
- Estado: ✅ Implementado

**Test B — Con demo (7 estructuras):**
1. Modo Proyecto → botón Demo
2. Botón XLSX
3. Verificar archivo descargado: `MecLine_Proyecto_YYYY-MM-DD.xlsx`
4. Abrir en Excel — verificar columnas:

| Columna | Tipo | Presente |
|---|---|---|
| ID_Estructura | string | ✅ |
| Conductor | string | ✅ |
| Tipo_Apoyo | string | ✅ |
| Vano_m | number | ✅ |
| Angulo_deg | number | ✅ |
| PCT_UTS_Viento | number | ✅ |
| PCT_Estructura | number | ✅ |
| Flecha_Vert_m | number | ✅ |
| T_EDS_kN | number | ✅ |
| Score_Riesgo | number | ✅ |
| Estado | string | ✅ |
| Nivel_Confianza | string | ✅ |

**Nombre del archivo esperado:** `MecLine_Proyecto_AAAA-MM-DD.xlsx`

---

## Exportación 2: JSON del proyecto (`exportarDatos()`)

**Ruta:** Modo Proyecto → Resultados → botón exportar datos

**Contenido esperado del JSON:**
```json
{
  "exportado": "YYYY-MM-DDTHH:MM:SS",
  "total_estructuras": 7,
  "empresa": { "nombre": "...", "ciudad": "..." },
  "colores": { ... },
  "estructuras": [ { "id_estructura": "E-001", ... } ]
}
```

**Validar:**
- [ ] JSON válido (parseable)
- [ ] Campo `total_estructuras` coincide con count en UI
- [ ] Estructuras incluyen `pct_uts_viento`, `estado`, `score`

---

## Exportación 3: Memoria técnica HTML (`genMemHTML()`)

**Ruta:** Modo Proyecto → Memoria técnica → botón Generar

**Test — Con demo:**
1. Cargar demo
2. Completar branding: empresa "Test SA", ciudad "Lima", web "test.com"
3. Generar memoria
4. Verificar nueva pestaña abierta

**Secciones a verificar:**
| Sección | Estado |
|---|---|
| Carátula con nombre empresa y color branding | ✅ |
| Fecha y datos del proyecto | ✅ |
| Marco normativo (país y norma) | ✅ |
| 4 hipótesis de carga con tabla | ✅ |
| Tabla de estructuras (coloreada por estado) | ✅ |
| Sección conjuntos constructivos | ✅ |
| Conclusiones automáticas | ✅ |
| Disclaimer legal | ✅ |
| 3 recuadros de firma | ✅ |

---

## Exportación 4: PDF via print (`window.print()`)

**Ruta:** Pestaña de memoria técnica → botón Imprimir / Guardar como PDF

**Verificar en diálogo de impresión:**
- [ ] Sidebar y topbar no aparecen (ocultos por mecline_print.css)
- [ ] Márgenes correctos
- [ ] Tablas sin scroll overflow
- [ ] Colores de estado visibles (o convertidos a escala de grises)
- [ ] Header y footer de página en PDF destino

**Browsers recomendados para PDF:**
- Chrome/Edge → "Guardar como PDF" (mejor resultado)
- Firefox → "Imprimir a PDF"
- Safari → "PDF" en diálogo de impresión

---

## ❌ Pendiente de implementación

| Funcionalidad | Estado |
|---|---|
| Exportar memoria como .docx | ❌ PENDIENTE IMPLEMENTACIÓN |
| Exportar planos de estructuras tipo | ❌ PENDIENTE IMPLEMENTACIÓN |
| Exportar BOM (lista de materiales) como XLSX | ❌ PENDIENTE IMPLEMENTACIÓN |
| Compartir link del proyecto | ❌ PENDIENTE IMPLEMENTACIÓN |
