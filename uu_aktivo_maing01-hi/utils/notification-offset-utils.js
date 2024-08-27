const formatCs = (notificationOffset) => {
  if (!notificationOffset || Object.keys(notificationOffset).length === 0) return "";
  const { days = 0, hours = 0, minutes = 0 } = notificationOffset;
  const daysString = days === 0 ? "" : days === 1 ? "1 den" : [2, 3, 4].includes(days) ? `${days} dny` : `${days} dní`;
  const hoursString =
    hours === 0 ? "" : hours === 1 ? "1 hodina" : [2, 3, 4].includes(hours) ? `${hours} hodiny` : `${hours} hodin`;
  const minutesString = minutes === 0 ? "" : `${minutes} minut`;
  const timeString = [hoursString, minutesString].filter((str) => !!str).join(" a ");
  return [daysString, timeString].filter((str) => !!str).join(", ");
};

const formatEn = (notificationOffset) => {
  if (!notificationOffset || Object.keys(notificationOffset).length === 0) return "";
  const { days = 0, hours = 0, minutes = 0 } = notificationOffset;
  const daysString = days === 0 ? "" : days === 1 ? "1 day" : `${days} days`;
  const hoursString = hours === 0 ? "" : hours === 1 ? "1 hour" : `${hours} hours`;
  const minutesString = minutes === 0 ? "" : `${minutes} minutes`;
  const timeString = [hoursString, minutesString].filter((str) => !!str).join(" and ");
  return [daysString, timeString].filter((str) => !!str).join(", ");
};

export const notificationOffsetToLsi = (notificationOffset) => {
  if (!notificationOffset || Object.keys(notificationOffset).length === 0) return { en: "", cs: "" };
  const en = formatEn(notificationOffset);
  const cs = formatCs(notificationOffset);
  return { en, cs };
};
