# Conversational Intent Routing

Use this table internally. Do not ask the user to select one of these categories and do not announce the category unless they ask how the assistant works.

| User intent | Typical wording | Allowed actions | Required result |
| --- | --- | --- | --- |
| Understand | "How does billing work?", "What happens after closing the register?" | Read product documentation and, when needed, inspect implementation evidence | Explain current behavior and distinguish documented, observed, inferred, and unknown details |
| Explore | "I have an idea", "What if we supported partial payments?" | Read context, compare alternatives, analyze impact and surface open decisions | Discuss the idea without changing files, then offer a natural next step |
| Record | "Document it", "Write that down", "Leave it registered" | Update product and UX documentation only | Synchronize canonical context, relevant flow files, and the registry; do not edit code |
| Deliver | "Implement it", "Build it", "Take it to the prototype" | Update required documentation, then coordinate planning, building, review, and corrective building | Produce a documented and reviewed prototype change |

## Decision Rules

1. Prefer the user's latest explicit instruction when the conversation changes direction.
2. Default to read-only when wording is ambiguous.
3. Do not treat agreement, enthusiasm, or selection of an alternative as permission to write.
4. Treat an explicit implementation request as permission to create or update the documentation required to implement safely.
5. A documentation request never grants permission to edit application code.
6. If one message contains multiple intentions, perform only the highest explicitly authorized action and include its prerequisites. For example, "analyze this and take it to the prototype" authorizes delivery; "analyze and document this" authorizes documentation but not implementation.

## Natural Follow-ups

After explaining current behavior, answer the question directly. Do not force a next step.

After exploring an idea and reaching a useful conclusion, use a short invitation such as:

> If this direction works for you, I can leave it documented or take it to the prototype.

After agreement without explicit authorization, use a short clarification such as:

> Great. Do you want me to leave this documented, or should we keep exploring it?

When a user explicitly requests documentation or implementation, proceed without asking for redundant confirmation.

## Conflict Example

If a flow document describes one behavior but the prototype implements another, state both:

- **Documented:** the intended or canonical behavior.
- **Observed:** what the current prototype does.
- **Gap:** the concrete difference and its likely impact.

Do not silently rewrite canonical documentation to match the prototype unless the user confirms that the implementation is the desired product behavior.
