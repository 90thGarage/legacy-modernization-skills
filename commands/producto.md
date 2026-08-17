---
description: Habla con el Asistente de Producto para entender, mejorar, documentar o llevar un flujo al prototipo.
---

# /producto

Use the `product-modernizer` skill.

Pass the user's request through as natural language. Infer the intended action from the conversation; never ask the user to select a mode.

- Questions and ideas are read-only.
- Explicit requests to document may update product documentation but not application code.
- Explicit requests to implement may document the change and coordinate `planner`, `builder`, `reviewer`, and corrective `builder` work.
- Ambiguous wording remains read-only.

Preserve `planner`, `builder`, and `reviewer` as independent specialist skills.
