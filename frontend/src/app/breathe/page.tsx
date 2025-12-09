import BreathingExercise from '@/components/BreathingExercise';

export default function BreathePage() {
  return (
    <div className="min-h-screen bg-serenova-bg flex flex-col items-center justify-center p-4 pb-24">
      <h1 className="text-2xl font-bold text-serenova-dark mb-8">
        Breathing Center
      </h1>
      <BreathingExercise />
    </div>
  );
}