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
  return FREQUENCY_OPTIONS.filter((item) => {
    const { months, days } = item.value;
    if (months === 0 && days < notificationOffset.days + 1) return false;
    return true;
  });
};

export const FREQUENCY_LSI = FREQUENCY_OPTIONS.map((item) => item.children);
