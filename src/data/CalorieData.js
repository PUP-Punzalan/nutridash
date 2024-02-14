let calorie_goal = 2000;
let calorie_eaten = 500;

let remaining_calories = calorie_goal - calorie_eaten;

const UserData = [
  {
    id: 1,
    label: "Calorie Eaten",
    calories: calorie_eaten,
  },
  {
    id: 2,
    label: "Remaining Calories",
    calories: remaining_calories,
  },
];

export { UserData, remaining_calories };
