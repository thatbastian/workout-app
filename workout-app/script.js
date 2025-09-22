// script.js — grouped workouts version
// Each workout can contain multiple exercises. Save as one collapsible element.

const STORAGE_KEY = 'gym-tracker:v2';

class GymTracker {
  constructor() {
    this.workouts = this.load();
    this.currentExercises = [];

    this.exerciseForm = document.getElementById('exercise-form');
    this.exerciseList = document.getElementById('exercise-list');
    this.saveWorkoutBtn = document.getElementById('save-workout-btn');
    this.workoutList = document.getElementById('workout-list');

    this.bindEvents();
    this.renderWorkouts();
  }

  bindEvents() {
    if (this.exerciseForm) {
      this.exerciseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ex = this.readExerciseForm();
        if (!ex) return;
        this.currentExercises.push(ex);
        this.exerciseForm.reset();
        document.getElementById('sets').value = 3;
        document.getElementById('reps').value = 8;
        this.renderCurrentExercises();
      });
    }

    if (this.saveWorkoutBtn) {
      this.saveWorkoutBtn.addEventListener('click', () => {
        if (!this.currentExercises.length) {
          alert('Add at least one exercise before saving a workout.');
          return;
        }
        const workout = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          exercises: this.currentExercises,
        };
        this.workouts.unshift(workout);
        this.save();
        this.currentExercises = [];
        this.renderCurrentExercises();
        this.renderWorkouts();
      });
    }
  }

  readExerciseForm() {
    const exercise = document.getElementById('exercise').value.trim();
    const sets = parseInt(document.getElementById('sets').value, 10);
    const reps = parseInt(document.getElementById('reps').value, 10);
    const weight = document.getElementById('weight').value;
    const notes = document.getElementById('notes').value.trim();

    if (!exercise || !sets || !reps) return null;

    return { exercise, sets, reps, weight: weight ? Number(weight) : null, notes: notes || null };
  }

  renderCurrentExercises() {
    this.exerciseList.innerHTML = '';
    if (!this.currentExercises.length) {
      this.exerciseList.innerHTML = '<li class="small-note">No exercises added yet.</li>';
      return;
    }
    this.currentExercises.forEach((ex, i) => {
      const li = document.createElement('li');
      li.textContent = `${ex.exercise} — ${ex.sets}×${ex.reps}${ex.weight ? ' @ ' + ex.weight + 'kg' : ''}`;
      if (ex.notes) li.textContent += ` (${ex.notes})`;
      this.exerciseList.appendChild(li);
    });
  }

  renderWorkouts() {
    this.workoutList.innerHTML = '';
    if (!this.workouts.length) {
      this.workoutList.innerHTML = '<div class="small-note">No workouts saved yet.</div>';
      return;
    }

    this.workouts.forEach((w) => {
      const details = document.createElement('details');
      details.className = 'workout-item';
      const summary = document.createElement('summary');
      const date = new Date(w.createdAt).toLocaleString();
      summary.textContent = `Workout — ${date} (${w.exercises.length} exercises)`;
      details.appendChild(summary);

      const ul = document.createElement('ul');
      w.exercises.forEach((ex) => {
        const li = document.createElement('li');
        li.textContent = `${ex.exercise} — ${ex.sets}×${ex.reps}${ex.weight ? ' @ ' + ex.weight + 'kg' : ''}`;
        if (ex.notes) li.textContent += ` (${ex.notes})`;
        ul.appendChild(li);
      });

      details.appendChild(ul);
      this.workoutList.appendChild(details);
    });
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.workouts));
  }

  load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}

window.addEventListener('DOMContentLoaded', () => new GymTracker());
