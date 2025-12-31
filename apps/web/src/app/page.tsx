export default function Home(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple mb-4">
          Tarot Reading App
        </h1>
        <p className="text-xl text-gray-600">
          Your daily mystical tarot card readings
        </p>
        <div className="mt-8 p-6 bg-gold-light rounded-lg">
          <p className="text-sm">🎴 Coming Soon...</p>
        </div>
      </div>
    </main>
  );
}
