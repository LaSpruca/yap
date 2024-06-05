import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./{src,example}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    log: false,
  },
};
