import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import { CheckBox } from "./CheckBox";

const weekDays = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];

export function NewHabitForm() {
  const [title, setTitle] = useState("");

  const [weekDaysState, setWeekDaysState] = useState<number[]>([]);

  function createNewHabit(e: FormEvent) {
    e.preventDefault();

    if (!title || weekDays.length === 0) {
      return;
    }

    api.post("habits", {
      title,
      weekDays,
    });

    setTitle("");
    setWeekDaysState([]);

    alert("Hábito criado com sucesso");
  }

  function handleToggleWeekDay(weekDay: number) {
    if (weekDaysState.includes(weekDay)) {
      const treatedArr = weekDaysState.filter((day) => day !== weekDay);

      setWeekDaysState(treatedArr);
    } else {
      const treatedArr = [...weekDaysState, weekDay];

      setWeekDaysState(treatedArr);
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu compromentimento?
      </label>

      <input
        autoFocus
        id="title"
        type="text"
        placeholder="ex.: Execícios, Dormi bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {weekDays.map((weekDay, i) => (
          <CheckBox
            key={weekDay}
            label={weekDay}
            checked={weekDaysState.includes(i)}
            handler={() => handleToggleWeekDay(i)}
          />
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}
