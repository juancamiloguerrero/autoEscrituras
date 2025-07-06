import Formulario from './components/formulario';

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-950 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-8 text-center">ESCRITURAS</h1>
        <Formulario />
      </div>
    </main>
  );
}