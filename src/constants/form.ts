export const baseUrl = "https://interview.yoursadvisors.co.id"

export const choiceTypes = [
  "short answer",
  "paragraph",
  "date",
  "multiple choice",
  "dropdown",
  "checkboxes",
] as const;

export const staticChoices = ["React JS", "Vue JS", "Angular JS", "Svelte"]

export const questions = [
  { question_id: 1, title: "name", is_required: true },
  { question_id: 2, title: "address", is_required: false },
  { question_id: 3, title: "born date", is_required: true },
  { question_id: 4, title: "sex", is_required: true }
];