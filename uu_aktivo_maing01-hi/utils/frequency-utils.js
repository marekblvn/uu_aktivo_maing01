//
export const FREQUENCY_OPTIONS = [
  {
    children: { en: "1 day", cs: "1 den" },
    value: { months: 0, days: 1 },
  },
  {
    children: { en: "2 days", cs: "2 dny" },
    value: { months: 0, days: 2 },
  },
  {
    children: { en: "3 days", cs: "3 dny" },
    value: { months: 0, days: 3 },
  },
  {
    children: { en: "1 week", cs: "1 týden" },
    value: { months: 0, days: 7 },
  },
  {
    children: { en: "2 weeks", cs: "2 týdny" },
    value: { months: 0, days: 14 },
  },
  {
    children: { en: "1 month", cs: "1 měsíc" },
    value: { months: 1, days: 0 },
  },
  {
    children: { en: "2 months", cs: "2 měsíce" },
    value: { months: 2, days: 0 },
  },
  {
    children: { en: "1 year", cs: "1 rok" },
    value: { months: 12, days: 0 },
  },
];

export const getIndexByValues = (frequency) => {
  const { months: freqMonths, days: freqDays } = frequency;
  return FREQUENCY_OPTIONS.findIndex((item) => {
    const { months, days } = item.value;
    return months === freqMonths && days === freqDays;
  });
};

export const limitedFrequencyOptions = (notificationOffset) => {
  if (notificationOffset.months === 0 && notificationOffset.days === 0) return FREQUENCY_OPTIONS;
  return FREQUENCY_OPTIONS.filter((item) => {
    const { months, days } = item.value;
    if (months === 0 && days < notificationOffset.days + 1) return false;
    return true;
  });
};

const formatCs = (frequency) => {
  if (!frequency || Object.keys(frequency).length === 0) return "";
  const { months = 0, days = 0 } = frequency;
  const monthsString =
    months === 0 ? "" : months === 1 ? "1 měsíc" : [2, 3, 4].includes(months) ? `${months} měsíce` : `${months} měsíců`;
  const daysString = days === 0 ? "" : days === 1 ? "1 den" : [2, 3, 4].includes(days) ? `${days} dny` : `${days} dní`;
  return [monthsString, daysString].filter((str) => !!str).join(" a ");
};

const formatEn = (frequency) => {
  if (!frequency || Object.keys(frequency).length === 0) return "";
  const { months = 0, days = 0 } = frequency;
  const monthsString = months === 0 ? "" : months === 1 ? "1 month" : `${months} months`;
  const daysString = days === 0 ? "" : days === 1 ? "1 day" : `${days} days`;
  return [monthsString, daysString].filter((str) => !!str).join(" and ");
};

export const getFrequencyOption = (frequency) => {
  const index = getIndexByValues(frequency);
  return FREQUENCY_OPTIONS[index];
};

export const FREQUENCY_LSI = FREQUENCY_OPTIONS.map((item) => item.children);
