const today = new Date();
today.setHours(today.getHours() - 9);

export const TODAY = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);
