import WorkoutForm from "@/components/Workouts/WorkoutForm"

export default function NewTreinoPage() {
  return (
    <div className="py-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold">Novo treino</h1>
        <p className="text-sm text-white/40 mt-0.5">
          Adicione os exercícios e inicie o registro.
        </p>
      </div>
      <WorkoutForm />
    </div>
  )
}
