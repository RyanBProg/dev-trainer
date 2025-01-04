import RootLayoutWrapper from "./components/RootLayoutWrapper";

export default function Home() {
  return (
    <RootLayoutWrapper>
      <section className="h-screen px-10">
        <h1 className="font-semibold text-2xl tracking-tight mt-64">
          Custom Cheatsheets
        </h1>
        <p className="font-bold text-white text-[5rem] tracking-tight capitalize leading-none">
          Shortcuts <span className="text-accent">you need,</span>
          <br />
          in <span className="text-info">one place</span>
        </p>
      </section>
    </RootLayoutWrapper>
  );
}
