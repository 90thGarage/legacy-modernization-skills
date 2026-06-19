export default function Home() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center gap-10 px-6 py-12">
        <div className="space-y-4">
          <p className="font-mono text-sm font-medium uppercase tracking-normal text-muted-foreground">
            90thSkills sandbox
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Next.js target listo para probar planner, builder y reviewer.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Este proyecto esta limpio a proposito. Usalo como destino para que
            <span className="font-mono text-foreground"> /builder </span>
            genere una vista desde un handoff en
            <span className="font-mono text-foreground"> docs/ux/</span>.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "1. Planificar",
              command: "/planner",
              body: "Crear el brief UX y el handoff desde capturas o descripcion del flujo legacy.",
            },
            {
              title: "2. Construir",
              command: "/builder docs/ux/<view>-ui-handoff.md -> skill-flow-test/next-sandbox/src/features/<view>/",
              body: "Generar la vista React y agregar la ruta correspondiente en src/app.",
            },
            {
              title: "3. Revisar",
              command: "/reviewer",
              body: "Comparar la UI generada contra el handoff, capturas legacy y feedback.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[4px] border border-border bg-card p-5 text-card-foreground"
            >
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="mt-3 min-h-16 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
              <code className="mt-4 block overflow-x-auto rounded-[4px] bg-muted px-3 py-2 font-mono text-xs text-foreground">
                {item.command}
              </code>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
