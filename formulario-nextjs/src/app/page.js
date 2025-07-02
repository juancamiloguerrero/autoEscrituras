import Formulario from './components/formulario';

export default function Home() {
  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Escrituras</h1>
      <Formulario />
    </main>
  );
}