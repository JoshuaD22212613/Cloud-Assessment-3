export type Phoneme = {
  symbol: string;
  label: string;
  example: string;
};

export const phonemes: Phoneme[] = [
  { symbol: "p", label: "P", example: "pin" },
  { symbol: "t", label: "T", example: "top" },
  { symbol: "k", label: "K", example: "cat" },
  { symbol: "b", label: "B", example: "bat" },
  { symbol: "d", label: "D", example: "dog" },
  { symbol: "ɡ", label: "G", example: "go" },

  { symbol: "n", label: "N", example: "net" },
  { symbol: "m", label: "M", example: "mat" },
  { symbol: "ŋ", label: "NG", example: "sing" },
  { symbol: "f", label: "F", example: "fish" },
  { symbol: "s", label: "S", example: "sun" },
  { symbol: "θ", label: "TH", example: "thin" },

  { symbol: "ʃ", label: "SH", example: "ship" },
  { symbol: "v", label: "V", example: "van" },
  { symbol: "z", label: "Z", example: "zip" },
  { symbol: "ð", label: "TH", example: "then" },
  { symbol: "ʒ", label: "ZH", example: "vision" },
  { symbol: "l", label: "L", example: "log" },

  { symbol: "ɹ", label: "R", example: "ring" },
  { symbol: "w", label: "W", example: "win" },
  { symbol: "j", label: "Y", example: "yes" },
  { symbol: "h", label: "H", example: "hat" },
  { symbol: "tʃ", label: "CH", example: "chin" },
  { symbol: "dʒ", label: "J", example: "jam" },

  { symbol: "iː", label: "EE", example: "see" },
  { symbol: "ɪ", label: "I", example: "sit" },
  { symbol: "e", label: "E", example: "bed" },
  { symbol: "æ", label: "A", example: "bad" },
  { symbol: "ɐ", label: "U", example: "sun" },
  { symbol: "ɐː", label: "AR", example: "bark" },

  { symbol: "ɜː", label: "ER", example: "bird" },
  { symbol: "ʉː", label: "OO", example: "boot" },
  { symbol: "ɔ", label: "O", example: "log" },
  { symbol: "oː", label: "OR", example: "fork" },
  { symbol: "ʊ", label: "OO", example: "book" },
  { symbol: "æɪ", label: "AY", example: "bait" },

  { symbol: "ɑe", label: "I", example: "bike" },
  { symbol: "oɪ", label: "OY", example: "boil" },
  { symbol: "əʉ", label: "OA", example: "boat" },
  { symbol: "æɔ", label: "OW", example: "cloud" },
  { symbol: "ɪə", label: "EAR", example: "beard" },
  { symbol: "eə", label: "AIR", example: "chair" },

  { symbol: "ə", label: "UH", example: "about" },
];