import * as RadixCheckBox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Props {
  label?: string;
  handler?: any;
  date?: Date;
  checked?: boolean;
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  completedHabits: string[];
}

export function CheckBox({ label, handler, date, checked = false }: Props) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  date &&
    useEffect(() => {
      api
        .get("day", {
          params: {
            date: date.toISOString(),
          },
        })
        .then((res) => setHabitsInfo(res.data));
    }, []);

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  async function handleTogglehabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`);

    const isCompleted = habitsInfo!.completedHabits.includes(habitId);

    let completedHabits: string[] = [];

    if (isCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    handler!(completedHabits.length);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {date ? (
        habitsInfo?.possibleHabits.map((habit) => {
          return (
            <RadixCheckBox.Root
              key={habit.id}
              onCheckedChange={() => handleTogglehabit(habit.id)}
              defaultChecked={habitsInfo.completedHabits.includes(habit.id)}
              disabled={isDateInPast}
              className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                <RadixCheckBox.Indicator>
                  <Check size={20} className="text-white" />
                </RadixCheckBox.Indicator>
              </div>

              <span
                className={
                  "font-semibold text-xl group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400 text-white leading-tight"
                }
              >
                {habit.title}
              </span>
            </RadixCheckBox.Root>
          );
        })
      ) : (
        <RadixCheckBox.Root
          className="flex items-center gap-3 group focus:outline-none"
          checked={checked}
          onCheckedChange={handler}
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
            <RadixCheckBox.Indicator>
              <Check size={20} className="text-white" />
            </RadixCheckBox.Indicator>
          </div>

          <span className={"text-white leading-tight"}>{label}</span>
        </RadixCheckBox.Root>
      )}
    </div>
  );
}
